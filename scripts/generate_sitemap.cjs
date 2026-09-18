const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://newerarealestateky.com';
const TODAY = new Date().toISOString().split('T')[0];

// Extract agent IDs from agentsData.ts
const agentsDataPath = path.join(__dirname, '../src/data/agentsData.ts');
const agentsFileContent = fs.readFileSync(agentsDataPath, 'utf8');
const agentIdMatches = [...agentsFileContent.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
const uniqueAgentIds = [...new Set(agentIdMatches)];

// Extract property slugs from mockProperties.ts
const propertiesDataPath = path.join(__dirname, '../src/data/mockProperties.ts');
const propertiesFileContent = fs.readFileSync(propertiesDataPath, 'utf8');
const propertySlugMatches = [...propertiesFileContent.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
const uniquePropertySlugs = [...new Set(propertySlugMatches)];

const urls = [
  // 1. Core High-Priority Pages
  { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${SITE_URL}/#/properties`, changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_URL}/#/agents`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_URL}/#/buy`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_URL}/#/sell`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_URL}/#/about`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/#/contact`, changefreq: 'monthly', priority: '0.7' },

  // 2. Dynamic Advisor Profiles (All 19 Licensed Advisors)
  ...uniqueAgentIds.map(agentId => ({
    loc: `${SITE_URL}/#/agents/${agentId}`,
    changefreq: 'weekly',
    priority: '0.8'
  })),

  // 3. Dynamic Property Listings
  ...uniquePropertySlugs.map(slug => ({
    loc: `${SITE_URL}/#/properties/${slug}`,
    changefreq: 'weekly',
    priority: '0.8'
  }))
];

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
console.log(`[SEO] Sitemap successfully generated with ${urls.length} URLs at ${sitemapPath}`);
