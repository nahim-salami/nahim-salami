// Capture les pages d'accueil des projets avec le Chrome installé sur la machine.
//   node src/capture.mjs            → toutes les pages
//   node src/capture.mjs su hin     → seulement celles-ci
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'media', 'shots');
mkdirSync(OUT, { recursive: true });

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));

export const PAGES = {
  mesura: 'https://mesura.ahime.net/produit',
  'mesura-app': 'https://mesura.ahime.net/configurateur',
  'neon-light': 'https://neon-light.ahime.net/',
  'neon-light-app': 'https://neon-light.ahime.net/demo',
  wezon: 'https://wezon.ahime.net/',
  su: 'https://su.ahime.net/',
  hin: 'https://hin.ahime.net/',
  douke: 'https://douke.ahime.net/',
  wifitche: 'https://wifitche.ahime.net/',
  imo: 'https://imo.ahime.net/',
  lifac: 'https://lifac.ahime.net/',
  tank: 'http://tank-config.ziemann-holvrieka.com/',
  omniscan: 'https://omniscan.ahime.net/',
  pacifier: 'https://attache-tetine.ahime.net/',
  imdf: 'https://imdf.co/',
  'halal-brunch': 'https://halal-brunch.ahime.net/',
};

const only = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--lang=fr-FR'] });
for (const [name, url] of Object.entries(PAGES)) {
  if (only.length && !only.includes(name)) continue;
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 3000));
    // Bandeau de cookies : on refuse (jamais « accepter »), pour une capture propre.
    await page.evaluate(() => {
      const refuse = [...document.querySelectorAll('button, a')].find((b) => /continuer sans accepter|tout refuser|refuser|reject all|decline/i.test(b.textContent || ''));
      refuse?.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: join(OUT, `${name}.png`) });
    console.log(`${name}: ${res?.status()} ${await page.title()}`);
  } catch (e) {
    console.log(`${name}: ÉCHEC ${e.message.split('\n')[0]}`);
  }
  await page.close();
}
await browser.close();
