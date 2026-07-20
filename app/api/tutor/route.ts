import { NextResponse } from "next/server";
import { buildTutorContext } from "@/lib/tutor-context";

type Incoming = {
  question?: string;
  lang?: "en" | "zh";
  research?: boolean;
  context?: { chapterNumber?: number; chapterTitle?: string; taskId?: string; taskTitle?: string };
  mastery?: Record<string, { correct: number; total: number }>;
  history?: Array<{ role: "user" | "assistant"; text: string }>;
};

type ResponseOutput = { type?: string; content?: Array<{ type?: string; text?: string; annotations?: Array<{ type?: string; title?: string; url?: string }> }> };

function outputText(payload: { output_text?: string; output?: ResponseOutput[] }) {
  if (payload.output_text) return payload.output_text;
  return (payload.output || []).flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text || "").join("\n").trim();
}

function webSources(payload: { output?: ResponseOutput[] }) {
  const found = (payload.output || []).flatMap(item => item.content || []).flatMap(item => item.annotations || []).filter(item => item.url);
  return Array.from(new Map(found.map(item => [item.url, { title: item.title || new URL(item.url!).hostname, url: item.url, kind: "web" as const }])).values()).slice(0, 8);
}

async function recentResearch(question: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/research_items?select=title,summary_en,summary_zh,source_url,published_at,chapter_numbers&order=published_at.desc&limit=12`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 900 } }).catch(() => null);
  if (!response?.ok) return [];
  const items = await response.json() as Array<{ title: string; summary_en?: string; summary_zh?: string; source_url: string; published_at?: string; chapter_numbers?: number[] }>;
  const terms = question.toLowerCase().split(/\W+/).filter(term => term.length > 3);
  return items.map(item => ({ ...item, score: terms.reduce((score, term) => score + (`${item.title} ${item.summary_en || ""}`.toLowerCase().includes(term) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score).slice(0, 5);
}

export async function POST(request: Request) {
  const directOpenAI = process.env.OPENAI_API_KEY;
  const gatewayToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  const apiKey = directOpenAI || gatewayToken;
  if (!apiKey) return NextResponse.json({ error: "AI credentials are unavailable locally. Production uses Vercel's short-lived OIDC token automatically; for local use, add AI_GATEWAY_API_KEY or OPENAI_API_KEY." }, { status: 503 });

  let body: Incoming;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const question = body.question?.trim();
  if (!question || question.length > 2000) return NextResponse.json({ error: "Ask a question between 1 and 2,000 characters." }, { status: 400 });

  const grounded = buildTutorContext(question, body.context, body.mastery);
  const research = await recentResearch(question);
  const researchText = research.length ? research.map(item => `[Research watch · ${item.published_at || "recent"}] ${item.title}\n${item.summary_en || "Metadata only; inspect the linked primary source."}\nURL: ${item.source_url}`).join("\n\n") : "No matching reviewed research item in the daily feed.";
  const languageRule = body.lang === "zh" ? "Answer in clear Chinese, but keep all tested English terms and formulas in English beside the translation." : "Answer in English first. Add a short Chinese support note only when it materially prevents confusion.";
  const history = (body.history || []).slice(-8).map(item => `${item.role.toUpperCase()}: ${item.text}`).join("\n");
  const useWeb = Boolean(body.research);

  const instructions = `You are Cert Loop's CSCS tutor. You teach a learner from zero to exam readiness and can reason across the entire course, never only the open chapter.

SOURCE HIERARCHY
1. English fifth-edition CSCS course synthesis and the official NSCA Detailed Content Outline are the exam source of truth.
2. Official NSCA policy pages control current eligibility, exam administration, and policy.
3. Systematic reviews, consensus statements, and primary research may enrich coaching practice but must be labeled "Recent research—not an exam-key override."
4. Community claims are leads only. Never treat popularity as evidence.

BEHAVIOR
- ${languageRule}
- Explain mechanism → coaching decision → exam trap. Use a worked example when useful.
- Cite internal material inline as [Course Ch. N › Section].
- If live web search is enabled, cite sources returned by the tool and state whether each is official, research, or community.
- Do not fabricate a textbook quote, page number, study, or official rule. Do not provide medical diagnosis; identify referral boundaries.
- Use the learner's mastery record to calibrate depth, but never tell a learner to permanently skip a tested domain. "Fast-track with a checkpoint" is allowed.

FULL COURSE MAP
${grounded.courseIndex}

RETRIEVED COURSE EVIDENCE
${grounded.excerpts}

RELEVANT QUESTION-BANK REASONING
${grounded.questions || "No direct match."}

LEARNER MASTERY
${grounded.masterySummary}

DAILY RESEARCH FEED
${researchText}`;

  const payload = {
    model: directOpenAI ? (process.env.OPENAI_TUTOR_MODEL || "gpt-5.6-terra") : (process.env.AI_GATEWAY_TUTOR_MODEL || "openai/gpt-5.6-terra"),
    reasoning: { effort: useWeb ? "medium" : "low" },
    instructions,
    input: `${history ? `RECENT CONVERSATION\n${history}\n\n` : ""}CURRENT QUESTION\n${question}`,
    max_output_tokens: 1600,
    ...(useWeb ? { tools: [{ type: "web_search" }], include: ["web_search_call.action.sources"] } : {}),
  };

  const endpoint = directOpenAI ? "https://api.openai.com/v1/responses" : "https://ai-gateway.vercel.sh/v1/responses";
  const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const result = await response.json();
  if (!response.ok) return NextResponse.json({ error: result?.error?.message || "The tutor could not answer right now." }, { status: response.status });
  const answer = outputText(result);
  const sources = [...grounded.internalSources.slice(0, 5), ...research.map(item => ({ title: item.title, url: item.source_url, kind: "research" as const })), ...webSources(result)];
  return NextResponse.json({ answer, sources: Array.from(new Map(sources.map(item => [item.url || item.title, item])).values()).slice(0, 12), researched: useWeb });
}
