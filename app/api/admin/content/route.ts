import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cscsCourse } from "@/lib/course";
import { certificationRegistry } from "@/lib/certifications";
import { courseMedia } from "@/lib/course-media";
import { chapterOneVisualCoverage } from "@/lib/chapter-one-visual-coverage";

export const dynamic = "force-dynamic";

function adminEmails() {
  return new Set((process.env.CERT_LOOP_ADMIN_EMAILS || "")
    .split(",")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean));
}

function staticAudit() {
  const pack = certificationRegistry[0];
  const chapters = cscsCourse.map(chapter => {
    const media = courseMedia[chapter.n];
    const explanationParagraphs = chapter.sections.reduce((sum, section) => sum + section.explanation.length, 0);
    const knowledgePoints = chapter.sections.reduce((sum, section) => sum + section.details.length, 0);
    return {
      chapter: chapter.n,
      title: chapter.title,
      sections: chapter.sections.length,
      explanationParagraphs,
      knowledgePoints,
      recallChecks: chapter.recall.length,
      atlasModels: media?.textbookAtlas.length || 0,
      textbookFigures: media?.textbookFigures?.length || 0,
      noteFigures: media?.noteFigures?.length || 0,
      mindMap: Boolean(media?.mindMap),
      depthReady: chapter.sections.length >= 4 && chapter.sections.every(section => section.explanation.length >= 2 && section.details.length >= 4),
      figureAudit: chapter.n <= 12 ? "complete" : "pending",
    };
  });
  const questionDomains = pack.domains.map(domain => ({
    id: domain.id,
    label: domain.en,
    count: pack.questions.filter(question => question.domain === domain.id).length,
  }));
  const mediaPaths = Array.from(new Set(Object.values(courseMedia).flatMap(media => [
    ...(media.mindMap ? [media.mindMap.path] : []),
    ...(media.textbookFigures || []).map(figure => figure.path),
    ...(media.noteFigures || []).map(figure => figure.path),
  ])));

  return {
    pack: {
      id: pack.id,
      acronym: pack.acronym,
      name: pack.name,
      edition: pack.edition,
      description: pack.description,
      sourceNote: pack.sourceNote,
      verifiedOn: pack.verifiedOn,
      officialFacts: pack.officialFacts,
      officialSources: pack.officialSources,
      exam: pack.exam,
      domains: pack.domains,
      plan: pack.plan,
      quickCards: pack.quickCards,
    },
    chapters: cscsCourse,
    questions: pack.questions,
    media: Object.entries(courseMedia).map(([chapter, media]) => ({ chapter: Number(chapter), ...media })),
    mediaPaths,
    chapterOneVisualCoverage,
    audit: {
      chapters,
      questionDomains,
      totals: {
        chapters: cscsCourse.length,
        sections: cscsCourse.reduce((sum, chapter) => sum + chapter.sections.length, 0),
        explanationParagraphs: chapters.reduce((sum, chapter) => sum + chapter.explanationParagraphs, 0),
        knowledgePoints: chapters.reduce((sum, chapter) => sum + chapter.knowledgePoints, 0),
        questions: pack.questions.length,
        atlasModels: Object.values(courseMedia).reduce((sum, media) => sum + media.textbookAtlas.length, 0),
        textbookFigures: Object.values(courseMedia).reduce((sum, media) => sum + (media.textbookFigures?.length || 0), 0),
        noteFigures: Object.values(courseMedia).reduce((sum, media) => sum + (media.noteFigures?.length || 0), 0),
        mindMaps: Object.values(courseMedia).filter(media => media.mindMap).length,
        figureAuditsComplete: 12,
      },
    },
  };
}

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!url || !anonKey || !token) return NextResponse.json({ error: "Sign in with an administrator account." }, { status: 401 });

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  const user = userData.user;
  if (userError || !user?.email) return NextResponse.json({ error: "Your administrator session expired." }, { status: 401 });
  const allowed = adminEmails().has(user.email.toLowerCase()) || user.app_metadata?.cert_loop_admin === true;
  if (!allowed) return NextResponse.json({ error: "This account is not authorized for the content inspector." }, { status: 403 });

  const base = staticAudit();
  if (!serviceKey) return NextResponse.json({
    ...base,
    actor: { email: user.email },
    generatedAt: new Date().toISOString(),
    cloud: { status: "unavailable", errors: ["Server-side Supabase administration is not configured in this environment."], lessons: [], questions: [], sources: [], research: [], reviewQueue: [], syncRuns: [], signedMedia: {} },
  }, { headers: { "Cache-Control": "no-store" } });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const [lessons, questions, sources, research, reviewQueue, syncRuns, signedMedia] = await Promise.all([
    admin.from("lessons").select("id,task_id,language,title,summary,content,source_refs,version,status,updated_at").eq("certification_id", base.pack.id).order("task_id").order("language").limit(1000),
    admin.from("questions").select("id,external_id,language,domain_id,cognition,prompt,options,answer_index,explanation,source_refs,version,status,updated_at").eq("certification_id", base.pack.id).order("external_id").order("language").limit(1000),
    admin.from("sources").select("id,title,url,source_type,trust_level,published_at,checked_at,metadata").eq("certification_id", base.pack.id).order("trust_level", { ascending: false }).limit(500),
    admin.from("research_items").select("id,provider,title,authors,journal,published_at,source_url,summary_en,summary_zh,chapter_numbers,relevance,curation_status,updated_at").eq("certification_id", base.pack.id).order("published_at", { ascending: false }).limit(300),
    admin.from("content_review_queue").select("id,item_type,payload,confidence,status,reviewed_at,created_at").eq("certification_id", base.pack.id).order("created_at", { ascending: false }).limit(300),
    admin.from("research_sync_runs").select("id,provider,status,found_count,inserted_count,message,started_at,finished_at").order("started_at", { ascending: false }).limit(100),
    admin.storage.from("course-media").createSignedUrls(base.mediaPaths, 60 * 60),
  ]);

  const queryResults = { lessons, questions, sources, research, reviewQueue, syncRuns };
  const errors = Object.entries(queryResults).flatMap(([name, result]) => result.error ? [`${name}: ${result.error.message}`] : []);
  if (signedMedia.error) errors.push(`media: ${signedMedia.error.message}`);
  const signedMap = Object.fromEntries((signedMedia.data || []).flatMap(item => item.signedUrl ? [[item.path, item.signedUrl]] : []));

  return NextResponse.json({
    ...base,
    actor: { email: user.email },
    generatedAt: new Date().toISOString(),
    cloud: {
      status: errors.length ? "attention" : "healthy",
      errors,
      lessons: lessons.data || [],
      questions: questions.data || [],
      sources: sources.data || [],
      research: research.data || [],
      reviewQueue: reviewQueue.data || [],
      syncRuns: syncRuns.data || [],
      signedMedia: signedMap,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
