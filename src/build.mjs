// Génère le profil GitHub : README.md, README.en.md, la bannière, les boutons et les cartes.
//
//   npm install          (une seule fois)
//   npm run capture      captures des sites en ligne        → media/shots
//   npm run media        démos animées, cadres, vignettes   → assets/media, media/thumbs
//   npm run build        README + SVG                       → README.md, README.en.md, assets/
//
// GitHub retire tout CSS et tout JS d'un README. Le texte est donc du Markdown
// natif (lisible partout, clair comme sombre) ; seuls la bannière, les boutons
// et les cartes sont des images SVG, dessinées ici.
// Le contenu se modifie dans src/data.mjs, jamais dans les fichiers générés.

import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTACT, FEATURED, HOME_URL, I18N, OTHERS, SKILLS } from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');
mkdirSync(ASSETS, { recursive: true });

/* ------------------------- Couleurs de la marque Ahime -------------------- */

const GRAPHITE = '#0E0F12';
const SLATE = '#17191E';
const SLATE_2 = '#1F2229';
const WHITE = '#FFFFFF';
const SOFT = '#A9AEB8';
const RED = '#D0121B';
const RED_BRIGHT = '#E8202A';

const FULL = 832;  // largeur utile du README GitHub : 846 px
const HALF = 414;  // deux cartes par ligne sur ordinateur, une sur mobile
const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif`;
const MONO = `ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`;

const r = (n) => String(Math.round(n * 100) / 100);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* -------------------- Plus Jakarta Sans → tracés vectoriels --------------- */
// Une image SVG d'un README ne peut charger aucune police : les titres sont
// convertis en tracés, pour un rendu identique sur toutes les machines.

const jakarta = fontkit.create(Buffer.from(await wawoff2.decompress(readFileSync(
  join(ROOT, 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'),
))));
const weights = new Map();
const face = (wght) => weights.get(wght) ?? weights.set(wght, jakarta.getVariation({ wght })).get(wght);

const CMD = { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' };

function shape(str, size, wght, tracking = 0) {
  const font = face(wght);
  const run = font.layout(str);
  const k = size / font.unitsPerEm;
  let pen = 0;
  let d = '';
  run.glyphs.forEach((g, i) => {
    if (g.id === 0) console.warn(`  ! glyphe manquant dans « ${str} »`);
    const p = run.positions[i];
    const dx = (pen + p.xOffset) * k;
    for (const c of g.path.commands) {
      d += CMD[c.command];
      for (let j = 0; j < c.args.length; j += 2) d += `${j ? ' ' : ''}${r(c.args[j] * k + dx)} ${r(-c.args[j + 1] * k - p.yOffset * k)}`;
    }
    pen += p.xAdvance + tracking * font.unitsPerEm;
  });
  return { d, w: Math.max(0, pen * k - tracking * size) };
}

function text(str, size, wght, x, y, { fill = WHITE, tracking = 0, fit, opacity } = {}) {
  let s = shape(str, size, wght, tracking);
  if (fit && s.w > fit) { size *= fit / s.w; s = shape(str, size, wght, tracking); }
  return { svg: `<path transform="translate(${r(x)} ${r(y)})" fill="${fill}"${opacity ? ` fill-opacity="${opacity}"` : ''} d="${s.d}"/>`, w: s.w };
}

const doc = (w, h, label, body, css = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${css ? `<style>${css}</style>` : ''}${body}</svg>\n`;

const arrow = (x, y, s, color) => `<path d="M${r(x)} ${r(y + s)}L${r(x + s)} ${r(y)}M${r(x + s * 0.3)} ${r(y)}H${r(x + s)}V${r(y + s * 0.7)}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;

function jpeg(file) {
  const path = join(ROOT, 'media', 'thumbs', file);
  if (!existsSync(path)) { console.warn(`  ! vignette absente : ${file} (lancer npm run media)`); return null; }
  return `data:image/jpeg;base64,${readFileSync(path).toString('base64')}`;
}

/* -------------------------------- Bannière -------------------------------- */

function banner(L) {
  const W = FULL, H = 300;
  const shots = [
    { img: jpeg('banner-mesura.jpg'), x: 458, y: 38 },
    { img: jpeg('banner-neon-light.jpg'), x: 524, y: 82 },
    { img: jpeg('banner-wezon.jpg'), x: 590, y: 126 },
  ];
  const cw = 214, ch = 134;
  const stack = shots.map((s, i) => `
<g filter="url(#sh)">
<rect x="${s.x}" y="${s.y}" width="${cw}" height="${ch}" rx="9" fill="${SLATE_2}"/>
${s.img ? `<image href="${s.img}" x="${s.x}" y="${s.y}" width="${cw}" height="${ch}" preserveAspectRatio="xMidYMin slice" clip-path="url(#c${i})"/>` : ''}
<rect x="${s.x + 0.5}" y="${s.y + 0.5}" width="${cw - 1}" height="${ch - 1}" rx="8.5" fill="none" stroke="${WHITE}" stroke-opacity=".16"/>
</g>`).join('');

  const pill = shape(L.avail, 12.5, 500);
  let fx = 40;
  const facts = L.facts.map((f) => {
    const t = text(f, 12.5, 500, fx + 22, 262, { fill: '#C9CDD4' });
    const out = `<path d="M${fx} 257.5h14" stroke="${RED_BRIGHT}" stroke-width="1.6"/>${t.svg}`;
    fx += 22 + t.w + 22;
    return out;
  }).join('');

  const body = `
<defs>
<clipPath id="bg"><rect width="${W}" height="${H}" rx="16"/></clipPath>
${shots.map((s, i) => `<clipPath id="c${i}"><rect x="${s.x}" y="${s.y}" width="${cw}" height="${ch}" rx="9"/></clipPath>`).join('')}
<radialGradient id="glow" cx="${W - 150}" cy="30" r="460" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${RED}" stop-opacity=".5"/><stop offset=".55" stop-color="${RED}" stop-opacity=".1"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${WHITE}" stroke-opacity=".045"/></pattern>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
</defs>
<g clip-path="url(#bg)">
<rect width="${W}" height="${H}" fill="${GRAPHITE}"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${stack}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="15.5" fill="none" stroke="${WHITE}" stroke-opacity=".1"/>
<rect x="40.5" y="36.5" width="${r(pill.w + 38)}" height="28" rx="14" fill="${WHITE}" fill-opacity=".06" stroke="${WHITE}" stroke-opacity=".14"/>
<circle cx="55" cy="50.5" r="3.5" fill="${RED_BRIGHT}"/>
<path transform="translate(66 55)" fill="#D6D9DF" d="${pill.d}"/>
${text('Nahim Salami', 58, 800, 38, 132, { tracking: -0.035, fit: 392 }).svg}
${text(L.role, 17.5, 600, 40, 166, { fit: 392 }).svg}
${text(L.pitch[0], 14.5, 400, 40, 198, { fill: SOFT, fit: 392 }).svg}
${text(L.pitch[1], 14.5, 400, 40, 219, { fill: SOFT, fit: 392 }).svg}
${facts}`;
  return doc(W, H, L.bannerAlt, body);
}

/* --------------------------------- Boutons -------------------------------- */

function button(label, { primary = false, withArrow = true } = {}) {
  const H = 38;
  const t = shape(label, 13.5, 600, 0.005);
  const W = Math.ceil(16 + t.w + (withArrow ? 20 : 0) + 16);
  const body = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="9" fill="${primary ? RED : SLATE_2}" stroke="${WHITE}" stroke-opacity="${primary ? 0.18 : 0.14}"/>
<path transform="translate(16 23.8)" fill="${WHITE}" d="${t.d}"/>
${withArrow ? arrow(16 + t.w + 9, 14.5, 8, WHITE) : ''}`;
  return { svg: doc(W, H, label, body), w: W, h: H };
}

/* ------------------------- Carte « autre réalisation » -------------------- */

function otherCard(p, lang) {
  const W = HALF, H = 404;
  const img = jpeg(`${p.id}.jpg`);
  const ix = 4.5, iy = 4.5, iw = W - 9, ih = 253;
  const css = `.d{margin:0;font:400 13px/1.5 ${SANS};color:${SOFT};display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`
    + `.t{display:flex;flex-wrap:wrap;gap:5px;height:22px;overflow:hidden}`
    + `.t span{font:500 10.5px/1 ${MONO};padding:5px 7px;border:1px solid rgba(255,255,255,.16);border-radius:5px;color:#C9CDD4;white-space:nowrap}`;
  const body = `
<defs><clipPath id="im"><path d="M${ix} ${iy + 14}a14 14 0 0 1 14-14h${iw - 28}a14 14 0 0 1 14 14v${ih - 14}h-${iw}z"/></clipPath></defs>
<rect x="${ix}" y="${iy}" width="${iw}" height="${H - 9}" rx="14" fill="${SLATE}"/>
${img ? `<image href="${img}" x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMin slice" clip-path="url(#im)"/>` : ''}
<path d="M${ix} ${iy + ih}h${iw}" stroke="${WHITE}" stroke-opacity=".1"/>
<rect x="${ix}" y="${iy}" width="${iw}" height="${H - 9}" rx="14" fill="none" stroke="${WHITE}" stroke-opacity=".13"/>
${text(p[lang].kind.toUpperCase(), 10.5, 700, 24, 286, { fill: RED_BRIGHT, tracking: 0.09 }).svg}
${text(p.name, 20, 700, 24, 313, { tracking: -0.02, fit: 320 }).svg}
<circle cx="${W - 36}" cy="300" r="13.5" fill="none" stroke="${WHITE}" stroke-opacity=".2"/>${arrow(W - 40, 296, 8, WHITE)}
<foreignObject x="24" y="324" width="${W - 48}" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="d">${esc(p[lang].desc)}</div></foreignObject>
<foreignObject x="24" y="368" width="${W - 48}" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="t">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div></foreignObject>`;
  return doc(W, H, `${p.name} — ${p[lang].desc}`, body, css);
}

/* ---------------------------------- README -------------------------------- */
// Le même contenu sort en Markdown (README) et en HTML (aperçu local).

function render(lang, L, btn, md) {
  const img = (src, w, alt, h) => `<img src="${src}" width="${w}"${h ? ` height="${h}"` : ''} alt="${esc(alt)}">`;
  const a = (url, inner) => `<a href="${esc(url)}">${inner}</a>`;
  const h2 = (s) => (md ? `## ${s}` : `<h2>${s}</h2>`);
  const h3 = (s) => (md ? `### ${s}` : `<h3>${s}</h3>`);
  const para = (s) => (md ? s : `<p>${s}</p>`);
  const bold = (s) => (md ? `**${s}**` : `<b>${s}</b>`);
  const list = (items) => (md ? items.map((i) => `- ${i}`).join('\n') : `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`);
  const chips = (items) => (md ? items.map((i) => `\`${i}\``).join(' ') : `<p>${items.map((i) => `<code>${i}</code>`).join(' ')}</p>`);
  const b = (key) => img(`assets/${btn[key].file}`, btn[key].w, btn[key].label, btn[key].h);

  const featured = FEATURED.map((p) => {
    const buttons = [a(p.url, b('site'))];
    if (p.demo) buttons.push(a(p.demo, b('demo')));
    return [
      h3(p.name),
      para(bold(p[lang].tagline)),
      `<p>${a(p.demo ?? p.url, img(`assets/media/${p.id}.webp`, FULL, p[lang].alt))}</p>`,
      para(p[lang].desc),
      list(p[lang].points),
      chips(p.stack),
      `<p>${buttons.join(' ')}</p>`,
    ].join('\n\n');
  }).join('\n\n<br>\n\n');

  const others = OTHERS.map((p) => a(p.url, img(`assets/card-${p.id}.${lang}.svg`, HALF, `${p.name} — ${p[lang].desc}`))).join('\n  ');
  const skills = `<img src="https://skillicons.dev/icons?i=${SKILLS}&theme=dark&perline=10" alt="${esc(SKILLS.split(',').join(', '))}">`;
  const contact = CONTACT.map((c) => a(c.url, b(`contact-${c.id}`))).join(' ');

  return [
    `<p align="right"><sub><b>${L.self}</b> &nbsp;·&nbsp; ${a(L.other.file, L.other.label)}</sub></p>`,
    `<p align="center">${a(HOME_URL, img(`assets/banner.${lang}.svg`, FULL, L.bannerAlt))}</p>`,
    para(L.bio),
    `<p>${contact}</p>`,
    h2(L.hFeatured),
    featured,
    h2(L.hOthers),
    para(L.othersLead),
    `<p align="center">\n  ${others}\n</p>`,
    para(L.also),
    h2(L.hStack),
    `<p>\n  ${skills}\n</p>`,
    h2(L.hContact),
    para(L.contactLead),
    `<p>${contact}</p>`,
    `<p><sub>${L.foot}</sub></p>`,
  ].join('\n\n');
}

// Page locale qui imite la colonne du README GitHub (846 px, clair / sombre / mobile).
function preview(bodies) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aperçu du profil GitHub</title>
<style>
  body{margin:0;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;background:#fff;color:#1f2328}
  body.dark{background:#0d1117;color:#f0f6fc}
  .bar{position:sticky;top:0;z-index:2;display:flex;gap:8px;justify-content:center;padding:10px;background:inherit;border-bottom:1px solid rgba(128,128,128,.3)}
  .bar button{font:inherit;padding:4px 12px;border-radius:6px;border:1px solid rgba(128,128,128,.5);background:none;color:inherit;cursor:pointer}
  .md{width:846px;max-width:calc(100% - 32px);margin:24px auto 80px;word-wrap:break-word}
  body.mobile .md{width:294px}
  .md p,.md ul{margin:0 0 16px}.md ul{padding-left:2em}.md li+li{margin-top:.25em}
  .md img{max-width:100%;height:auto;box-sizing:content-box;border-style:none;vertical-align:middle}
  .md h2{margin:24px 0 16px;padding-bottom:.3em;font-size:1.5em;font-weight:600;line-height:1.25;border-bottom:1px solid rgba(209,217,224,.7)}
  .md h3{margin:24px 0 16px;font-size:1.25em;font-weight:600;line-height:1.25}
  body.dark .md h2{border-bottom-color:rgba(61,68,77,.7)}
  .md a{color:#0969da;text-decoration:none}body.dark .md a{color:#4493f8}
  .md code{padding:.2em .4em;font:85% ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:rgba(129,139,152,.12);border-radius:6px;white-space:nowrap}
  body.dark .md code{background:rgba(101,108,118,.2)}
  [hidden]{display:none}
</style></head><body>
<div class="bar">
  <button data-t="dark">Clair / sombre</button><button data-t="mobile">Ordinateur / mobile</button><button data-l>FR / EN</button>
</div>
${Object.entries(bodies).map(([lang, html], i) => `<div class="md" data-lang="${lang}"${i ? ' hidden' : ''}>\n${html}\n</div>`).join('\n')}
<script>
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => document.body.classList.toggle(b.dataset.t));
  document.querySelector('[data-l]').onclick = () => document.querySelectorAll('.md').forEach(m => m.hidden = !m.hidden);
</script>
</body></html>
`;
}

/* ---------------------------------- Build --------------------------------- */

const previews = {};
for (const lang of Object.keys(I18N)) {
  const L = I18N[lang];
  writeFileSync(join(ASSETS, `banner.${lang}.svg`), banner(L));

  const btn = {};
  const addButton = (key, label, opts) => {
    const out = button(label, opts);
    const file = `btn-${key}.${lang}.svg`;
    writeFileSync(join(ASSETS, file), out.svg);
    btn[key] = { file, w: out.w, h: out.h, label };
  };
  addButton('site', L.btnSite, { primary: true });
  addButton('demo', L.btnDemo);
  CONTACT.forEach((c) => addButton(`contact-${c.id}`, c.label[lang], { primary: c.primary }));

  OTHERS.forEach((p) => writeFileSync(join(ASSETS, `card-${p.id}.${lang}.svg`), otherCard(p, lang)));

  const banner_ = '<!-- Fichier généré par src/build.mjs. Modifier src/data.mjs puis lancer `npm run build`. -->\n\n';
  writeFileSync(join(ROOT, L.readme), `${banner_}${render(lang, L, btn, true)}\n`);
  previews[lang] = render(lang, L, btn, false);
}
writeFileSync(join(ROOT, 'preview.html'), preview(previews));
console.log('OK — README.md, README.en.md, assets/ et preview.html générés.');
