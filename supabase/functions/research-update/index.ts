import { createClient } from "npm:@supabase/supabase-js@2";

const certificationId = "nsca-cscs-5";
const provider = "Europe PMC";

type EuropeResult = {
  id?: string; pmid?: string; doi?: string; title?: string; authorString?: string;
  journalTitle?: string; firstPublicationDate?: string; abstractText?: string;
};

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

function dateOnly(date: Date) { return date.toISOString().slice(0, 10); }

async function curate(items: Array<Record<string, unknown>>) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey || !items.length) return null;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("OPENAI_RESEARCH_MODEL") || "gpt-5.6-luna",
      reasoning: { effort: "low" },
      instructions: `You curate a CSCS research watch. The English fifth-edition textbook and official NSCA DCO remain the exam source of truth. For each supplied paper, write a cautious two-sentence English digest and one-sentence Chinese support note, map it to CSCS chapters 1-26, and draft one original three-option application question only when the abstract supports it. Never claim causality beyond the design. Return JSON only with shape {"items":[{"external_id":"","summary_en":"","summary_zh":"","chapter_numbers":[1],"relevance":0.0,"question":null|{"domain_id":"","prompt":"","options":["","",""],"answer_index":0,"explanation":""}}]}.`,
      input: JSON.stringify(items),
      max_output_tokens: 3200,
      text: { format: { type: "json_schema", name: "research_digest", strict: true, schema: { type: "object", additionalProperties: false, required: ["items"], properties: { items: { type: "array", items: { type: "object", additionalProperties: false, required: ["external_id", "summary_en", "summary_zh", "chapter_numbers", "relevance", "question"], properties: { external_id: { type: "string" }, summary_en: { type: "string" }, summary_zh: { type: "string" }, chapter_numbers: { type: "array", items: { type: "integer", minimum: 1, maximum: 26 } }, relevance: { type: "number", minimum: 0, maximum: 1 }, question: { anyOf: [{ type: "null" }, { type: "object", additionalProperties: false, required: ["domain_id", "prompt", "options", "answer_index", "explanation"], properties: { domain_id: { type: "string" }, prompt: { type: "string" }, options: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } }, answer_index: { type: "integer", minimum: 0, maximum: 2 }, explanation: { type: "string" } } }] } } } } } } } },
    }),
  });
  if (!response.ok) return null;
  const payload = await response.json();
  const text = payload.output_text || payload.output?.flatMap((entry: { content?: Array<{ type?: string; text?: string }> }) => entry.content || []).find((entry: { type?: string }) => entry.type === "output_text")?.text;
  try { return JSON.parse(text || ""); } catch { return null; }
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Supabase server credentials unavailable" }, 500);
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: recent } = await supabase.from("research_sync_runs").select("started_at,status").eq("provider", provider).order("started_at", { ascending: false }).limit(1).maybeSingle();
  if (recent?.started_at && Date.now() - new Date(recent.started_at).getTime() < 6 * 60 * 60 * 1000) return json({ status: "throttled", message: "A research sync ran within the last six hours." });

  const { data: run } = await supabase.from("research_sync_runs").insert({ provider, status: "running" }).select("id").single();
  const end = new Date(); const start = new Date(); start.setUTCDate(start.getUTCDate() - 4);
  const query = `FIRST_PDATE:[${dateOnly(start)} TO ${dateOnly(end)}] AND (TITLE_ABS:"resistance training" OR TITLE_ABS:"strength training" OR TITLE_ABS:"sports performance" OR TITLE_ABS:"plyometric" OR TITLE_ABS:"athlete recovery" OR TITLE_ABS:"sports nutrition")`;
  const endpoint = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&resultType=core&pageSize=20&sort_date=y`;

  try {
    const response = await fetch(endpoint, { headers: { "User-Agent": "CertLoopResearchWatch/1.0" } });
    if (!response.ok) throw new Error(`Europe PMC returned ${response.status}`);
    const payload = await response.json();
    const results = (payload.resultList?.result || []) as EuropeResult[];
    const rows = results.filter(item => item.title && (item.id || item.pmid)).map(item => {
      const externalId = item.pmid || item.id!;
      return { certification_id: certificationId, provider, external_id: externalId, title: item.title!, authors: item.authorString || null, journal: item.journalTitle || null, published_at: item.firstPublicationDate?.slice(0, 10) || null, source_url: item.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/` : `https://europepmc.org/article/${item.id}`, doi: item.doi || null, abstract: item.abstractText?.slice(0, 12000) || null, updated_at: new Date().toISOString() };
    });
    if (rows.length) await supabase.from("research_items").upsert(rows, { onConflict: "provider,external_id", ignoreDuplicates: false });

    const digest = await curate(rows.slice(0, 10).map(row => ({ external_id: row.external_id, title: row.title, abstract: row.abstract })) as Array<Record<string, unknown>>);
    for (const item of digest?.items || []) {
      await supabase.from("research_items").update({ summary_en: item.summary_en, summary_zh: item.summary_zh, chapter_numbers: item.chapter_numbers, relevance: item.relevance, curation_status: "ai_draft", updated_at: new Date().toISOString() }).eq("provider", provider).eq("external_id", item.external_id);
      if (item.question) await supabase.from("content_review_queue").insert({ certification_id: certificationId, item_type: "question", confidence: item.relevance, payload: { origin: "daily-research", provider, external_id: item.external_id, status_note: "AI draft; human review required before question-bank publication", ...item.question } });
    }

    if (run?.id) await supabase.from("research_sync_runs").update({ status: "success", found_count: rows.length, inserted_count: rows.length, finished_at: new Date().toISOString() }).eq("id", run.id);
    return json({ status: "success", found: rows.length, curated: digest?.items?.length || 0 });
  } catch (error) {
    if (run?.id) await supabase.from("research_sync_runs").update({ status: "failed", message: error instanceof Error ? error.message : String(error), finished_at: new Date().toISOString() }).eq("id", run.id);
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});

