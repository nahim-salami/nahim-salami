// scripts/generate_charts.js
// Génère SVG -> PNG frames -> GIFs pour les skills.
// Dépendances : puppeteer (rend les SVG en PNG) et ImageMagick (convert).

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

const repoRoot = path.join(__dirname, '..');
const outDir = path.join(repoRoot, 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const palette = {
  primary: '#0b72ff',
  green: '#28c76f',
  purple: '#6C63FF',
  cyan: '#00AEEF',
  orange: '#FB8C00',
  dark: '#0b1b2b'
};

// Ajuste ici les compétences et pourcentages
const skills = [
  { id: 'skill-js', label: 'JavaScript', pct: 92, color: palette.primary },
  { id: 'skill-php', label: 'PHP', pct: 86, color: palette.green },
  { id: 'skill-react', label: 'React', pct: 90, color: palette.cyan },
  { id: 'skill-three', label: 'Three.js', pct: 78, color: palette.purple },
  { id: 'skill-docker', label: 'Docker', pct: 82, color: palette.dark },
  { id: 'skill-sql', label: 'SQL', pct: 84, color: palette.orange },
];

function makeSVG(label, pct, color) {
  // SVG circulaire simple. On joue sur stroke-dasharray pour l'arc.
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 36 36'>
    <style>
      .bg{fill:none;stroke:#eeeeee;stroke-width:3}
      .fg{fill:none;stroke:${color};stroke-width:3;stroke-linecap:round}
      .txt{font-family:Inter,Arial,sans-serif;font-size:3px;fill:${palette.dark}}
    </style>
    <rect width="100%" height="100%" fill="transparent"/>
    <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
    <path class="fg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" stroke-dasharray="${pct},100" />
    <text x="18" y="21" class="txt" text-anchor="middle">${label} ${pct}%</text>
  </svg>`;
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 400 });

  for (const s of skills) {
    const svgContent = makeSVG(s.label, s.pct, s.color);
    const svgPath = path.join(outDir, `${s.id}.svg`);
    fs.writeFileSync(svgPath, svgContent, 'utf8');

    // Générer quelques frames animées (varie la valeur visible progressivement)
    const frameCount = 12;
    const framePaths = [];
    for (let f = 0; f < frameCount; f++) {
      const animPct = Math.round(s.pct * ((f + 1) / frameCount));
      const animatedSvg = makeSVG(s.label, animPct, s.color);
      const frameSvgPath = path.join(outDir, `${s.id}-frame-${String(f).padStart(2, '0')}.svg`);
      fs.writeFileSync(frameSvgPath, animatedSvg, 'utf8');

      await page.setContent(animatedSvg, { waitUntil: 'networkidle0' });
      const pngPath = path.join(outDir, `${s.id}-frame-${String(f).padStart(2, '0')}.png`);
      await page.screenshot({ path: pngPath });
      framePaths.push(pngPath);
    }

    // Créer un GIF à partir des frames (ImageMagick convert)
    const gifPath = path.join(outDir, `${s.id}.gif`);
    try {
      // -delay 6 => chaque frame ~0.06s (adjust si besoin)
      execSync(`convert -delay 6 -loop 0 ${path.join(outDir, s.id)}-frame-*.png ${gifPath}`, { stdio: 'inherit' });
    } catch (err) {
      console.warn('ImageMagick convert failed (maybe not installed):', err.message);
    }

    // Créer un PNG fallback (première frame)
    const fallbackPng = path.join(outDir, `${s.id}.png`);
    try {
      fs.copyFileSync(path.join(outDir, `${s.id}-frame-00.png`), fallbackPng);
    } catch (err) {
      console.warn('Failed to write fallback PNG:', err.message);
    }

    console.log(`Generated assets for ${s.id}: ${gifPath} and ${fallbackPng}`);
  }

  await browser.close();
  console.log('Done generating assets in', outDir);
})();
