// scripts/generate_cards_and_skills.js
// Génère :
// - cards (PNG) pour README profile (role, resume, contact, techstack, projects, repos, method, ci, links)
// - skill gifs + png fallbacks (skill-js, skill-php, skill-react, skill-three, skill-docker, skill-sql)
// Dépendances : puppeteer (rend SVG->PNG) et ImageMagick (convert) pour assembler GIFs.
// Usage : node scripts/generate_cards_and_skills.js

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const puppeteer = require('puppeteer');

const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Vérifier convert (ImageMagick)
function hasConvert() {
  try {
    const r = spawnSync('convert', ['-version']);
    return r.status === 0 || (!!r.stdout && r.stdout.length > 0);
  } catch (e) {
    return false;
  }
}
const CONVERT_AVAILABLE = hasConvert();
if (!CONVERT_AVAILABLE) {
  console.warn('⚠️ ImageMagick `convert` non trouvé. Les GIFs ne seront pas générés (seuls PNG seront créés). Installer imagemagick pour avoir les GIFs.');
}

// Palette (modifie si tu veux)
const palette = {
  primary: '#0b72ff',
  green: '#28c76f',
  purple: '#6C63FF',
  cyan: '#00AEEF',
  orange: '#FB8C00',
  dark: '#0b1b2b',
  lightBg: '#ffffff',
  border: '#e6eef8',
  textMuted: '#555555'
};

// Données (utilise UNIQUEMENT ce que tu as fourni)
const profile = {
  name: 'Nahim Salami',
  rolesLine: 'CEO · Full-stack Developer · Chef de projet',
  company: 'Ahime',
  companyUrl: 'https://ahime.net',
  email: 'nahim.salami@ahime.net',
  phone: '(+229) 01 95 14 6985',
  location: 'Abomey-Calavi, Bénin',
  experienceYears: '7+',
  links: [
    { label: 'Formigo', url: 'https://formigo.ahime.net' },
    { label: 'Configurator3D', url: 'https://configurator3d.ahime.net' },
    { label: 'Atime', url: 'https://atime-lake.vercel.app' },
    { label: 'App Ahime', url: 'https://app.ahime.net' }
    // Kkivo lien à ajouter si disponible
  ],
  projects: [
    { title: 'Window3D', url: 'https://window3d.ahime.net' },
    { title: 'Chair3D', url: 'https://chair3d.ahime.net' },
    { title: 'Galaxy Game (repo)', url: 'https://github.com/nahim-salami/galaxy-game' },
    { title: 'Neon Product Designer', url: 'https://neonstore.be/neon-designer/' }
  ],
  reposPublic: [
    'github.com/nahim-salami/galaxy-game',
    'github.com/nahim-salami/ticket-app',
    'github.com/nahim-salami/simulate-typing',
    'github.com/nahim-salami/IMOTECK'
  ],
  certificationsNote: 'Certifications OpenClassrooms & profil LinkedIn'
};

// Cards to produce (id and generator)
const cards = [
  { id: 'card-role', title: profile.name, contentType: 'role' },
  { id: 'card-resume', title: 'Résumé professionnel', contentType: 'resume' },
  { id: 'card-contact', title: 'Contact', contentType: 'contact' },
  { id: 'card-techstack', title: 'Tech Stack', contentType: 'techstack' },
  { id: 'card-projects', title: 'Projets & plateformes', contentType: 'projects' },
  { id: 'card-repos', title: 'Dépôts & certifications', contentType: 'repos' },
  { id: 'card-method', title: 'Méthode de travail', contentType: 'method' },
  { id: 'card-ci', title: 'CI / Déploiement', contentType: 'ci' },
  { id: 'card-links', title: 'Liens rapides', contentType: 'links' }
];

// Skills (will produce gifs + png)
const skills = [
  { id: 'skill-js', label: 'JavaScript · Node.js', pct: 92, color: palette.primary },
  { id: 'skill-php', label: 'PHP · Laravel', pct: 86, color: palette.green },
  { id: 'skill-react', label: 'React · Vue', pct: 90, color: palette.cyan },
  { id: 'skill-three', label: 'Three.js · 3D', pct: 78, color: palette.purple },
  { id: 'skill-docker', label: 'Docker · K8s', pct: 82, color: palette.dark },
  { id: 'skill-sql', label: 'SQL · MySQL', pct: 84, color: palette.orange }
];

// Utility : esc HTML
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Card SVG templates (1080x600)
function cardSVG(type) {
  // Returns SVG string for a given contentType
  const w = 1080;
  const h = 600;
  // Common header
  const header = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <style>
        <![CDATA[
          .card-bg { fill: ${palette.lightBg}; stroke: ${palette.border}; stroke-width: 1; rx: 20; }
          .title { font: 700 34px/1.1 Inter, Roboto, Arial; fill: ${palette.dark}; }
          .subtitle { font: 400 18px/1.2 Inter, Roboto, Arial; fill: ${palette.textMuted}; }
          .item { font: 400 16px/1.3 Inter, Roboto, Arial; fill: ${palette.textMuted}; }
          .btn { font: 600 14px Inter, Roboto; fill: #fff; }
        ]]>
      </style>
      <rect x="8" y="8" width="${w-16}" height="${h-16}" rx="20" class="card-bg" />
  `;
  let body = '';
  if (type === 'role') {
    body = `
      <text x="60" y="120" class="title">${esc(profile.name)}</text>
      <text x="60" y="160" class="subtitle">${esc(profile.rolesLine)}</text>
      <a href="${esc(profile.companyUrl)}"><rect x="60" y="190" width="220" height="48" rx="10" fill="${palette.primary}"/><text x="170" y="224" class="btn" text-anchor="middle">${esc(profile.company)}</text></a>
      <g transform="translate(880,80)">
        <circle cx="60" cy="60" r="64" fill="none" stroke="${palette.primary}" stroke-width="6"></circle>
        <text x="60" y="78" font-size="40" font-weight="700" text-anchor="middle" fill="${palette.dark}">${esc(profile.experienceYears)}</text>
        <text x="60" y="112" font-size="14" text-anchor="middle" fill="${palette.textMuted}">expérience</text>
      </g>
    `;
  } else if (type === 'resume') {
    body = `
      <text x="60" y="120" class="title">Résumé professionnel</text>
      <text x="60" y="170" class="item">• Direction & architecture produit (SaaS & 3D)</text>
      <text x="60" y="210" class="item">• Développement full-stack : frontend, backend, 3D</text>
      <text x="60" y="250" class="item">• Management d'équipes techniques et livraisons agiles</text>
      <rect x="60" y="300" width="960" height="4" rx="2" fill="${palette.border}" />
      <text x="60" y="340" class="subtitle">Approche</text>
      <text x="60" y="370" class="item">Produit → Tests → CI/CD → Monitoring</text>
    `;
  } else if (type === 'contact') {
    body = `
      <text x="60" y="120" class="title">Contact</text>
      <text x="60" y="170" class="item">✉️ ${esc(profile.email)}</text>
      <text x="60" y="210" class="item">☎️ ${esc(profile.phone)}</text>
      <text x="60" y="250" class="item">📍 ${esc(profile.location)}</text>
      <a href="https://linkedin.com/in/nahimsalami"><rect x="60" y="300" width="160" height="44" rx="8" fill="${palette.primary}"/><text x="140" y="333" class="btn" text-anchor="middle">LinkedIn</text></a>
      <a href="${esc(profile.companyUrl)}"><rect x="240" y="300" width="160" height="44" rx="8" fill="${palette.green}"/><text x="320" y="333" class="btn" text-anchor="middle">Ahime</text></a>
    `;
  } else if (type === 'techstack') {
    body = `
      <text x="60" y="120" class="title">Tech Stack</text>
      <g transform="translate(60,160)">
        <rect x="0" y="0" width="92" height="92" rx="12" fill="${palette.primary}"/><text x="46" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">JS</text>
        <rect x="112" y="0" width="92" height="92" rx="12" fill="${palette.green}"/><text x="158" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">PHP</text>
        <rect x="224" y="0" width="92" height="92" rx="12" fill="${palette.cyan}"/><text x="270" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#071">React</text>
        <rect x="336" y="0" width="92" height="92" rx="12" fill="${palette.purple}"/><text x="382" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">3D</text>
        <rect x="448" y="0" width="92" height="92" rx="12" fill="${palette.dark}"/><text x="494" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">Docker</text>
      </g>
      <text x="60" y="300" class="item">Principaux outils : Vue.js • React • Laravel • Three.js • Docker • K8s • GitHub Actions • Azure/AWS</text>
    `;
  } else if (type === 'projects') {
    const rows = profile.projects.map((p, i) => `<text x="60" y="${150 + i*34}" class="item">• ${esc(p.title)} — ${esc(p.url)}</text>`).join('');
    body = `
      <text x="60" y="120" class="title">Projets & plateformes</text>
      ${rows}
    `;
  } else if (type === 'repos') {
    const rows = profile.reposPublic.map((r, i) => `<text x="60" y="${150 + i*34}" class="item">• ${esc(r)}</text>`).join('');
    body = `
      <text x="60" y="120" class="title">Dépôts & certifications</text>
      ${rows}
      <text x="60" y="420" class="subtitle">${esc(profile.certificationsNote)}</text>
    `;
  } else if (type === 'method') {
    body = `
      <text x="60" y="120" class="title">Méthode de travail</text>
      <text x="60" y="170" class="item">1) Product discovery & définition MVP</text>
      <text x="60" y="210" class="item">2) Développement itératif & tests automatisés</text>
      <text x="60" y="250" class="item">3) CI/CD, monitoring & scalabilité</text>
      <g transform="translate(820,160)"><rect x="0" y="0" width="160" height="160" rx="12" fill="${palette.primary}"><animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite"/></rect><text x="80" y="90" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">Agile</text></g>
    `;
  } else if (type === 'ci') {
    body = `
      <text x="60" y="120" class="title">CI / Déploiement</text>
      <text x="60" y="170" class="item">GitHub Actions · Docker · Kubernetes</text>
      <text x="60" y="210" class="item">Azure & AWS pour production</text>
      <rect x="60" y="260" width="420" height="16" rx="8" fill="#f0f6ff" />
      <rect x="60" y="260" width="320" height="16" rx="8" fill="${palette.green}">
        <animate attributeName="width" values="0;320;320" dur="2.6s" repeatCount="indefinite"/>
      </rect>
    `;
  } else if (type === 'links') {
    const linksRows = profile.links.map((l, i) => `<a href="${esc(l.url)}"><text x="60" y="${140 + i*36}" class="item" fill="#286cfe">• ${esc(l.label)} — ${esc(l.url)}</text></a>`).join('');
    body = `
      <text x="60" y="96" class="title">Liens rapides</text>
      ${linksRows}
    `;
  } else {
    body = `<text x="60" y="120" class="title">Card</text><text x="60" y="160" class="item">Contenu</text>`;
  }

  const footer = `</svg>`;
  return header + body + footer;
}

// Skill (circular) SVG generator used for frames
function skillSVG(label, pct, color) {
  // SVG sized 400x400, uses circle arc via stroke-dasharray
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280">
    <style>
      .bg{fill:none;stroke:#eeeeee;stroke-width:12}
      .fg{fill:none;stroke:${color};stroke-width:12;stroke-linecap:round}
      .label{font-family:Inter,Arial,sans-serif;font-size:20px;fill:${palette.dark}}
    </style>
    <rect width="100%" height="100%" fill="${palette.lightBg}" />
    <g transform="translate(40,40)">
      <path class="bg" d="M120 0 a 120 120 0 1 1 0 0.0001" />
      <path class="fg" d="M120 0 a 120 120 0 1 1 0 0.0001" stroke-dasharray="${pct},100" />
      <text x="240" y="80" class="label">${esc(label)} ${pct}%</text>
    </g>
  </svg>`;
}

// Write file helper
function writeFileSafe(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

// Main
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Set viewport for cards (1080x600)
  await page.setViewport({ width: 1080, height: 600 });

  // Generate cards PNGs + SVGs
  for (const c of cards) {
    const svg = cardSVG(c.contentType);
    const svgPath = path.join(outDir, `${c.id}.svg`);
    fs.writeFileSync(svgPath, svg, 'utf8');

    // Wrap SVG inside basic HTML to ensure consistent rendering
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:${palette.lightBg};display:flex;align-items:center;justify-content:center;height:100vh;}</style></head><body>${svg}</body></html>`;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pngPath = path.join(outDir, `${c.id}.png`);
    await page.screenshot({ path: pngPath, omitBackground: false });
    console.log('Wrote', pngPath);
  }

  // Generate skills frames -> GIF and fallback PNG
  await page.setViewport({ width: 400, height: 280 });
  for (const s of skills) {
    const baseSvg = skillSVG(s.label, s.pct, s.color);
    const svgPath = path.join(outDir, `${s.id}.svg`);
    fs.writeFileSync(svgPath, baseSvg, 'utf8');

    // frames
    const frameCount = 12;
    const framePaths = [];
    for (let f = 0; f < frameCount; f++) {
      const animPct = Math.round(s.pct * ((f + 1) / frameCount));
      const frameSvg = skillSVG(s.label, animPct, s.color);
      const frameSvgPath = path.join(outDir, `${s.id}-frame-${String(f).padStart(2,'0')}.svg`);
      fs.writeFileSync(frameSvgPath, frameSvg, 'utf8');

      const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:${palette.lightBg};display:flex;align-items:center;justify-content:center;height:100vh;}</style></head><body>${frameSvg}</body></html>`;
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pngPath = path.join(outDir, `${s.id}-frame-${String(f).padStart(2,'0')}.png`);
      await page.screenshot({ path: pngPath, omitBackground: false });
      framePaths.push(pngPath);
    }

    // create png fallback (first frame)
    const fallbackPng = path.join(outDir, `${s.id}.png`);
    fs.copyFileSync(framePaths[0], fallbackPng);
    console.log('Wrote', fallbackPng);

    // create gif if convert available
    if (CONVERT_AVAILABLE) {
      const gifPath = path.join(outDir, `${s.id}.gif`);
      try {
        // Use convert with explicit glob pattern - use quotes to avoid shell expansion issues
        // Building arg list rather than a single string to avoid shell parsing
        const framePattern = path.join(outDir, `${s.id}-frame-*.png`);
        execSync(`convert -delay 6 -loop 0 "${framePattern}" "${gifPath}"`, { stdio: 'inherit' });
        console.log('Wrote', gifPath);
      } catch (err) {
        console.warn('convert failed for', s.id, err.message);
      }
    } else {
      console.warn('Skipping GIF generation for', s.id, 'because ImageMagick is not available.');
    }
  }

  await browser.close();

  // Summary
  const allFiles = fs.readdirSync(outDir).filter(f => /\.(png|gif|svg)$/i.test(f));
  console.log('Generated files:', allFiles.join(', '));
  console.log('Assets are in', outDir);
})();
