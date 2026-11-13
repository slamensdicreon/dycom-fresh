> **Deprecated — reference only.** This folder is the Icreon design handoff of November 6, 2026, kept unchanged so the new site can be checked against it while the remaining pages are built. Nothing in the app reads from it. Do not build from `source/`; the live site is the Next.js app at the repository root (see `../README.md`). Delete this folder once every page in the sitemap is built.

# Dycom — Final Design Direction

Handoff package from Icreon, November 6, 2026: the approved homepage, global navigation, Investors overview page and Design System for the new dycomind.com, with the brief and the source code.

**Start with `brief/Dycom-Final-Design-Direction-Brief.pdf`** (also in Markdown). It explains what is being built, what we learned about Dycom from its own documents, the homepage narrative chapter by chapter, the brand and product rules in force, what is real versus placeholder in the prototype, and the open items for Dycom.

```
├── brief/          the project brief (PDF + Markdown)
├── site/           the built site — cd site && node serve.mjs → http://localhost:8080/
│                   homepage at /, Investors at /investors/, Design System at /design-system/
├── screenshots/    full-page captures: homepage and Investors at 1440 and 390, Design System overview
├── source/         the source code as a trimmed pnpm workspace (see source/README.md)
└── reference/      requirements, specification, content record and Dycom's source documents
```

To view the site you need Node 18 or later (`node serve.mjs` inside `site/`), or any static server that answers unknown paths with `index.html`. Opening `index.html` straight from the file system will not work.

The site runs entirely from this folder: photography and company logos are in `site/media/`, fonts and films are bundled. It makes no network requests except to the operating companies' own websites when a visitor follows a company card link.
