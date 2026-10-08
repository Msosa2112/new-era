/**
 * Extrae los IDs oficiales del MLS (Spark / GLAR) para New Era Real Estate:
 *  - ListOfficeId / ListOfficeMlsId de la oficina
 *  - ListAgentId / ListAgentMlsId de cada asesor
 * y los empareja con los asesores de src/data/agentsData.ts.
 *
 * Uso: node scripts/extract_new_era_ids.cjs [rutaSalida.json]
 * El token se lee de .env (SPARK_API_TOKEN o VITE_SPARK_API_TOKEN). No se hardcodea.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Cargar .env ---
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([\w]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
const TOKEN = process.env.SPARK_API_TOKEN || process.env.VITE_SPARK_API_TOKEN;
if (!TOKEN) {
  console.error('Falta SPARK_API_TOKEN en .env');
  process.exit(1);
}

function spark(pathAndQuery) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'replication.sparkapi.com',
      path: '/v1' + pathAndQuery,
      method: 'GET',
      headers: {
        'User-Agent': 'NewEraRealEstate/1.0',
        'X-SparkApi-User-Agent': 'NewEraRealEstate/1.0',
        Authorization: 'Bearer ' + TOKEN,
        Accept: 'application/json'
      },
      timeout: 20000
    }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON inválido: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

const q = filter => encodeURIComponent(filter);

// MLS # conocidos de New Era (identificados en el escaneo previo)
const KNOWN_MLS_NUMBERS = [
  '1730676', '1730983', '1730058', '1727293', '1720560', '1730375', '1730634',
  '1719301', '1727273', '1730302', '1727678', '1729569', '1724081', '1722626',
  '1721732', '1729916', '1721863', '1716835', '1721923', '1719105'
];

// --- Asesores del sitio ---
function loadSiteAgents() {
  const src = fs.readFileSync(path.resolve(__dirname, '../src/data/agentsData.ts'), 'utf8');
  const m = src.match(/export const AGENTS_DATA: Agent\[\] = (\[[\s\S]*?\]);/);
  return m ? JSON.parse(m[1]) : [];
}

const norm = s => (s || '')
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z\s]/g, ' ')
  .split(/\s+/).filter(Boolean);

function matchAgent(mlsAgent, siteAgents) {
  const email = (mlsAgent.email || '').toLowerCase();
  if (email && !email.includes('*')) {
    const byEmail = siteAgents.find(a => (a.email || '').toLowerCase() === email);
    if (byEmail) return { agent: byEmail, method: 'email' };
  }
  // Todas las palabras del nombre corto del sitio deben estar en el nombre MLS (o en el slug)
  const mlsTokens = new Set(norm(mlsAgent.name));
  const candidates = siteAgents.filter(a => {
    const nameTokens = norm(a.name);
    return nameTokens.length > 0 && nameTokens.every(t => mlsTokens.has(t));
  });
  if (candidates.length === 1) return { agent: candidates[0], method: 'nombre' };
  const bySlug = siteAgents.filter(a => {
    const slugTokens = a.id.split('-');
    return slugTokens.length >= 2 && slugTokens.slice(0, 2).every(t => mlsTokens.has(t));
  });
  if (bySlug.length === 1) return { agent: bySlug[0], method: 'slug' };
  return null;
}

function pick(sf) {
  return {
    listingKey: null,
    mlsNumber: sf.ListingId,
    status: sf.StandardStatus,
    address: sf.UnparsedAddress,
    price: sf.ListPrice,
    officeName: sf.ListOfficeName,
    officeId: sf.ListOfficeId,
    officeMlsId: sf.ListOfficeMlsId,
    agentName: sf.ListAgentName,
    agentId: sf.ListAgentId,
    agentMlsId: sf.ListAgentMlsId,
    agentEmail: sf.ListAgentEmail,
    agentPhone: sf.ListAgentCellPhone || sf.ListAgentDirectPhone || null
  };
}

(async () => {
  console.log('1) Consultando los 20 MLS # conocidos por ListingId...');
  const known = [];
  for (const num of KNOWN_MLS_NUMBERS) {
    const r = await spark(`/listings?_filter=${q(`ListingId Eq '${num}'`)}&_limit=1`);
    const item = r.D?.Results?.[0];
    if (!item) { console.log(`   ✗ ${num}: sin resultado`); continue; }
    const p = pick(item.StandardFields || {});
    p.listingKey = item.Id;
    if (p.mlsNumber !== num) {
      console.log(`   ⚠ ${num}: el filtro ListingId fue ignorado (devolvió ${p.mlsNumber})`);
      continue;
    }
    known.push(p);
  }
  console.log(`   ✓ ${known.length}/${KNOWN_MLS_NUMBERS.length} confirmados`);

  // Oficinas detectadas
  const offices = {};
  for (const p of known) {
    if ((p.officeName || '').toLowerCase().includes('new era')) {
      offices[p.officeId] = offices[p.officeId] || { officeId: p.officeId, officeMlsId: p.officeMlsId, officeName: p.officeName, count: 0 };
      offices[p.officeId].count++;
    }
  }
  console.log('\n2) Oficinas New Era detectadas:', Object.values(offices));

  // Probar si el filtro por ListOfficeId funciona y traer TODO el inventario de la oficina
  const officeListings = [];
  for (const off of Object.values(offices)) {
    console.log(`\n3) Probando filtro ListOfficeId Eq '${off.officeId}'...`);
    const probe = await spark(`/listings?_filter=${q(`ListOfficeId Eq '${off.officeId}'`)}&_limit=1&_pagination=count`);
    const total = probe.D?.Pagination?.TotalRows;
    console.log(`   TotalRows reportado: ${total}`);
    if (!total || total > 2000) {
      console.log('   ⚠ El filtro parece ignorado (total demasiado alto o vacío). Se omite.');
      off.officeIdFilterWorks = false;
      continue;
    }
    let page = 1;
    while (true) {
      const r = await spark(`/listings?_filter=${q(`ListOfficeId Eq '${off.officeId}'`)}&_limit=100&_page=${page}`);
      const items = r.D?.Results || [];
      for (const it of items) {
        const p = pick(it.StandardFields || {});
        p.listingKey = it.Id;
        officeListings.push(p);
      }
      if (items.length < 100) break;
      page++;
    }
    const foreign = officeListings.filter(p => p.officeId !== off.officeId).length;
    off.officeIdFilterWorks = foreign === 0;
    console.log(`   ✓ ${officeListings.length} listados obtenidos | ajenos a la oficina: ${foreign}`);
  }

  // Consolidar listados (conocidos + por oficina)
  const byKey = new Map();
  for (const p of [...known, ...officeListings]) byKey.set(p.listingKey, p);
  const allListings = [...byKey.values()].filter(p => (p.officeName || '').toLowerCase().includes('new era'));

  // Agentes únicos
  const agentsMap = new Map();
  for (const p of allListings) {
    const key = p.agentId || p.agentName;
    if (!agentsMap.has(key)) {
      agentsMap.set(key, { name: p.agentName, agentId: p.agentId, agentMlsId: p.agentMlsId, email: p.agentEmail, phone: p.agentPhone, statuses: {} });
    }
    const a = agentsMap.get(key);
    a.statuses[p.status] = (a.statuses[p.status] || 0) + 1;
  }

  const siteAgents = loadSiteAgents();
  const agents = [...agentsMap.values()].map(a => {
    const m = matchAgent(a, siteAgents);
    return { ...a, siteAgentId: m?.agent.id || null, matchMethod: m?.method || null };
  });

  const statusTotals = {};
  for (const p of allListings) statusTotals[p.status] = (statusTotals[p.status] || 0) + 1;

  console.log('\n================ RESULTADO ================');
  console.log('Oficina(s):');
  Object.values(offices).forEach(o => console.log(`  ${o.officeName} | ListOfficeId=${o.officeId} | ListOfficeMlsId=${o.officeMlsId} | filtro por ID funciona: ${o.officeIdFilterWorks}`));
  console.log(`\nListados New Era en el feed: ${allListings.length}`, statusTotals);
  console.log('\nAsesores (MLS → sitio):');
  agents.forEach(a => {
    console.log(`  ${a.name.padEnd(30)} MlsId=${String(a.agentMlsId).padEnd(8)} AgentId=${a.agentId} → ${a.siteAgentId || '❌ SIN COINCIDENCIA'} ${a.matchMethod ? '(' + a.matchMethod + ')' : ''} ${JSON.stringify(a.statuses)}`);
  });
  const matched = new Set(agents.map(a => a.siteAgentId).filter(Boolean));
  const withoutListings = siteAgents.filter(a => !matched.has(a.id)).map(a => a.name);
  console.log('\nAsesores del sitio sin listados en el feed (no se pudo obtener su ID MLS):');
  console.log('  ' + (withoutListings.join(', ') || 'ninguno'));

  const outPath = process.argv[2];
  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), offices: Object.values(offices), agents, siteAgentsWithoutMlsId: withoutListings, listings: allListings }, null, 2));
    console.log('\nGuardado en:', outPath);
  }
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
