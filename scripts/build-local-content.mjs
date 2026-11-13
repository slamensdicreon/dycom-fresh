#!/usr/bin/env node
/**
 * Compiles the authored content in `content/` into the shapes Sitecore Experience Edge returns,
 * so the app can run the Content SDK end to end before SitecoreAI is connected.
 *
 *   content/sites.json               → .sitecore/sites.json            (what `sitecore-tools` generateSites writes)
 *   content/dictionary/<locale>.json → dictionary phrases per site/locale
 *   content/items/**.json            → datasource items (Sitecore content tree under /Data)
 *   content/page-designs/*.json      → partial designs merged into each route (header, footer)
 *   content/routes/**.json           → one route per page; the file path is the URL path
 *   content/renderings.json          → rendering definitions: the placeholders each rendering exposes
 *
 * Output: .sitecore/local-layout.json — `{ [site]: { [locale]: { routes: { "/path": LayoutServiceData }, dictionary } } }`
 *
 * Authoring shorthand inside `fields` (expanded here, so components only ever see real Sitecore JSON):
 *   "Heading": "text"                    → { "value": "text" }            (single-line / rich text / number / checkbox)
 *   "Items":   { "$refs": ["a/b", …] }   → Item[]                          (multilist / treelist)
 *   "Item":    { "$ref": "a/b" }         → Item                            (droplink / droptree)
 *   "Items":   { "$children": "a" }      → Item[] of every item in folder `a`, sorted by `sortOrder` then name
 *   "Photo":   { "$image": "z9b_0540", "alt"?: "…" } → Image field from the media library (content/media/library.json)
 *   "Video":   { "$file": "/media/film/hero-loop.mp4" } → File field
 *   "Cta":     { "$link": "/investors", "text": "Investors" } → General Link field; linktype is internal,
 *              anchor ("#…") or external ("http…", opens in a new tab)
 *   anything else ({ "value": … }) is passed through unchanged.
 *
 * Usage: node scripts/build-local-content.mjs [--watch] [--strict]
 *   --strict  fail on a missing datasource or referenced item (used by `npm run build`); otherwise
 *             it warns and the rendering gets empty fields, as Sitecore does for a missing datasource.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, watch, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content');
const outDir = join(root, '.sitecore');

/** Deterministic GUID from a content path, so ids are stable between builds (Sitecore item ids are GUIDs). */
const guid = (key) => {
  const h = createHash('sha1').update(key).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`.toUpperCase();
};

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${relative(root, file)}: ${error.message}`);
  }
};

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((name) => {
        const full = join(dir, name);
        return statSync(full).isDirectory() ? walk(full) : name.endsWith('.json') ? [full] : [];
      })
    : [];

const strict = process.argv.includes('--strict');
const warnings = new Set();

const toKey = (base, file) => relative(base, file).replace(/\.json$/, '').split(sep).join('/');

function build() {
  const sites = readJson(join(contentDir, 'sites.json'));
  const items = new Map(walk(join(contentDir, 'items')).map((f) => [toKey(join(contentDir, 'items'), f), readJson(f)]));
  const designs = new Map(walk(join(contentDir, 'page-designs')).map((f) => [toKey(join(contentDir, 'page-designs'), f), readJson(f)]));
  const routeFiles = walk(join(contentDir, 'routes'));
  const media = readJson(join(contentDir, 'media', 'library.json'));
  const renderingDefs = existsSync(join(contentDir, 'renderings.json')) ? readJson(join(contentDir, 'renderings.json')) : {};

  const resolving = new Set();

  /** Builds a Sitecore `Item` (name, id, url, fields) from an item key. */
  const itemFor = (key, from) => {
    const raw = items.get(key);
    if (!raw) throw new Error(`Unknown item "${key}" referenced from ${from}`);
    if (resolving.has(key)) throw new Error(`Circular item reference at "${key}" (from ${from})`);
    resolving.add(key);
    const item = {
      id: guid(`item:${key}`),
      name: raw.name ?? key.split('/').pop(),
      displayName: raw.displayName ?? raw.name ?? key.split('/').pop(),
      ...(raw.url ? { url: raw.url } : {}),
      ...(raw.templateName ? { templateName: raw.templateName } : {}),
      fields: expandFields(raw.fields ?? {}, `item ${key}`),
    };
    resolving.delete(key);
    return item;
  };

  const lenientItem = (key, from) => {
    if (items.has(key) || strict) return itemFor(key, from);
    warnings.add(`missing item "${key}" (${from})`);
    return null;
  };

  const childrenOf = (folder) =>
    [...items.entries()]
      .filter(([k]) => k.startsWith(`${folder}/`) && !k.slice(folder.length + 1).includes('/'))
      .sort(([ak, a], [bk, b]) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || ak.localeCompare(bk))
      .map(([k]) => k);

  function expandField(value, from) {
    if (value === null || typeof value !== 'object') return { value: value ?? '' };
    if (Array.isArray(value)) throw new Error(`Bare array in ${from}; use { "$refs": [...] } or { "value": [...] }`);
    if ('$ref' in value) return lenientItem(value.$ref, from) ?? { value: '' };
    if ('$refs' in value) return value.$refs.map((k) => lenientItem(k, from)).filter(Boolean);
    if ('$children' in value) return childrenOf(value.$children).map((k) => itemFor(k, from));
    if ('$image' in value) {
      const m = media[value.$image];
      if (!m) throw new Error(`Unknown media item "${value.$image}" in ${from}`);
      return { value: { src: m.src, alt: value.alt ?? m.alt, width: m.width, height: m.height } };
    }
    if ('$file' in value) return { value: { src: value.$file, title: value.title ?? '' } };
    if ('$link' in value) {
      const href = value.$link;
      const linktype = href.startsWith('#') ? 'anchor' : /^https?:/.test(href) ? 'external' : 'internal';
      return {
        value: {
          href,
          text: value.text ?? '',
          linktype,
          ...(linktype === 'anchor' ? { anchor: href.slice(1) } : {}),
          ...(linktype === 'external' ? { target: '_blank' } : {}),
          ...(value.title ? { title: value.title } : {}),
        },
      };
    }
    return value;
  }

  function expandFields(fields, from) {
    return Object.fromEntries(Object.entries(fields).map(([name, v]) => [name, expandField(v, `${from} › ${name}`)]));
  }

  let uid = 0;
  /** Resolves one rendering: datasource → fields, nested placeholders, stable uid. */
  function rendering(r, from) {
    const out = {
      uid: guid(`rendering:${from}:${uid++}:${r.componentName}`),
      componentName: r.componentName,
      dataSource: '',
      params: r.params ?? {},
    };
    if (r.dataSource) {
      if (!items.has(r.dataSource) && !strict) {
        warnings.add(`missing datasource "${r.dataSource}" (${from} › ${r.componentName})`);
        out.fields = {};
      } else {
        const item = itemFor(r.dataSource, from);
        out.dataSource = `{${item.id}}`;
        out.fields = item.fields;
      }
    } else if (r.fields) {
      out.fields = expandFields(r.fields, from);
    } else {
      out.fields = {};
    }
    // Declared placeholders are always present (empty when unused), as the Layout Service returns them.
    const declared = renderingDefs[r.componentName]?.placeholders ?? [];
    if (r.placeholders || declared.length) {
      out.placeholders = {
        ...Object.fromEntries(declared.map((name) => [name, []])),
        ...(r.placeholders ? placeholders(r.placeholders, `${from} › ${r.componentName}`) : {}),
      };
    }
    return out;
  }

  const placeholders = (phs, from) =>
    Object.fromEntries(Object.entries(phs).map(([name, list]) => [name, list.map((r) => rendering(r, `${from} › ${name}`))]));

  const result = {};
  for (const site of sites) {
    result[site.name] = {};
    for (const locale of site.languages ?? [site.language]) {
      const dictFile = join(contentDir, 'dictionary', `${locale}.json`);
      const routes = {};
      for (const file of routeFiles) {
        const key = toKey(join(contentDir, 'routes'), file);
        const raw = readJson(file);
        const path = key === 'home' ? '/' : `/${key.replace(/\/index$/, '')}`;
        const design = raw.pageDesign ? designs.get(raw.pageDesign) : null;
        if (raw.pageDesign && !design) throw new Error(`Unknown page design "${raw.pageDesign}" in routes/${key}.json`);
        // Partial designs come first in each placeholder, the page's own renderings follow — as Sitecore merges them.
        const merged = { ...(design?.placeholders ?? {}) };
        for (const [name, list] of Object.entries(raw.placeholders ?? {})) merged[name] = [...(merged[name] ?? []), ...list];
        uid = 0;
        routes[path] = {
          sitecore: {
            context: {
              pageEditing: false,
              site: { name: site.name },
              pageState: 'normal',
              editMode: 'metadata',
              language: locale,
              itemPath: path,
            },
            route: {
              name: raw.name ?? key.split('/').pop(),
              displayName: raw.displayName ?? raw.name,
              fields: expandFields(raw.fields ?? {}, `routes/${key}`),
              databaseName: 'web',
              deviceId: guid('device:default'),
              itemId: guid(`route:${site.name}:${path}`),
              itemLanguage: locale,
              itemVersion: 1,
              layoutId: guid('layout:headless'),
              templateId: guid(`template:${raw.templateName ?? 'Page'}`),
              templateName: raw.templateName ?? 'Page',
              placeholders: placeholders(merged, `routes/${key}`),
            },
          },
          // Kept beside the layout data (not part of it) so the client can list, sitemap and 404 routes.
          meta: { notFound: Boolean(raw.notFound), sitemap: raw.sitemap !== false && !raw.notFound },
        };
      }
      result[site.name][locale] = {
        routes,
        dictionary: existsSync(dictFile) ? readJson(dictFile) : {},
      };
    }
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'sites.json'),
    JSON.stringify(sites.map(({ languages, ...s }) => ({ ...s, language: s.language ?? languages?.[0] })), null, 2)
  );
  writeFileSync(join(outDir, 'local-layout.json'), JSON.stringify(result));
  const count = Object.values(result).flatMap((s) => Object.values(s)).reduce((n, l) => n + Object.keys(l.routes).length, 0);
  for (const w of warnings) console.warn(`[local-content] warning: ${w}`);
  warnings.clear();
  console.log(`[local-content] ${items.size} items, ${count} routes → .sitecore/local-layout.json`);
}

build();

if (process.argv.includes('--watch')) {
  let timer;
  watch(contentDir, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (error) {
        console.error(`[local-content] ${error.message}`);
      }
    }, 100);
  });
  console.log('[local-content] watching content/');
}
