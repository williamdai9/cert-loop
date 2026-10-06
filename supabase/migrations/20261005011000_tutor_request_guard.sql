-- One row per learner, no history accumulation or scheduled cleanup.
create table public.tutor_request_windows (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  requests integer not null
);
alter table public.tutor_request_windows enable row level security;
revoke all on public.tutor_request_windows from anon, authenticated;
create function public.consume_tutor_request() returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
declare used integer;
begin
  if auth.uid() is null then raise insufficient_privilege; end if;
  insert into public.tutor_request_windows(user_id,window_start,requests)
  values(auth.uid(),now(),1)
  on conflict(user_id) do update set
    requests=case when tutor_request_windows.window_start < now()-interval '1 minute' then 1 else tutor_request_windows.requests+1 end,
    window_start=case when tutor_request_windows.window_start < now()-interval '1 minute' then now() else tutor_request_windows.window_start end
  returning requests into used;
  return used<=6;
end $$;
revoke all on function public.consume_tutor_request() from public,anon;
grant execute on function public.consume_tutor_request() to authenticated;
