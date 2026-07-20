import { NextResponse } from "next/server";

type ResearchRow = { id: string; provider: string; external_id: string; title: string; abstract?: string; source_url: string };

function responseText(payload: { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }) {
  return payload.output_text || (payload.output || []).flatMap(item => item.content || []).find(item => item.type === "output_text")?.text || "";
}

async function curateWithGateway(request: Request) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const gatewayKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || request.headers.get("x-vercel-oidc-token");
  if (!base || !serviceKey || !gatewayKey) return { curated: 0, reason: "Server curation credentials unavailable" };
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };
  const sourceResponse = await fetch(`${base}/rest/v1/research_items?select=id,provider,external_id,title,abstract,source_url&curation_status=eq.source_only&abstract=not.is.null&order=published_at.desc&limit=30`, { headers, cache: "no-store" });
  if (!sourceResponse.ok) return { curated: 0, reason: "Could not read the research queue" };
  const rows = (await sourceResponse.json() as ResearchRow[]).sort((a, b) => Number(a.provider.includes("community lead")) - Number(b.provider.includes("community lead"))).slice(0, 12);
  if (!rows.length) return { curated: 0, reason: "No new source-only abstracts" };

  const aiResponse = await fetch("https://ai-gateway.vercel.sh/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${gatewayKey}`, "Content-Type": "application/json" }, body: JSON.stringify({
    model: process.env.AI_GATEWAY_RESEARCH_MODEL || "openai/gpt-5.6-luna",
    reasoning: { effort: "low" },
    instructions: `Curate a daily multi-source CSCS evidence watch. The English fifth-edition textbook and official NSCA DCO remain exam truth. Label NSCA material as official enrichment, open research as new evidence, and Stack Exchange as an unverified community lead. Create a cautious English digest, Chinese support note, CSCS chapter mapping, and relevance 0-1. Community leads must have question=null and cannot modify course claims without corroboration. For non-community items, draft at most one original three-option application question only when supported. Never overstate causality or turn a single source into an exam rule. Return JSON only: {"items":[{"id":"uuid","summary_en":"","summary_zh":"","chapter_numbers":[1],"relevance":0.5,"question":null|{"domain_id":"","prompt":"","options":["","",""],"answer_index":0,"explanation":""}}]}.`,
    input: JSON.stringify(rows), max_output_tokens: 3200,
    text: { format: { type: "json_schema", name: "research_digest", strict: true, schema: { type: "object", additionalProperties: false, required: ["items"], properties: { items: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "summary_en", "summary_zh", "chapter_numbers", "relevance", "question"], properties: { id: { type: "string" }, summary_en: { type: "string" }, summary_zh: { type: "string" }, chapter_numbers: { type: "array", items: { type: "integer", minimum: 1, maximum: 26 } }, relevance: { type: "number", minimum: 0, maximum: 1 }, question: { anyOf: [{ type: "null" }, { type: "object", additionalProperties: false, required: ["domain_id", "prompt", "options", "answer_index", "explanation"], properties: { domain_id: { type: "string" }, prompt: { type: "string" }, options: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } }, answer_index: { type: "integer", minimum: 0, maximum: 2 }, explanation: { type: "string" } } }] } } } } } } } },
  }) });
  if (!aiResponse.ok) return { curated: 0, reason: `AI Gateway returned ${aiResponse.status}` };
  const result = await aiResponse.json();
  let digest: { items?: Array<{ id: string; summary_en: string; summary_zh: string; chapter_numbers: number[]; relevance: number; question?: Record<string, unknown> | null }> };
  try { digest = JSON.parse(responseText(result)); } catch { return { curated: 0, reason: "AI digest was not valid JSON" }; }
  let curated = 0;
  for (const item of digest.items || []) {
    if (!rows.some(row => row.id === item.id)) continue;
    const update = await fetch(`${base}/rest/v1/research_items?id=eq.${encodeURIComponent(item.id)}`, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ summary_en: item.summary_en, summary_zh: item.summary_zh, chapter_numbers: item.chapter_numbers, relevance: item.relevance, curation_status: "ai_draft", updated_at: new Date().toISOString() }) });
    if (!update.ok) continue;
    curated += 1;
    const source = rows.find(row => row.id === item.id);
    if (item.question && source && !source.provider.includes("community lead")) await fetch(`${base}/rest/v1/content_review_queue`, { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ certification_id: "nsca-cscs-5", item_type: "question", confidence: item.relevance, payload: { origin: "daily-research", provider: source.provider, research_item_id: item.id, status_note: "AI draft; human review required before question-bank publication", ...item.question } }) });
  }
  return { curated };
}

export async function GET(request: Request) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const response = await fetch(`${base}/functions/v1/research-update`, { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store" });
  const payload = await response.json().catch(() => ({ error: "Research service returned an invalid response." }));
  const curation = response.ok ? await curateWithGateway(request) : { curated: 0, reason: "Source sync failed" };
  return NextResponse.json({ ...payload, curation }, { status: response.status });
}
