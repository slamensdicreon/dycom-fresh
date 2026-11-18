"""Assemble the Notified Investors page package from the captured, rendered Investors page.

Usage: python3 assemble.py <capture.json> <output dir>
Run by build.sh, which explains the steps. Needs Python 3 with beautifulsoup4.
"""
import json, re, shutil, sys, urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup, Comment

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
CAPTURE, OUT = Path(sys.argv[1]), Path(sys.argv[2])
SITE = "https://www.dycomind.com"             # the new dycomind.com (absolute links leave the IR host)
JOBS = SITE + "/careers/opportunities/"
cap = json.loads(CAPTURE.read_text())

if OUT.exists(): shutil.rmtree(OUT)
for d in ["assets/css", "assets/js", "assets/fonts", "assets/images", "assets/video"]:
    (OUT / d).mkdir(parents=True)

def soup(h): return BeautifulSoup(h, "html.parser")
page = soup(cap["base"])

# ---------- ids: replace React's generated ids with readable ones
html_ids = {}
def clean_ids(text):
    def r(m):
        key = m.group(0)
        if key not in html_ids: html_ids[key] = f"dy{len(html_ids)+1}"
        return html_ids[key]
    return re.sub(r"_R_[a-z0-9]+_", r, text)

# ---------- CSS: the site's compiled stylesheet, fonts packaged alongside
css_href = page.find("link", rel="stylesheet")["href"]
css = (REPO / ".next" / css_href.lstrip("/").replace("_next/", "")).read_text()
for m in set(re.findall(r"url\(\.\./media/([^)]+)\)", css)):
    clean = re.sub(r"-s\.p\.[a-z0-9]+", "", m)
    shutil.copy(REPO / ".next/static/media" / m, OUT / "assets/fonts" / clean)
    css = css.replace(f"url(../media/{m})", f"url(../fonts/{clean})")
(OUT / "assets/css/dycom.css").write_text(css)

# ---------- body: the site root only (no Next.js scripts, announcer or React roots)
root = page.select_one(".dy.dy-site")
for el in root.select("dialog"): el.decompose()          # phone menu re-added below; roles drawer not shipped
for c in root.find_all(string=lambda t: isinstance(t, Comment)): c.extract()
pg = root.select_one(".dy-page"); pg["class"] = ["dy-page"]

# Header: every mega menu and the language menu, present and hidden
for i, grp in enumerate(root.select(".dy-nav-group")):
    mega = soup(cap["megas"][i]).div; mega["hidden"] = ""
    grp.append(mega)
lang = soup(cap["lang"]).div; lang["hidden"] = ""; lang["id"] = "dy-lang-menu"
trig = root.select_one(".dy-lang-trigger"); trig["aria-controls"] = "dy-lang-menu"
trig.parent.append(lang)

# Phone menu: the captured dialog, closed, each group's panel present and hidden
dlg = soup(cap["mobileDialog"]).dialog
del dlg["open"]; dlg["data-phase"] = "closed"; dlg["id"] = "dy-mobile-nav"
for item, panel_html in zip(dlg.select(".dy-accordion-item"), cap["mobilePanels"]):
    panel = soup(panel_html).div; panel["hidden"] = ""; panel["data-state"] = "closed"
    item.append(panel)
root.select_one(".dy-mobile-trigger")["aria-controls"] = "dy-mobile-nav"
root.select_one(".dy-header").append(dlg)

# Find a job: the roles drawer stays on dycomind.com; here it links to job search
for b in root.select(".dy-header-job button.dy-button, .dy-mobile-nav > button.dy-button"):
    a = page.new_tag("a", attrs={"class": "dy-button", "href": JOBS})
    for c in list(b.contents): a.append(c)
    b.replace_with(a)

# Results bar: visibility rules as data attributes (ReleaseDate, WindowDays, ForceShow)
rb = root.select_one(".dy-results-bar")
bar_fields = json.loads((REPO / "content/items/global/results-bar.json").read_text())["fields"]
rb["data-release-date"] = str(bar_fields["ReleaseDate"])[:10]
rb["data-window-days"] = str(bar_fields.get("WindowDays", 14))
rb["data-force-show"] = "true" if bar_fields.get("ForceShow") else "false"

# Events: empty-state messages present in both panels (shown by script when a tab has no events)
ev = json.loads((REPO / "content/items/investors/events.json").read_text())["fields"]
for key, text, link in [("upcoming", ev["UpcomingEmptyText"], ev["EmptyLink"]), ("past", ev["PastEmptyText"], None)]:
    panel = root.select_one(f"#events-panel-{key}")
    if not panel.select_one(".dy-irp-timeline"):
        panel.append(soup('<ol class="dy-irp-timeline"></ol>').ol)
    if not panel.select_one(".dy-irp-empty"):
        h = f'<div class="dy-irp-empty" hidden><p>{text}</p>' + (f'<a class="dy-link" href="{link["$link"]}">{link["text"]}</a>' if link else "") + "</div>"
        panel.append(soup(h).div)
    else:
        panel.select_one(".dy-irp-empty")["hidden"] = ""

# Brand film: poster and film packaged; the film loads on first play
film = root.select_one(".dy-film video")
for name in ["film-poster.webp"]:
    shutil.copy(REPO / "public/media/film" / name, OUT / "assets/images" / name)
shutil.copy(REPO / "public/media/film/brand-film.mp4", OUT / "assets/video/brand-film.mp4")
film["poster"] = "assets/images/film-poster.webp"; film["data-src"] = "assets/video/brand-film.mp4"

# ---------- images: original files instead of the Next.js image optimiser
def local_image(src):
    if src.startswith("assets/"): return src
    if src.startswith("/_next/image"):
        src = urllib.parse.unquote(urllib.parse.parse_qs(urllib.parse.urlparse(src).query)["url"][0])
    name = Path(src).name
    shutil.copy(REPO / "public" / src.lstrip("/"), OUT / "assets/images" / name)
    return "assets/images/" + name
body_html_parts = [root]
for img in root.find_all("img"):
    img["src"] = local_image(img["src"])
    for a in ("srcset", "sizes", "data-nimg"):
        if img.has_attr(a): del img[a]
    if img.get("style") == "color: transparent;" or img.get("style") == "color:transparent": del img["style"]
    elif img.has_attr("style"): img["style"] = img["style"].replace("color:transparent;", "").replace("color: transparent;", "")

# ---------- links: site pages are absolute to dycomind.com; in-page jumps stay
for a in root.find_all("a", href=True):
    if a["href"].startswith("/"): a["href"] = SITE + a["href"]

# ---------- section markers for the integrator
LABELS = {
 "dy-results-bar": "RESULTS BAR — every page, 14 days after each earnings release. Source: IR feed (latest release). See README §4.",
 "dy-header": "SITE HEADER — dycomind.com navigation (shared with the main site). Static.",
 "investors": "HERO — H1, company description, listing block. Static (Dycom IR to supply new boilerplate).",
 "results": "LATEST FINANCIAL RESULTS — quarter, three GAAP figures, release documents, call replay. Source: IR feed.",
 "film": "BRAND FILM — static; plays in place on request.",
 "events-news": "EVENTS (Upcoming / Past tabs) and INVESTOR NEWS. Source: IR feed (events, press releases).",
 "reports": "FEATURED REPORTS — three cover cards. Source: IR feed / documents.",
 "resources": "INVESTOR RESOURCES — link columns (the Investors menu group, filtered). Static.",
 "stay-informed": "CLOSING BAND — email alerts and IR contact. Static.",
 "dy-footer": "SITE FOOTER — dycomind.com sitemap and legal links (shared with the main site). Static.",
}
for el in [root.select_one(".dy-results-bar"), root.select_one(".dy-header"), root.select_one(".dy-footer")] + root.select("main > section"):
    key = el.get("id") or [c for c in el["class"] if c in LABELS][0]
    el.insert_before(Comment(" ===== " + LABELS[key] + " ===== "))
    el.insert_before("\n")
    el.insert_after("\n")

# ---------- head
src_head = page.head
def meta(**kw):
    m = src_head.find("meta", attrs=kw); return m["content"] if m else ""
title = src_head.title.string
desc = meta(name="description")
route = json.loads((REPO / "content/routes/investors.json").read_text())
library = json.loads((REPO / "content/media/library.json").read_text())
og_img = local_image(library[route["fields"]["baseOgImage"]["$image"]]["src"])
head = f"""<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{og_img}">
<meta name="theme-color" content="#041054">
<link rel="preload" href="assets/fonts/FjallaOne.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/Geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/dycom.css">
<link rel="stylesheet" href="assets/css/investors-package.css">
<script src="assets/js/investors.js" defer></script>
</head>"""
body = clean_ids(str(root))
html_cls = " ".join(page.html.get("class", []))
body_cls = " ".join(page.body.get("class", []))
doc = f'<!doctype html>\n<html lang="en" class="{html_cls}">\n{head}\n<body' + (f' class="{body_cls}"' if body_cls else '') + f'>\n<!-- Dycom Investors page — static package for Notified. See README.md. -->\n{body}\n</body>\n</html>\n'
(OUT / "index.html").write_text(doc)
print("ids remapped:", len(html_ids), "| images:", sorted(p.name for p in (OUT/"assets/images").iterdir()))

# ---------- package files kept beside this script
shutil.copy(HERE / "investors.js", OUT / "assets/js/investors.js")
shutil.copy(HERE / "investors-package.css", OUT / "assets/css/investors-package.css")
shutil.copy(HERE / "PACKAGE-README.md", OUT / "README.md")
