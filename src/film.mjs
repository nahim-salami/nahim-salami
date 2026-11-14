// Enregistre une page qui s'anime toute seule (le film d'accueil de Douke) en vidéo,
// pour en faire une démo animée avec src/media.mjs.
//   node src/film.mjs [nom] [secondes]
// Sortie : media/src/<nom>-film.webm. Demande Chrome (ou Edge) et ffmpeg sur la machine.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'media', 'src');
mkdirSync(OUT, { recursive: true });

const FILMS = {
  douke: { url: 'https://douke.ahime.net/', seconds: 60, width: 1200, height: 750 },
};

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));

const name = process.argv[2] ?? 'douke';
const film = FILMS[name];
if (!film) throw new Error(`Film inconnu : ${name}`);
const seconds = Number(process.argv[3] ?? film.seconds);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--lang=fr-FR'] });
const page = await browser.newPage();
await page.setViewport({ width: film.width, height: film.height, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
const file = join(OUT, `${name}-film.webm`);
const recorder = await page.screencast({ path: file });
await page.goto(film.url, { waitUntil: 'load', timeout: 45000 });
await new Promise((r) => setTimeout(r, seconds * 1000));
await recorder.stop();
await browser.close();
console.log(`${name}-film.webm  ${seconds} s`);
