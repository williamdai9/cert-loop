"""Extract explicitly selected personal study sources locally; never commit the output.

Usage: python3 scripts/extract-tutor-library.py SOURCE_ROOT PRIVATE_OUTPUT_JSON
Requires pypdf; macOS Vision OCR via Swift for supplied mind-map images.
PDF page numbers are 1-based file pages, NOT printed textbook page numbers.
No automatic ingestion, AI generation, or recursive upload of unrelated files.
"""
import hashlib
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from pypdf import PdfReader

ROOT, OUTPUT = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
SCRIPT = Path(__file__).parent

MAP_CHAPTERS = {
    "身体系统的机构与功能": 1, "阻力练习的生物力学机制": 2,
    "运动与训练的生物化学": 3, "阻力训练导致的内分泌反应": 4,
    "无氧的适应": 5, "有氧耐力的适应": 6, "运动准备与心理学": 9,
    "基础营养元素": 10, "最大化运动表现的营养策略": 11,
    "选择测试和管理的原则": 13, "所选测验的运行得分和建议": 14,
    "热身和灵活性训练": 15, "自由重量和非传统训练技术": 16,
    "阻力训练设计": 18, "增强式训练设计": 19, "有氧耐力设计": 21,
    "周期化": 22, "恢复和重建": 23, "设施的设计陈列和组织": 25,
    "设施政策，程序和法律": 26,
}
NOTE_TITLES = {
    1: "Exercise science", 2: "Recall and revision notes", 3: "Organization and administration",
    4: "Fifth edition: facility design", 5: "Fifth edition: nutrition",
    6: "Fifth edition: sport psychology", 7: "Fifth edition: new assessments",
    8: "Fifth edition: chapter 24", 9: "Fifth edition: stretch-shortening cycle exercises",
    10: "Fourth edition: stretch-shortening cycle exercises", 11: "Knee valgus terminology",
    12: "Running practice questions", 13: "Chapter 8 study notes", 14: "Fifth edition: chapter 7",
    15: "Program implementation", 16: "Exercise technique", 17: "Program design",
    18: "Testing and evaluation", 19: "Nutrition", 20: "Sport psychology",
    21: "Fifth edition: end-of-chapter corrections",
}

class NoteParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts = []; self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"): self.skip += 1
        if tag in ("p", "div", "br", "li", "tr", "h1", "h2", "h3"): self.parts.append("\n")
    def handle_endtag(self, tag):
        if tag in ("script", "style"): self.skip = max(0, self.skip - 1)
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

documents, chunks = [], []
chapter_titles = {}

def clean(text):
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", text.replace("\x00", ""))).strip()

def add_document(path, title, kind, language, edition=None):
    relative = str(path.relative_to(ROOT))
    doc_id = hashlib.sha256(relative.encode()).hexdigest()[:24]
    documents.append({"id": doc_id, "title": title, "original_name": path.name,
                      "kind": kind, "language": language, "edition": edition,
                      "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                      "metadata": {"relative_path": relative}})
    return doc_id

def add_text(doc, text, page=None, chapter=None, extraction="text"):
    text = clean(text)
    if len(text) < 40: return
    # Keep each citation page-local; overlap protects sentence boundaries.
    start = 0
    while start < len(text):
        end = min(start + 2400, len(text))
        if end < len(text):
            boundary = text.rfind("\n", start + 1300, end)
            if boundary > start: end = boundary
        body = text[start:end].strip()
        key = f"{doc}:{page}:{start}"
        chunks.append({"id": hashlib.sha256(key.encode()).hexdigest()[:32],
                       "document_id": doc, "page": page, "chapter": chapter,
                       "content": body, "extraction": extraction})
        if end == len(text): break
        start = max(start + 1, end - 180)

book = next(ROOT.rglob("CSCS第五版英文版.pdf"))
reader = PdfReader(book)
chapter_starts = []
for bookmark in reader.outline:
    if isinstance(bookmark, list): continue
    match = re.match(r"Chapter (\d+): (.+)", bookmark.title)
    if match:
        n = int(match[1]); chapter_titles[n] = match[2]
        chapter_starts.append((reader.get_destination_page_number(bookmark), n))
    elif chapter_starts:
        chapter_starts.append((reader.get_destination_page_number(bookmark), None))
doc = add_document(book, "Essentials of Strength Training and Conditioning — Fifth Edition", "textbook", "en", "5")
empty_pages = []
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    chapters = [n for start, n in chapter_starts if start <= i]
    add_text(doc, text, i + 1, chapters[-1] if chapters else None)
    if len(clean(text)) < 40: empty_pages.append(i + 1)
documents[-1]["metadata"].update({"pages": len(reader.pages), "text_empty_pages": empty_pages})
print(f"Textbook: {len(reader.pages)} PDF pages, {len(chunks)} text chunks", file=sys.stderr)

for path in sorted((ROOT / "印象笔记").glob("*/*.html")):
    number = int(path.parent.name)
    doc = add_document(path, "Personal notes — " + NOTE_TITLES.get(number, f"Note {number}"), "note", "mixed")
    parser = NoteParser(); parser.feed(path.read_text(encoding="utf-8"))
    add_text(doc, "".join(parser.parts), extraction="html_text")

for path in sorted((ROOT / "每章思维导图").glob("*.jpg")):
    chapter = MAP_CHAPTERS.get(path.stem)
    doc = add_document(path, "Personal mind map — " + chapter_titles.get(chapter, "Study concepts"), "mindmap", "zh")
    rows = json.loads(subprocess.check_output(["swift", str(SCRIPT / "ocr-mind-map.swift"), str(path)], text=True))
    # OCR text is reference evidence, not a claim that spatial arrows were reconstructed.
    text = "\n".join(row["text"] for row in rows if row["confidence"] >= 0.3)
    add_text(doc, text, chapter=chapter, extraction="image_ocr")
    documents[-1]["metadata"].update({"chapter": chapter, "ocr_lines": len(rows), "spatial_edges_verified": False})
    print(f"Mind map Ch. {chapter}: {len(text)} characters", file=sys.stderr)

supplements = [
    ("英文练习题含答案解析.pdf", "Practice questions with explanations", "practice", "en"),
    ("CSCS美国官网购买习题.pdf", "Supplied NSCA practice material", "practice", "mixed"),
    ("2000题无答案.pdf", "Supplementary practice question collection", "practice", "mixed"),
    ("2000题答案.pdf", "Supplementary practice answer collection", "practice", "mixed"),
    ("CSCS认证考试详细大纲（官方）.pdf", "Supplied NSCA exam outline (verify current version)", "outline", "zh"),
]
for filename, title, kind, language in supplements:
    candidates = list(ROOT.rglob(filename))
    if not candidates: continue
    path = candidates[0]; pdf = PdfReader(path); doc = add_document(path, title, kind, language)
    readable = 0
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ""
        if len(clean(text)) >= 40: readable += 1
        add_text(doc, text, page=i+1)
    documents[-1]["metadata"].update({"pages": len(pdf.pages), "readable_pages": readable})
    print(f"Supplement: {title}: {readable}/{len(pdf.pages)} readable pages", file=sys.stderr)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps({"documents": documents, "chunks": chunks}, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"documents": len(documents), "chunks": len(chunks), "output": str(OUTPUT)}))
