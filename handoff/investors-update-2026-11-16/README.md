# Dycom — Investors page update

Update package from Icreon, November 16, 2026. It contains only what changed since the **Final Design Direction** package of November 6, 2026: the revised Investors overview page and the site-wide results bar that came out of Dycom's Investors page review (Dycom's marketing lead and investor-relations reviewer, November 11, 2026).

**Start with `whats-changed.md`.** It lists each review comment, what was done about it, the notes for the build team, and the three items still open with Dycom.

```
├── whats-changed.md   the review comments and what changed for each; build-team notes; open items
├── site/              the Investors page, built — cd site && node serve.mjs → http://localhost:8080/investors/
│                      (Investors only: the site root redirects to /investors/, and only the Investors page's
│                       photography and film are included; the homepage is in the November 6 package)
├── screenshots/       Investors page at 1440 and 390 (full page), the Past-events tab, the Investors menu,
│                      the results bar above the header
└── source/            the nine source files that changed, at their paths inside the November 6 package,
                       plus investors-page-update.patch (a unified diff against that package)
```

## Viewing the site

Node 18 or later: `cd site && node serve.mjs`, then open http://localhost:8080/investors/. Any static server that answers unknown paths with `index.html` also works. Opening `index.html` straight from the file system will not work.

The site runs entirely from this folder — the Investors page's photography is in `site/media/`, its fonts and the brand film are bundled. To keep the package small it carries **only the Investors page**: the site root redirects to `/investors/`, and the homepage's photography, hero film and company logos are not included (they are unchanged and remain in the November 6 package). The results bar above the header is **forced on** in this build so it can be reviewed; see `whats-changed.md` for how it behaves in production.

## Applying the source changes

The November 6 package's `source/` workspace is the base. Either copy the nine files from `source/` here over the same paths there, or apply the patch from the root of that workspace:

```sh
cd <Final-Design-Direction>/source
patch -p1 < <this package>/source/investors-page-update.patch
pnpm install && pnpm typecheck
```

Nothing outside `artifacts/dycom-concept-05/src/` changed; the shared libraries (`lib/`) are identical to the November 6 package. The build commands and the two build-time variables are unchanged and documented in that package's `source/README.md`.

---

*Filed in this repository on November 16, 2026. The package's prebuilt `site/` folder (about 20 MB, mostly the brand film and bundled scripts) is not stored here; its content is the Investors page as described above, and the changes have been applied to the Next.js app at the repository root.*
