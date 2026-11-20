// Measures every rendered design board (height at 1440 and, where the canvas has a phone board,
// at 390) and captures a thumbnail of each board's first screen. Run after build.py.
// Writes src/walkthrough/data/board-metrics.json and public/walkthrough-assets/canvas/thumbs/*.jpg.
// Needs Playwright with Chromium (require('playwright') must resolve).
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const boardsDir = `${repo}/public/walkthrough-assets/canvas/boards`;
const thumbs = `${repo}/public/walkthrough-assets/canvas/thumbs`;
mkdirSync(thumbs, { recursive: true });

const data = JSON.parse(readFileSync(`${repo}/src/walkthrough/data/canvas.json`, 'utf8'));
const jobs = data.templates.flatMap((t) => t.views.map((v) => v)).concat([{ board: 'SiteHeader' }, { board: 'SiteFooter' }]);

const browser = await chromium.launch();
const metrics = {};
const errors = [];
for (const view of jobs) {
  const url = `file://${boardsDir}/${view.board}.html`;
  const m = {};
  for (const width of view.phone ? [1440, 390] : [1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: width === 1440 ? 0.6 : 1 });
    page.on('pageerror', (e) => errors.push(`${view.board}: ${e}`));
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    m[width] = await page.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height));
    if (width === 390) m.overflow390 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (width === 1440 && view.title) await page.screenshot({ path: `${thumbs}/${view.board}.jpg`, type: 'jpeg', quality: 78 });
    await page.close();
  }
  metrics[view.board] = m;
}
await browser.close();
writeFileSync(`${repo}/src/walkthrough/data/board-metrics.json`, JSON.stringify(metrics, null, 1) + '\n');
const overflow = Object.entries(metrics).filter(([, m]) => m.overflow390).map(([k]) => k);
console.log(`measured ${Object.keys(metrics).length} boards; phone overflow: ${overflow.join(', ') || 'none'}; errors: ${errors.length}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
