import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized maintenance request." }, { status: 401 });
  }

  if (!base || !anonKey) {
    return NextResponse.json({ error: "Supabase keep-alive is not configured." }, { status: 503 });
  }

  const response = await fetch(
    `${base}/rest/v1/certifications?select=id&id=eq.nsca-cscs-5&limit=1`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Supabase keep-alive query failed.", status: response.status },
      { status: 502 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
