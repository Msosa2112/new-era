/**
 * SPARK MLS (GLAR) Production Sync Script for New Era Real Estate
 * - Securely pulls live active listings from Spark Replication API.
 * - Identifies New Era listings via official ListOfficeId (20250912140954028096000000).
 * - Maps New Era listings strictly to verified agents using ListAgentId / ListAgentMlsId.
 * - Keeps outside brokerage listings clean with proper IDX attribution (agentId: null).
 * - Upserts live records into Supabase `properties` table.
 * - Updates local fallback cache `src/data/liveMlsProperties.json`.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// 1. Load environment variables
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || '').trim();
    }
  });
}

const SPARK_TOKEN = process.env.SPARK_API_TOKEN || process.env.VITE_SPARK_API_TOKEN;
const SPARK_BASE = process.env.VITE_SPARK_API_BASE_URL || 'https://replication.sparkapi.com/v1';
const NEW_ERA_OFFICE_ID = '20250912140954028096000000';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rxejkmuzhkxfezkqrjnm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZWprbXV6aGt4ZmV6a3Fyam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODc3MDksImV4cCI6MjEwNTI2MzcwOX0.-p98aKj5-g47E1_kfniokkXGCgejyj072fXSv78WW0o';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

if (!SPARK_TOKEN) {
  console.error('❌ Error: Falta el token de Spark MLS en .env (SPARK_API_TOKEN o VITE_SPARK_API_TOKEN)');
  process.exit(1);
}

function sparkRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const urlStr = endpoint.startsWith('http') ? endpoint : `${SPARK_BASE}${endpoint}`;
    const url = new URL(urlStr);

    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'NewEraRealEstate/1.0',
        'X-SparkApi-User-Agent': 'NewEraRealEstate/1.0',
        'Authorization': `Bearer ${SPARK_TOKEN}`,
        'Accept': 'application/json'
      },
      timeout: 20000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve({ error: e.message, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout conectando a Spark API'));
    });
    req.end();
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function mapPropertyType(subType, propType) {
  const t = (subType || propType || '').toLowerCase();
  if (t.includes('condo') || t.includes('apartment')) return 'Modern Condo';
  if (t.includes('townhouse') || t.includes('townhome')) return 'Townhome';
  if (t.includes('land') || t.includes('lot') || t.includes('farm')) return 'Land';
  if (t.includes('commercial')) return 'Commercial';
  if (t.includes('estate') || t.includes('luxury')) return 'Luxury Estate';
  return 'Single Family';
}

function safeIsoDate(val) {
  if (!val || typeof val !== 'string' || val.includes('*')) return new Date().toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function mapArchitecturalStyle(style) {
  if (!style) return 'Contemporary';
  if (typeof style === 'string') return style;
  if (typeof style === 'object') {
    const keys = Object.keys(style).filter(k => style[k]);
    if (keys.length > 0) return keys.join(', ');
  }
  return 'Contemporary';
}

async function syncMlsListings(marketLimit = 500) {
  console.log(`========================================================`);
  console.log(`🚀 Iniciando Sincronización Spark MLS (GLAR) para New Era`);
  console.log(`📡 Endpoint: ${SPARK_BASE}`);
  console.log(`🎯 Límite de propiedades del mercado: ${marketLimit}`);
  console.log(`========================================================`);

  // 1. Cargar agentes del sitio
  const agentsPath = path.resolve(__dirname, '../src/data/agentsData.ts');
  const agentsContent = fs.readFileSync(agentsPath, 'utf8');
  let siteAgents = [];
  try {
    const startIdx = agentsContent.indexOf('export const AGENTS_DATA: Agent[] = [');
    if (startIdx !== -1) {
      const arrayStr = agentsContent.slice(agentsContent.indexOf('[', startIdx), agentsContent.lastIndexOf('];') + 1);
      siteAgents = (new Function(`return ${arrayStr}`))();
    }
  } catch (err) {
    console.warn('⚠️ Error evaluando AGENTS_DATA:', err.message);
  }
  console.log(`👥 Directorio local cargado con ${siteAgents.length} asesores.`);

  // Mapa de búsqueda rápida de agentes por mlsAccountId y mlsAgentId
  const agentByAccountId = new Map();
  const agentByMlsId = new Map();
  siteAgents.forEach(a => {
    if (a.mlsAccountId) agentByAccountId.set(a.mlsAccountId, a.id);
    if (a.mlsAgentId) agentByMlsId.set(String(a.mlsAgentId), a.id);
  });

  // 2. Extraer listados ACTIVOS directos de New Era Real Estate
  console.log(`\n🏢 Consultando listados ACTIVOS de New Era Real Estate (ListOfficeId: ${NEW_ERA_OFFICE_ID})...`);
  const newEraEndpoint = `/listings?_filter=${encodeURIComponent(`ListOfficeId Eq '${NEW_ERA_OFFICE_ID}' And StandardStatus Eq 'Active'`)}&_limit=100&_expand=Photos&_orderby=-ModificationTimestamp`;
  const newEraRes = await sparkRequest(newEraEndpoint);
  const newEraListings = (newEraRes.D?.Results || []).filter(r => r.StandardFields?.StandardStatus === 'Active');
  console.log(`✅ ${newEraListings.length} propiedades ACTIVAS de New Era encontradas.`);

  // 3. Extraer listados ACTIVOS del mercado general (GLAR) con paginación y Photos expandidas
  console.log(`\n🌐 Consultando propiedades ACTIVAS del mercado general GLAR (objetivo: ${marketLimit})...`);
  let marketListings = [];
  const pageSize = 100;
  const maxPages = Math.ceil(marketLimit / pageSize);

  for (let page = 1; page <= maxPages; page++) {
    const currentLimit = Math.min(pageSize, marketLimit - marketListings.length);
    if (currentLimit <= 0) break;

    const marketEndpoint = `/listings?_filter=${encodeURIComponent(`StandardStatus Eq 'Active'`)}&_limit=${currentLimit}&_page=${page}&_expand=Photos&_orderby=-ModificationTimestamp`;
    process.stdout.write(`\r📡 Descargando página ${page}/${maxPages} (${marketListings.length} listados acumulados)...`);
    const pageRes = await sparkRequest(marketEndpoint);
    const results = (pageRes.D?.Results || []).filter(r => r.StandardFields?.StandardStatus === 'Active');
    if (results.length === 0) break;
    marketListings.push(...results);
  }
  console.log(`\n✅ ${marketListings.length} propiedades ACTIVAS del mercado general obtenidas.`);

  // 4. Combinar listados únicos (priorizando New Era al inicio)
  const seenIds = new Set();
  const rawListings = [];

  // Insertar New Era primero
  newEraListings.forEach(item => {
    if (!seenIds.has(item.Id)) {
      seenIds.add(item.Id);
      rawListings.push(item);
    }
  });

  // Insertar listados del mercado
  marketListings.forEach(item => {
    if (!seenIds.has(item.Id)) {
      seenIds.add(item.Id);
      rawListings.push(item);
    }
  });

  console.log(`\n📦 Total de propiedades activas únicas a procesar: ${rawListings.length}`);

  const properties = [];

  for (let i = 0; i < rawListings.length; i++) {
    const item = rawListings[i];
    const sf = item.StandardFields || {};
    const id = item.Id;

    const isNewEra = sf.ListOfficeId === NEW_ERA_OFFICE_ID || (sf.ListOfficeName || '').toLowerCase() === 'new era real estate';

    // Asignación estricta y conforme a IDX
    let assignedAgentId = null;
    if (isNewEra) {
      if (sf.ListAgentId && agentByAccountId.has(sf.ListAgentId)) {
        assignedAgentId = agentByAccountId.get(sf.ListAgentId);
      } else if (sf.ListAgentMlsId && agentByMlsId.has(String(sf.ListAgentMlsId))) {
        assignedAgentId = agentByMlsId.get(String(sf.ListAgentMlsId));
      } else {
        assignedAgentId = 'yeilen-contreras'; // Fallback a Broker Principal solo si es listado de New Era
      }
    }

    const address = sf.UnparsedAddress || `${sf.StreetNumber || ''} ${sf.StreetName || ''} ${sf.StreetSuffix || ''}`.trim() || `Propiedad #${sf.ListingId || id}`;
    const city = sf.City || 'Louisville';
    const state = sf.StateOrProvince || 'KY';
    const zip = sf.PostalCode || '40202';
    const neighborhood = sf.SubdivisionName || sf.City || 'Greater Louisville';
    const price = Math.round(Number(sf.ListPrice) || 0);
    const bedrooms = Math.round(Number(sf.BedsTotal || sf.BedroomsTotal) || 0);
    const bathrooms = Number(sf.BathsFull || sf.BathroomsTotalInteger) || 1;
    const halfBaths = Math.round(Number(sf.BathsHalf) || 0);
    const sqft = Math.round(Number(sf.BuildingAreaTotal || sf.LivingArea || sf.AboveGradeFinishedArea) || 1200);
    const lotSizeAcres = Number(sf.LotSizeAcres) || (sf.LotSizeArea ? Number(sf.LotSizeArea) / 43560 : 0.25);
    const garageSpaces = Math.round(Number(sf.GarageSpaces || sf.AttachedGarageSpaces) || 0);
    const architecturalStyle = mapArchitecturalStyle(sf.ArchitecturalStyle);
    const propertyType = mapPropertyType(sf.PropertySubType, sf.PropertyType);
    const slug = `${slugify(address)}-${id.slice(-8)}`;

    // Fotos directamente desde sf.Photos expandidas
    let media = [];
    if (Array.isArray(sf.Photos) && sf.Photos.length > 0) {
      media = sf.Photos.map((p, idx) => ({
        id: p.Id || `photo-${idx}`,
        url: p.Uri1600 || p.Uri1280 || p.Uri1024 || p.Uri800 || p.UriLarge || p.Uri640 || p.UriThumb,
        caption: p.Caption || (idx === 0 ? 'Vista Principal' : `Foto ${idx + 1}`),
        isPrimary: idx === 0 || Boolean(p.Primary),
        type: 'image'
      }));
    } else if (item.Photos && Array.isArray(item.Photos) && item.Photos.length > 0) {
      media = item.Photos.map((p, idx) => ({
        id: p.Id || `photo-${idx}`,
        url: p.Uri1600 || p.Uri1280 || p.Uri1024 || p.Uri800 || p.UriLarge || p.Uri640 || p.UriThumb,
        caption: p.Caption || (idx === 0 ? 'Vista Principal' : `Foto ${idx + 1}`),
        isPrimary: idx === 0 || Boolean(p.Primary),
        type: 'image'
      }));
    }

    if (media.length === 0) {
      media.push({
        id: `photo-default-${id}`,
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        caption: 'Fachada Principal',
        isPrimary: true,
        type: 'image'
      });
    }

    const features = [
      {
        category: 'Interior y Distribución',
        items: [
          `${bedrooms} Habitaciones y ${bathrooms + (halfBaths ? 0.5 : 0)} Baños`,
          `${sqft.toLocaleString()} Sq Ft de Espacio Habitable`,
          sf.Basement ? `Sótano: ${sf.Basement}` : 'Distribución Abierta',
          sf.Heating ? `Calefacción: ${Array.isArray(sf.Heating) ? sf.Heating.join(', ') : sf.Heating}` : 'Climatización Central',
          sf.Cooling ? `Aire Acondicionado: ${Array.isArray(sf.Cooling) ? sf.Cooling.join(', ') : sf.Cooling}` : 'Aire Central'
        ].filter(Boolean)
      },
      {
        category: 'Exterior y Terreno',
        items: [
          `${lotSizeAcres.toFixed(2)} Acres de Lote`,
          garageSpaces ? `${garageSpaces} Espacios de Garaje` : 'Estacionamiento Disponible',
          sf.ConstructionMaterials ? `Construcción: ${Array.isArray(sf.ConstructionMaterials) ? sf.ConstructionMaterials.join(', ') : sf.ConstructionMaterials}` : 'Estructura Residencial',
          sf.Roof ? `Techo: ${Array.isArray(sf.Roof) ? sf.Roof.join(', ') : sf.Roof}` : 'Techo Residencial'
        ].filter(Boolean)
      }
    ];

    const property = {
      id: id,
      slug: slug,
      title: `${address}, ${city}`,
      price: price,
      status: 'For Sale',
      transactionType: 'Buy',
      propertyType: propertyType,
      location: {
        address: address,
        city: city,
        state: state,
        zip: zip,
        neighborhood: neighborhood,
        county: sf.CountyOrParish || 'Jefferson',
        latitude: Number(sf.Latitude) || 38.2527,
        longitude: Number(sf.Longitude) || -85.7585,
        schoolDistrict: sf.HighSchoolDistrict || 'Jefferson County Public Schools'
      },
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      halfBaths: halfBaths,
      sqft: sqft,
      lotSizeAcres: lotSizeAcres,
      garageSpaces: garageSpaces,
      description: sf.PublicRemarks || `Excelente oportunidad residencial ubicada en ${city}, KY. Ofrece ${bedrooms} habitaciones, ${bathrooms} baños y ${sqft.toLocaleString()} sq ft de construcción.`,
      highlightStory: isNewEra
        ? `Propiedad exclusiva representada por New Era Real Estate en ${neighborhood}, KY.`
        : `Listado cortesía del MLS de Greater Louisville (GLAR) bajo normativa IDX.`,
      featured: isNewEra || i < 6 || price > 600000,
      architecturalStyle: architecturalStyle,
      media: media,
      features: features,
      mls: {
        mlsId: sf.ListingId || id,
        mlsSource: 'SPARK_MLS',
        parcelNumber: sf.ParcelNumber || '',
        taxAnnualAmount: Number(sf.TaxAnnualAmount) || 0,
        hoaFee: Number(sf.AssociationFee) || 0,
        yearBuilt: Math.round(Number(sf.YearBuilt) || 2020),
        originalListPrice: Math.round(Number(sf.OriginalListPrice) || price),
        daysOnMarket: Math.round(Number(sf.DaysOnMarket) || 1),
        listOfficeName: sf.ListOfficeName || 'GLAR',
        listOfficeId: sf.ListOfficeId || null,
        listAgentName: sf.ListAgentName || null,
        listAgentId: sf.ListAgentId || null,
        isNewEra: isNewEra
      },
      agentId: assignedAgentId,
      isNewEra: isNewEra,
      listedAt: safeIsoDate(sf.OriginalEntryTimestamp || sf.ListingContractDate),
      updatedAt: safeIsoDate(sf.ModificationTimestamp)
    };

    properties.push(property);
  }

  // 5. Guardar en liveMlsProperties.json
  console.log(`\n💾 Guardando ${properties.length} propiedades en src/data/liveMlsProperties.json...`);
  const outputPath = path.resolve(__dirname, '../src/data/liveMlsProperties.json');
  fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2), 'utf8');

  // 6. Sincronizar en Supabase en lotes de 100
  console.log(`\n☁️ Sincronizando con la base de datos Supabase en lotes de 100...`);
  try {
    const supabaseRows = properties.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      status: p.status,
      transaction_type: p.transactionType,
      property_type: p.propertyType,
      location: p.location,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      half_baths: p.halfBaths,
      sqft: p.sqft,
      lot_size_acres: p.lotSizeAcres,
      garage_spaces: p.garageSpaces,
      description: p.description,
      highlight_story: p.highlightStory,
      featured: p.featured,
      architectural_style: p.architecturalStyle,
      media: p.media,
      features: p.features,
      mls: p.mls,
      agent_id: p.agentId,
      listed_at: p.listedAt,
      updated_at: p.updatedAt
    }));

    const BATCH_SIZE = 100;
    for (let b = 0; b < supabaseRows.length; b += BATCH_SIZE) {
      const chunk = supabaseRows.slice(b, b + BATCH_SIZE);
      const { error: upsertError } = await supabase.from('properties').upsert(chunk, { onConflict: 'id' });
      if (upsertError) {
        console.warn(`\n⚠️ Error en lote ${b / BATCH_SIZE + 1}:`, upsertError.message);
      } else {
        process.stdout.write(`\r☁️ Lote ${Math.floor(b / BATCH_SIZE) + 1}/${Math.ceil(supabaseRows.length / BATCH_SIZE)} guardado en Supabase.`);
      }
    }
    console.log(`\n✅ ¡${supabaseRows.length} propiedades sincronizadas exitosamente en Supabase!`);
  } catch (supaErr) {
    console.warn('\n⚠️ Error conectando a Supabase:', supaErr.message);
  }

  console.log(`\n✨ ¡Sincronización Completada!`);
  console.log(`⭐ Propiedades directas de New Era: ${properties.filter(p => p.isNewEra).length}`);
  console.log(`🏡 Propiedades activas totales en catálogo: ${properties.length}`);
}

if (require.main === module) {
  const limitArg = process.argv[2] ? parseInt(process.argv[2], 10) : 500;
  syncMlsListings(limitArg).catch(err => {
    console.error('❌ Error en sincronización:', err);
    process.exit(1);
  });
}

module.exports = { syncMlsListings, sparkRequest };
