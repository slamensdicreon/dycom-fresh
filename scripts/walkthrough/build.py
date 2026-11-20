"""Build the walkthrough's live design boards and data from the design canvas.

Inputs (all in the repo):
  design/canvas/            the template design canvas: *.dc.html boards, styles, canvas.json, assets/
  design/component-inventory.json   the consolidated component inventory
  docs/requirements.md      the living requirements (decisions and what Dycom supplies)

Outputs:
  public/walkthrough-assets/canvas/   boards rendered as standalone HTML, with their CSS and assets
  src/walkthrough/data/canvas.json    templates, boards and canvas notes, in walkthrough order
  src/walkthrough/data/decisions.json decision and dependency tables from docs/requirements.md

Run with `npm run walkthrough:build` (this script, then metrics.mjs for board heights and thumbnails).
Standard library only.
"""
import json
import re
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CANVAS = REPO / "design" / "canvas"
OUT = REPO / "public" / "walkthrough-assets" / "canvas"
DATA = REPO / "src" / "walkthrough" / "data"

canvas = json.loads((CANVAS / "canvas.json").read_text())
assets = {p.stem: p.name for p in (CANVAS / "assets").iterdir()}

if OUT.exists():
    shutil.rmtree(OUT)
(OUT / "boards").mkdir(parents=True)
shutil.copytree(CANVAS / "assets", OUT / "assets")
for css in CANVAS.glob("*.css"):
    shutil.copy(css, OUT / css.name)
DATA.mkdir(parents=True, exist_ok=True)


def source(name: str) -> str:
    return (CANVAS / f"{name}.dc.html").read_text()


def inner(text: str) -> str:
    body = re.search(r"<x-dc>(.*)</x-dc>", text, re.S).group(1)
    return re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S)


NAV_LABELS = ["Who we are", "What we do", "Our companies", "People &amp; careers", "Resource Center", "Investors"]
CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"></path></svg>'


def resolve_imports(html: str) -> str:
    """Inline <dc-import> boards (the shared header and footer). The header's sc-for loop is expanded here."""
    def imp(m):
        name = m.group(1)
        current = re.search(r'current="([^"]*)"', m.group(0))
        body = inner(source(name))
        if "<sc-for" in body:
            cur = (current.group(1) if current else "").replace("&amp;", "&")
            items = "".join(
                f'<button type="button" class="dy-nav-item{" is-current" if label.replace("&amp;", "&") == cur else ""}">{label}{CHEVRON}</button>'
                for label in NAV_LABELS
            )
            body = re.sub(r"<sc-for.*?</sc-for>", items, body, flags=re.S)
        return resolve_imports(body)
    return re.sub(r'<dc-import name="(\w+)"[^>]*></dc-import>', imp, html)


def blobs(html: str) -> str:
    def rep(m):
        key = m.group(1)
        if key not in assets:
            raise SystemExit(f"asset {key} referenced but not in design/canvas/assets")
        return f"../assets/{assets[key]}"
    return re.sub(r"/_blob/([0-9a-f]{32})", rep, html)


def render(name: str) -> None:
    text = source(name)
    links = "".join(f'<link rel="stylesheet" href="../{href}">' for href in re.findall(r'<link rel="stylesheet" href="([^"]+)">', text))
    helmet = re.search(r"<helmet>(.*?)</helmet>", text, re.S)
    styles = helmet.group(1) if helmet else ""
    title = re.search(r"<title>(.*?)</title>", text).group(1)
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
{links}
{styles}
</head>
<body>
{resolve_imports(inner(text))}
<script>
// Design board: links and buttons are illustrative, so nothing navigates away from the board.
document.addEventListener('click', function (e) {{ if (e.target.closest('a, button')) e.preventDefault(); }});
</script>
</body>
</html>
"""
    (OUT / "boards" / f"{name}.html").write_text(blobs(page))


# ---------- templates, boards and notes
main = source("Main")
rows = re.findall(r"r\('(T\d\d)', '([^']*)', '([^']*)', '([^']*)', '([^']*)'\)", main)
boards = canvas["boards"]
notes = canvas["notes"]
order = canvas["order"]


def note_kind(key: str, text: str) -> str:
    head = text.split("\n", 1)[0].upper()
    if key.endswith("Title"):
        return "title"
    if head.startswith("THE JOB"):
        return "job"
    if head.startswith("NARRATIVE"):
        return "narrative"
    if head.startswith(("SITECORE MAPPING", "THE KIT")):
        return "mapping"
    if head.startswith(("OPEN FOR DYCOM", "BLOCKED ON DATA")):
        return "open"
    return "aside"


def parse_note(key: str) -> dict:
    text = notes[key]["text"].strip()
    kind = note_kind(key, text)
    if kind in ("title", "aside") or "\n\n" not in text:
        return {"key": key, "kind": kind, "heading": "", "body": text}
    heading, body = text.split("\n\n", 1)
    return {"key": key, "kind": kind, "heading": heading.strip(), "body": body.strip()}


def phone_target(name: str):
    m = re.search(r'<dc-import name="(\w+)"', source(name))
    return m.group(1) if m else None


templates = []
for code, name, pages, count, status in rows:
    page_id = code.lower()
    page_notes = [parse_note(k) for k in canvas["noteOrder"] if k in notes and notes[k]["page"] == page_id]
    title_note = next((n for n in page_notes if n["kind"] == "title"), None)
    headline = title_note["body"].split(" — ", 1)[1] if title_note and " — " in title_note["body"] else ""
    page_boards = [b for b in order if boards[b]["page"] == page_id]
    phones = {phone_target(b.removesuffix(".dc.html")): b for b in page_boards if b.endswith("Phone.dc.html")}
    views = []
    for b in page_boards:
        stem = b.removesuffix(".dc.html")
        if b.endswith("Phone.dc.html"):
            continue
        meta = boards[b]
        title = re.sub(r"^T\d\d · ", "", meta["title"])
        title = re.sub(r" — desktop 1440", "", title)
        views.append({
            "board": stem,
            "title": title,
            "phone": stem in phones,
        })
        render(stem)
    templates.append({
        "code": code,
        "name": name,
        "slug": code.lower(),
        "headline": headline,
        "pagesServed": pages,
        "pageCount": count,
        "status": status,
        "notes": [n for n in page_notes if n["kind"] != "title"],
        "views": views,
    })

overview_notes = {k: notes[k]["text"] for k in canvas["noteOrder"] if k in notes and notes[k]["page"] == "overview"}
for name in ("SiteHeader", "SiteFooter"):
    render(name)

(DATA / "canvas.json").write_text(json.dumps({
    "canvasVersion": "1794858143-6fd3",
    "templates": templates,
    "overviewNotes": overview_notes,
}, indent=1, ensure_ascii=False) + "\n")

# ---------- decisions from docs/requirements.md


def table_after(md: str, heading: str) -> list[dict]:
    start = md.index(heading)
    lines = md[start:].split("\n")[1:]
    rows_, header = [], None
    for line in lines:
        if line.startswith("#"):
            break
        if not line.startswith("|"):
            if header and rows_:
                break
            continue
        cells = [c.strip() for c in line.strip().strip("|").split(" | ")]
        if header is None:
            header = cells
        elif set(line.replace("|", "").strip()) <= {"-", " "}:
            continue
        else:
            rows_.append(dict(zip(header, cells)))
    return rows_


req = (REPO / "docs" / "requirements.md").read_text()
decisions = {
    "openDecisions": table_after(req, "### 5.2 Open decisions and the pages they block"),
    "dataDependencies": table_after(req, "### 5.1 Data the build needs that does not exist yet"),
    "investorsReview": table_after(req, "### 5.3 Open with Dycom from the Investors review"),
    "netNewContent": table_after(req, "### 4.4 Net-new"),
    "contentItems": table_after(req, "### 4.5 Content items that are not pages"),
}
(DATA / "decisions.json").write_text(json.dumps(decisions, indent=1, ensure_ascii=False) + "\n")

print(f"templates {len(templates)} · boards {len(list((OUT / 'boards').iterdir()))} · "
      + " · ".join(f"{k} {len(v)}" for k, v in decisions.items()))

# ---------- sitemap (navigation content) with each page's template from the page inventory
items = REPO / "content" / "items"


def item(key: str) -> dict:
    return json.loads((items / f"{key}.json").read_text())


page_templates = {}
for line in req[req.index("## 1. Page inventory"):req.index("## 2. Template catalogue")].split("\n"):
    m = re.match(r"\| `([^`]+)` \| (T\d\d)", line)
    if m:
        page_templates["/" + m.group(1).lstrip("/")] = m.group(2)
page_templates["/"] = "T01"

groups = []
for path in sorted((items / "global" / "navigation").glob("*.json"), key=lambda p: item(f"global/navigation/{p.stem}").get("sortOrder", 0)):
    g = item(f"global/navigation/{path.stem}")["fields"]
    cols = []
    for col_path in sorted((items / "global" / "navigation" / path.stem).glob("*.json"), key=lambda p: json.loads(p.read_text()).get("sortOrder", 0)):
        c = json.loads(col_path.read_text())["fields"]
        links = []
        for ref in c["Links"]["$refs"]:
            link = item(ref)["fields"]["Link"]
            href = link["$link"]
            links.append({"text": link["text"], "href": href, "template": page_templates.get(href)})
        cols.append({"title": c["Title"], "links": links})
    groups.append({
        "label": g["Label"], "intro": g["Intro"], "description": g["Description"],
        "overview": {"text": g["OverviewLink"]["text"], "href": g["OverviewLink"]["$link"], "template": page_templates.get(g["OverviewLink"]["$link"])},
        "columns": cols,
    })
(DATA / "sitemap.json").write_text(json.dumps({"groups": groups, "pageTemplates": page_templates}, indent=1, ensure_ascii=False) + "\n")
shutil.copy(REPO / "design" / "component-inventory.json", DATA / "component-inventory.json")
unmapped = sorted({l["href"] for g in groups for c in g["columns"] for l in c["links"] if not l["template"]})
print(f"sitemap: {len(groups)} groups, {sum(len(c['links']) for g in groups for c in g['columns'])} links; no template for: {unmapped}")
