// Reference screenshots of the assembled package (desktop, phone, Investors menu, phone menu).
// Usage: node screenshots.mjs <package base URL> <screenshots dir>
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base, dir] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];

async function full(width, scale, name) {
  const p = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: scale });
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(base, { waitUntil: 'networkidle' });
  // Scroll through so lazy images load before the full-page capture.
  for (let y = 0; y < 10000; y += 600) {
    await p.evaluate((top) => window.scrollTo(0, top), y);
    await p.waitForTimeout(60);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${dir}/${name}`, fullPage: true, type: 'jpeg', quality: 82 });
  return p;
}

const desk = await full(1440, 1, 'desktop-full-page.jpg');
await desk.locator('.dy-nav-trigger').last().click();
await desk.screenshot({ path: `${dir}/desktop-investors-menu.jpg`, type: 'jpeg', quality: 85 });
const phone = await full(390, 2, 'phone-full-page.jpg');
await phone.click('.dy-mobile-trigger');
await phone.waitForTimeout(400);
await phone.locator('#dy-mobile-nav .dy-accordion-trigger').last().click();
await phone.waitForTimeout(200);
await phone.screenshot({ path: `${dir}/phone-menu.jpg`, type: 'jpeg', quality: 85 });
const overflow = await phone.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

await browser.close();
if (errors.length || overflow) {
  console.error('package check failed:', { errors, phoneOverflow: overflow });
  process.exit(1);
}
console.log('screenshots written; no page errors; no sideways scroll on phones');
