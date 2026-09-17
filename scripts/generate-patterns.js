const fs = require('fs');
const path = require('path');

const srcSvgPath = path.resolve(__dirname, '../../LOOG/logos web/pattern.svg');
const publicAssetsDir = path.resolve(__dirname, '../public/assets');

if (!fs.existsSync(srcSvgPath)) {
  console.error('Source pattern.svg not found at:', srcSvgPath);
  process.exit(1);
}

const rawSvg = fs.readFileSync(srcSvgPath, 'utf8');

// Extract the path content inside <g id="Contenido_x0020_de_x0020_PowerClip">
// The structure is:
// <svg ... viewBox="0 0 2848.5 2862.06" ...>
//  <defs>...</defs>
//  <g id="Contenido_x0020_de_x0020_PowerClip">
//   <metadata .../>
//   <path ... d="..." />
//  </g>
// </svg>

const pathMatch = rawSvg.match(/<path[^>]*d="([^"]+)"/);
if (!pathMatch) {
  console.error('Could not find path data in SVG');
  process.exit(1);
}

const pathD = pathMatch[1];

function buildSvgWithDef(defsContent, fillStyle) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="100%" height="100%" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
viewBox="0 0 2848.5 2862.06"
 xmlns:xlink="http://www.w3.org/1999/xlink">
 <defs>
  ${defsContent}
  <style type="text/css">
   <![CDATA[
    .brand-pattern-path { ${fillStyle} }
   ]]>
  </style>
 </defs>
 <g id="brand_pattern_group">
  <path class="brand-pattern-path" d="${pathD}" />
 </g>
</svg>`;
}

const variants = [
  {
    name: 'pattern-white.svg',
    defs: '',
    fill: 'fill: #FFFFFF;'
  },
  {
    name: 'pattern-burgundy.svg',
    defs: '',
    fill: 'fill: #660E1A;'
  },
  {
    name: 'pattern-orange.svg',
    defs: '',
    fill: 'fill: #FA2F0E;'
  },
  {
    name: 'pattern-dark.svg',
    defs: '',
    fill: 'fill: #1E2028;'
  },
  {
    name: 'pattern-gradient-orange.svg',
    defs: `
    <linearGradient id="brandOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5722" />
      <stop offset="45%" stop-color="#FA2F0E" />
      <stop offset="100%" stop-color="#660E1A" />
    </linearGradient>`,
    fill: 'fill: url(#brandOrangeGrad);'
  },
  {
    name: 'pattern-gradient-burgundy.svg',
    defs: `
    <linearGradient id="brandBurgundyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#801020" />
      <stop offset="50%" stop-color="#660E1A" />
      <stop offset="100%" stop-color="#38070E" />
    </linearGradient>`,
    fill: 'fill: url(#brandBurgundyGrad);'
  },
  {
    name: 'pattern-gradient-vibrant.svg',
    defs: `
    <linearGradient id="brandVibrantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA07A" />
      <stop offset="35%" stop-color="#FA2F0E" />
      <stop offset="75%" stop-color="#9C1425" />
      <stop offset="100%" stop-color="#660E1A" />
    </linearGradient>`,
    fill: 'fill: url(#brandVibrantGrad);'
  },
  {
    name: 'pattern-gradient-gold.svg',
    defs: `
    <linearGradient id="brandGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>`,
    fill: 'fill: url(#brandGoldGrad);'
  },
  {
    name: 'pattern-gradient-glow.svg',
    defs: `
    <linearGradient id="brandGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#FA2F0E" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#660E1A" stop-opacity="0.6" />
    </linearGradient>`,
    fill: 'fill: url(#brandGlowGrad);'
  }
];

for (const variant of variants) {
  const content = buildSvgWithDef(variant.defs, variant.fill);
  const outPath = path.join(publicAssetsDir, variant.name);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Generated: ${variant.name} (${(content.length / 1024).toFixed(1)} KB)`);
}

// Also save raw pattern.svg
fs.copyFileSync(srcSvgPath, path.join(publicAssetsDir, 'pattern.svg'));
console.log('Saved raw pattern.svg successfully.');
