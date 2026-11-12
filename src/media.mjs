// Fabrique les médias du README à partir des captures et des vidéos de démo.
//   node src/media.mjs
// Entrées  : media/shots/*.png (src/capture.mjs) et media/src/*.mp4 (vidéos de démo)
// Sorties  : assets/media/*.webp (fenêtres encadrées) et media/thumbs/*.jpg (vignettes des cartes)
// Demande Chrome (ou Edge) et ffmpeg sur la machine.

import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FEATURED, OTHERS } from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, 'media', 'shots');
const VIDEOS = join(ROOT, 'media', 'src');
const TMP = join(ROOT, 'media', 'tmp');
const THUMBS = join(ROOT, 'media', 'thumbs');
const OUT = join(ROOT, 'assets', 'media');
for (const d of [TMP, THUMBS, OUT]) mkdirSync(d, { recursive: true });

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));

const ffmpeg = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
const kb = (f) => `${Math.round(statSync(f).size / 1024)} Ko`;
const BAR = 38;
const W = 832;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--allow-file-access-from-files'] });
const frameUrl = pathToFileURL(join(ROOT, 'src', 'frame.html')).href;

async function shootFrame(params, file, scale) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: 700, deviceScaleFactor: scale });
  await page.goto(`${frameUrl}?${new URLSearchParams(params)}`, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  const el = await page.$('#win');
  await el.screenshot({ path: file, omitBackground: true });
  await page.close();
}

for (const p of FEATURED) {
  const out = join(OUT, `${p.id}.webp`);
  const bar = p.bar ?? new URL(p.url).host;

  if (p.video) {
    // Démo animée : la vidéo est glissée sous le cadre, puis rognée aux coins arrondis.
    const src = join(VIDEOS, p.video.file);
    const [vw, vh] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).toString().trim().split(',').map(Number);
    const h = Math.round((W * vh) / vw / 2) * 2;
    const frame = join(TMP, `${p.id}-frame.png`);
    const mask = join(TMP, `${p.id}-mask.png`);
    await shootFrame({ url: bar, h }, frame, 1);
    await shootFrame({ url: bar, h, mode: 'mask' }, mask, 1);
    ffmpeg(
      '-i', src, '-i', frame, '-i', mask,
      '-filter_complex',
      `[0:v]fps=${p.video.fps ?? 15},scale=${W}:${h}:flags=lanczos,pad=${W}:${h + BAR}:0:${BAR}:color=0x17191E[v];`
      + `[v][1:v]overlay=0:0[w];[2:v]format=gray[m];[w][m]alphamerge[o]`,
      '-map', '[o]', '-an', '-c:v', 'libwebp', '-lossless', '0', '-q:v', String(p.video.q ?? 60), '-compression_level', '5', '-loop', '0', out,
    );
  } else {
    // Capture fixe, rendue en double densité.
    const png = join(TMP, `${p.id}.png`);
    await shootFrame({ url: bar, img: pathToFileURL(join(SHOTS, `${p.shot}.png`)).href }, png, 2);
    ffmpeg('-i', png, '-c:v', 'libwebp', '-lossless', '0', '-q:v', '90', '-compression_level', '6', out);
  }
  console.log(`${p.id}.webp  ${kb(out)}`);
}
await browser.close();

// Trois vignettes pour la bannière : une image de chaque projet de tête.
const BANNER = {
  'banner-mesura': join(VIDEOS, 'marque_videos_mesura-fenetre.jpg'),
  'banner-neon-light': join(VIDEOS, 'marque_videos_neon-light.jpg'),
  'banner-wezon': join(SHOTS, 'wezon.png'),
};
for (const [name, src] of Object.entries(BANNER)) {
  const out = join(THUMBS, `${name}.jpg`);
  ffmpeg('-i', src, '-vf', 'scale=432:270:force_original_aspect_ratio=increase:flags=lanczos,crop=432:270:0:0', '-q:v', '4', out);
  console.log(`${name}.jpg  ${kb(out)}`);
}

// Vignettes des autres réalisations (intégrées ensuite dans les cartes SVG).
for (const p of OTHERS) {
  if (!p.shot) continue;
  const out = join(THUMBS, `${p.id}.jpg`);
  ffmpeg('-i', join(SHOTS, `${p.shot}.png`), '-vf', 'scale=812:-2:flags=lanczos,crop=812:508:0:0', '-q:v', '4', out);
  console.log(`${p.id}.jpg  ${kb(out)}`);
}
