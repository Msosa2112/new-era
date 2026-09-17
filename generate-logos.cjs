const fs = require('fs');
const path = require('path');

const svgSource = fs.readFileSync('c:/TRABAJO/new era/LOOG/logos web/logo principal.svg', 'utf8');
const faviconSource = fs.readFileSync('c:/TRABAJO/new era/LOOG/logos web/favicon.svg', 'utf8');

function processLogo(svg, color) {
  return svg
    .replace(/width="[^"]+"/, 'width="100%"')
    .replace(/height="[^"]+"/, 'height="100%"')
    .replace(/\.fil0\s*\{fill:[^;}]+\}/g, `.fil0 {fill:${color};fill-rule:evenodd}`)
    .replace(/\.fil1\s*\{fill:[^;}]+\}/g, `.fil1 {fill:${color};fill-rule:nonzero}`);
}

function processFavicon(svg, color) {
  return svg
    .replace(/width="[^"]+"/, 'width="100%"')
    .replace(/height="[^"]+"/, 'height="100%"')
    .replace(/\.fil0\s*\{fill:[^;}]+\}/g, `.fil0 {fill:${color};fill-rule:nonzero}`);
}

fs.writeFileSync('c:/TRABAJO/new era/code/public/assets/logo-white.svg', processLogo(svgSource, '#FFFFFF'));
fs.writeFileSync('c:/TRABAJO/new era/code/public/assets/logo-burgundy.svg', processLogo(svgSource, '#660E1A'));
fs.writeFileSync('c:/TRABAJO/new era/code/public/assets/logo-orange.svg', processLogo(svgSource, '#FA2F0E'));

fs.writeFileSync('c:/TRABAJO/new era/code/public/assets/favicon-white.svg', processFavicon(faviconSource, '#FFFFFF'));
fs.writeFileSync('c:/TRABAJO/new era/code/public/assets/favicon-burgundy.svg', processFavicon(faviconSource, '#660E1A'));
fs.writeFileSync('c:/TRABAJO/new era/code/public/assets/favicon-orange.svg', processFavicon(faviconSource, '#FA2F0E'));

console.log('Successfully generated clean vector logo and favicon SVG assets!');
