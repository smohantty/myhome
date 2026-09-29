/* Export a design's walkthrough geometry for the Blender pipeline.
   Usage: node tools/export_geometry.mjs v1 [v2 ...]      (no ids = every design in the manifest)
   Writes designs/<id>/house_geometry.json. Needs puppeteer (npm i -g puppeteer) and Google Chrome. */
import { createRequire } from 'module';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require('puppeteer'); }
catch { puppeteer = require(path.join(execSync('npm root -g').toString().trim(), 'puppeteer')); }

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({
  headless: 'new', ...(fs.existsSync(CHROME) ? { executablePath: CHROME } : {}),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href);
await page.waitForFunction(() => window.__viewer, { timeout: 30000 });
await page.evaluate(() => window.__viewer.ready);

let ids = process.argv.slice(2);
if (!ids.length) ids = await page.evaluate(() => window.DESIGN_IDS);
for (const id of ids) {
  const data = await page.evaluate(async id => {
    if (!window.DESIGNS[id]) return null;
    await window.__viewer.load(id);
    return window.__viewer.dumpGeometry();
  }, id);
  if (!data) { console.error(`✗ ${id}: not in designs/manifest.js`); process.exitCode = 1; continue; }
  const out = path.join(ROOT, 'designs', id, 'house_geometry.json');
  fs.writeFileSync(out, JSON.stringify(data));
  console.log(`✓ ${id}: ${data.length} meshes → ${path.relative(ROOT, out)}`);
}
if (errors.length) { console.error('page errors:', errors); process.exitCode = 1; }
await browser.close();
