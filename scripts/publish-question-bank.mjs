import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { certificationRegistry } from "../lib/certifications.ts";

function localEnv() {
  try {
    return Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }));
  } catch { return {}; }
}

const env = { ...localEnv(), ...process.env };
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const pack = certificationRegistry.find((item) => item.id === "nsca-cscs-5");
if (!pack) throw new Error("CSCS content pack is missing.");

const now = new Date().toISOString();
const rows = pack.questions.flatMap((question) => {
  if (!question.en) throw new Error(`${question.id} is missing canonical English content.`);
  const refs = [{
    source: question.source,
    source_language: "en",
    edition: 5,
    derivation_type: "original_transformative",
    coverage_audit: "learner_supplied_practice_materials",
    factual_review_status: "aligned_english_5e",
    exam_format_eligible: true,
  }];
  const common = { certification_id: pack.id, external_id: question.id, domain_id: question.domain, cognition: question.cognition, answer_index: question.answer, source_refs: refs, version: 1, status: "published", published_at: now, updated_at: now };
  return [
    { ...common, language: "en", prompt: question.en.prompt, options: question.en.options, explanation: question.en.explanation },
    { ...common, language: "zh", prompt: question.prompt, options: question.options, explanation: question.explanation },
  ];
});

const { error } = await client.from("questions").upsert(rows, { onConflict: "certification_id,external_id,language,version", ignoreDuplicates: false });
if (error) throw error;
console.log(`Published ${pack.questions.length} bilingual questions (${rows.length} locale rows).`);
