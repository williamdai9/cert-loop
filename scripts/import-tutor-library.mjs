// Manual import only. No cron, generated answers, or changes to published lessons.
// Supply SUPABASE_SERVICE_ROLE_KEY securely in the environment.
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const input = JSON.parse(await readFile(process.argv[2], "utf8"));
for (const chunk of input.chunks || []) chunk.content = chunk.content.replaceAll("\u0000", "");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase server credentials");
if (!input.documents?.length || !input.chunks?.length) throw new Error("Empty corpus refused");
const db = createClient(url, key, { auth: { persistSession: false } });
// Upsert deterministic chunks. Old revisions are not silently deleted by this tool.
for (const table of ["documents", "chunks"]) {
  for (let i = 0; i < input[table].length; i += 100) {
    const { error } = await db.from(`tutor_${table}`).upsert(input[table].slice(i, i + 100));
    if (error) throw new Error(`${table} batch ${i}: ${error.message}`);
  }
  console.log(`Imported ${input[table].length} ${table}`);
}
