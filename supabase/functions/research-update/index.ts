import { createClient } from "npm:@supabase/supabase-js@2";

const certificationId = "nsca-cscs-5";
const syncProvider = "Cert Loop multi-source watch v2";
const userAgent = "CertLoopResearchWatch/1.1 (educational evidence monitor)";

type ResearchRow = {
  certification_id: string; provider: string; external_id: string; title: string;
  authors: string | null; journal: string | null; published_at: string | null;
  source_url: string; doi: string | null; abstract: string | null; updated_at: string;
};

type EuropeResult = {
  id?: string; pmid?: string; doi?: string; title?: string; authorString?: string;
  journalTitle?: string; firstPublicationDate?: string; abstractText?: string;
};

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const dateOnly = (date: Date) => date.toISOString().slice(0, 10);
const stripCdata = (value: string) => value.replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "");
const decodeEntities = (value: string) => value
  .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
const plainText = (value: string) => decodeEntities(decodeEntities(stripCdata(value)).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const tagRaw = (block: string, name: string) => block.match(new RegExp(`<${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}>`, "i"))?.[1] || "";
const tagText = (block: string, name: string) => plainText(tagRaw(block, name));
const parsedDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : dateOnly(date); };

async function fetchEuropePmc(): Promise<ResearchRow[]> {
  const end = new Date(); const start = new Date(); start.setUTCDate(start.getUTCDate() - 4);
  const query = `FIRST_PDATE:[${dateOnly(start)} TO ${dateOnly(end)}] AND (TITLE_ABS:"resistance training" OR TITLE_ABS:"strength training" OR TITLE_ABS:"sports performance" OR TITLE_ABS:"plyometric" OR TITLE_ABS:"athlete recovery" OR TITLE_ABS:"sports nutrition")`;
  const endpoint = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&resultType=core&pageSize=20&sort_date=y`;
  const response = await fetch(endpoint, { headers: { "User-Agent": userAgent } });
  if (!response.ok) throw new Error(`Europe PMC returned ${response.status}`);
  const payload = await response.json();
  return ((payload.resultList?.result || []) as EuropeResult[]).filter(item => item.title && (item.id || item.pmid)).map(item => {
    const externalId = item.pmid || item.id!;
    return { certification_id: certificationId, provider: "Europe PMC", external_id: externalId, title: plainText(item.title!), authors: item.authorString || null, journal: item.journalTitle || null, published_at: item.firstPublicationDate?.slice(0, 10) || null, source_url: item.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/` : `https://europepmc.org/article/${item.id}`, doi: item.doi || null, abstract: item.abstractText ? plainText(item.abstractText).slice(0, 12000) : null, updated_at: new Date().toISOString() };
  });
}

async function fetchNscaOfficial(): Promise<ResearchRow[]> {
  const response = await fetch("https://www.nsca.com/rss/", { headers: { "User-Agent": userAgent, Accept: "application/rss+xml, application/xml" } });
  if (!response.ok) throw new Error(`NSCA RSS returned ${response.status}`);
  const xml = await response.text();
  return Array.from(xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)).slice(0, 15).map(match => {
    const block = match[1];
    const sourceUrl = decodeEntities(stripCdata(tagRaw(block, "link"))).trim();
    return { certification_id: certificationId, provider: "NSCA official", external_id: sourceUrl, title: tagText(block, "title"), authors: tagText(block, "dc:creator") || null, journal: "NSCA Articles", published_at: parsedDate(tagText(block, "pubDate")), source_url: sourceUrl, doi: null, abstract: tagText(block, "description").slice(0, 12000) || null, updated_at: new Date().toISOString() };
  }).filter(row => row.title && row.source_url.startsWith("https://www.nsca.com/"));
}

async function fetchCommunityLeads(): Promise<ResearchRow[]> {
  const endpoint = "https://api.stackexchange.com/2.3/questions?site=fitness&order=desc&sort=creation&pagesize=30&filter=withbody";
  const response = await fetch(endpoint, { headers: { "User-Agent": userAgent, Accept: "application/json" } });
  if (!response.ok) throw new Error(`Stack Exchange API returned ${response.status}`);
  const payload = await response.json() as { items?: Array<{ question_id: number; title: string; body?: string; link: string; creation_date: number; tags?: string[]; owner?: { display_name?: string } }> };
  const relevance = /\b(strength|power|squat|deadlift|bench|hypertrophy|periodization|plyometric|conditioning|recovery|training|coach)\b/i;
  return (payload.items || []).filter(item => relevance.test(`${plainText(item.title)} ${item.body ? plainText(item.body) : ""} ${(item.tags || []).join(" ")}`)).slice(0, 10).map(item => ({ certification_id: certificationId, provider: "Stack Exchange community lead", external_id: String(item.question_id), title: plainText(item.title), authors: item.owner?.display_name ? plainText(item.owner.display_name) : null, journal: "Physical Fitness Stack Exchange · unverified community lead", published_at: dateOnly(new Date(item.creation_date * 1000)), source_url: item.link, doi: null, abstract: item.body ? plainText(item.body).slice(0, 8000) : null, updated_at: new Date().toISOString() }));
}

async function curate(items: Array<Record<string, unknown>>) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey || !items.length) return null;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("OPENAI_RESEARCH_MODEL") || "gpt-5.6-luna",
      reasoning: { effort: "low" },
      instructions: `You curate a CSCS multi-source evidence watch. The English fifth-edition textbook and official NSCA DCO remain exam truth. Label NSCA material as official enrichment, research as new evidence, and Stack Exchange as an unverified community lead. For each item, write a cautious two-sentence English digest and one-sentence Chinese support note, map it to CSCS chapters 1-26, and assign relevance. A community lead must have question=null and must never modify course claims unless corroborated by an official or primary source. For non-community items, draft at most one original three-option application question only when the source supports it. Never claim causality beyond the design. Return JSON only with shape {"items":[{"external_id":"","summary_en":"","summary_zh":"","chapter_numbers":[1],"relevance":0.0,"question":null|{"domain_id":"","prompt":"","options":["","" ,""],"answer_index":0,"explanation":""}}]}.`,
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

  const { data: recent } = await supabase.from("research_sync_runs").select("started_at,status").eq("provider", syncProvider).order("started_at", { ascending: false }).limit(1).maybeSingle();
  if (recent?.started_at && Date.now() - new Date(recent.started_at).getTime() < 6 * 60 * 60 * 1000) return json({ status: "throttled", message: "A multi-source research sync ran within the last six hours." });

  const { data: run } = await supabase.from("research_sync_runs").insert({ provider: syncProvider, status: "running" }).select("id").single();
  try {
    const settled = await Promise.allSettled([fetchEuropePmc(), fetchNscaOfficial(), fetchCommunityLeads()]);
    const rows = settled.flatMap(result => result.status === "fulfilled" ? result.value : []);
    const warnings = settled.flatMap(result => result.status === "rejected" ? [result.reason instanceof Error ? result.reason.message : String(result.reason)] : []);
    if (!rows.length) throw new Error(warnings.join("; ") || "All daily sources returned no records");
    await supabase.from("research_items").upsert(rows, { onConflict: "provider,external_id", ignoreDuplicates: false });

    const curationRows = [...rows].sort((a, b) => Number(a.provider.includes("community lead")) - Number(b.provider.includes("community lead"))).slice(0, 12);
    const digest = await curate(curationRows.map(row => ({ provider: row.provider, external_id: row.external_id, title: row.title, abstract: row.abstract })) as Array<Record<string, unknown>>);
    for (const item of digest?.items || []) {
      const source = rows.find(row => row.external_id === item.external_id);
      if (!source) continue;
      await supabase.from("research_items").update({ summary_en: item.summary_en, summary_zh: item.summary_zh, chapter_numbers: item.chapter_numbers, relevance: item.relevance, curation_status: "ai_draft", updated_at: new Date().toISOString() }).eq("provider", source.provider).eq("external_id", item.external_id);
      if (item.question && !source.provider.includes("community lead")) await supabase.from("content_review_queue").insert({ certification_id: certificationId, item_type: "question", confidence: item.relevance, payload: { origin: "daily-research", provider: source.provider, external_id: item.external_id, status_note: "AI draft; human review required before question-bank publication", ...item.question } });
    }

    const byProvider = rows.reduce<Record<string, number>>((counts, row) => ({ ...counts, [row.provider]: (counts[row.provider] || 0) + 1 }), {});
    if (run?.id) await supabase.from("research_sync_runs").update({ status: "success", found_count: rows.length, inserted_count: rows.length, message: warnings.length ? warnings.join("; ") : null, finished_at: new Date().toISOString() }).eq("id", run.id);
    return json({ status: "success", found: rows.length, by_provider: byProvider, warnings, curated: digest?.items?.length || 0 });
  } catch (error) {
    if (run?.id) await supabase.from("research_sync_runs").update({ status: "failed", message: error instanceof Error ? error.message : String(error), finished_at: new Date().toISOString() }).eq("id", run.id);
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
