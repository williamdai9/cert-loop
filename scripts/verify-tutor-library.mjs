// Explicit integration check. Creates and removes only its own temporary learner.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !service || !anon) throw new Error("Missing test credentials");
const admin = createClient(url, service, { auth: { persistSession: false } });
const client = createClient(url, anon, { auth: { persistSession: false } });
const email = `tutor-verification-${randomUUID()}@example.invalid`;
const password = randomUUID() + randomUUID();
const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
assert.ifError(error);
const userId = data.user.id;
try {
  const login = await client.auth.signInWithPassword({ email, password }); assert.ifError(login.error);
  assert.ok((await client.rpc("search_tutor_library", { search_terms: ["sarcomere"] })).error, "Onboarding guard");
  assert.ok((await client.from("tutor_chunks").select("id").limit(1)).error, "No raw authenticated reads");
  const progress = await admin.from("user_progress").upsert({ user_id: userId, certification_id: "nsca-cscs-5", state: { onboardingChoice: "zero", domainStats: {} } });
  assert.ifError(progress.error);
  for (const terms of [["sarcomere", "muscle", "肌肉"], ["periodization", "周期化"], ["glycolysis", "糖酵解"]]) {
    const result = await client.rpc("search_tutor_library", { search_terms: terms, preferred_chapter: 1 });
    assert.ifError(result.error);
    assert.ok(result.data.some(row => row.kind === "textbook" && row.page > 0), "Book page evidence");
    assert.ok(result.data.length <= 15);
    console.log(JSON.stringify({ terms, hits: result.data.length, kinds: [...new Set(result.data.map(row => row.kind))], bookPages: result.data.filter(row => row.kind === "textbook").map(row => row.page) }));
  }
  const status = await client.rpc("tutor_library_status"); assert.ifError(status.error);
  console.log("Coverage", JSON.stringify(status.data));
  const checks = [];
  for (let i=0;i<7;i++) checks.push((await client.rpc("consume_tutor_request")).data);
  assert.deepEqual(checks, [true,true,true,true,true,true,false]);
  console.log("Authenticated retrieval, private tables and rate guard passed.");
} finally {
  const removed = await admin.auth.admin.deleteUser(userId);
  assert.ifError(removed.error);
  console.log("Temporary test learner removed; real learner data unchanged.");
}
