// Renders the Investors page in Chromium and records the markup of every state the site renders
// only on demand: the six mega menus, the language menu, the phone menu and its six groups.
// Usage: node capture.mjs <site base URL> <output JSON>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base, outFile] = process.argv.slice(2);
const url = `${base.replace(/\/$/, '')}/investors/`;

const browser = await chromium.launch();
const out = { megas: [], mobilePanels: [] };

const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto(url, { waitUntil: 'networkidle' });
await desk.waitForTimeout(800);
out.base = await desk.evaluate(() => document.documentElement.outerHTML);
const triggers = desk.locator('.dy-nav-trigger');
for (let i = 0; i < (await triggers.count()); i++) {
  await triggers.nth(i).click();
  await desk.waitForSelector('.dy-mega');
  out.megas.push(await desk.evaluate(() => document.querySelector('.dy-mega').outerHTML));
  await triggers.nth(i).click();
  await desk.waitForTimeout(100);
}
await desk.locator('.dy-lang-trigger').click();
out.lang = await desk.evaluate(() => document.querySelector('.dy-lang-menu').outerHTML);

const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
await phone.goto(url, { waitUntil: 'networkidle' });
await phone.locator('.dy-mobile-trigger').click();
await phone.waitForTimeout(500);
out.mobileDialog = await phone.evaluate(() => document.querySelector('dialog.dy-dialog--nav').outerHTML);
const groups = phone.locator('dialog .dy-accordion-trigger');
for (let i = 0; i < (await groups.count()); i++) {
  await groups.nth(i).click();
  await phone.waitForTimeout(150);
  out.mobilePanels.push(await phone.evaluate(() => document.querySelector('dialog .dy-accordion-content').outerHTML));
}

writeFileSync(outFile, JSON.stringify(out));
console.log(`captured: ${out.megas.length} menus, ${out.mobilePanels.length} phone groups`);
await browser.close();
