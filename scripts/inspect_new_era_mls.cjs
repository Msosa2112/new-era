const https = require('https');

const SPARK_TOKEN = 'ar8u3ybcd71qewwrbahvacz6d';

function sparkFetch(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'replication.sparkapi.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'NewEraRealEstate/1.0',
        'Authorization': 'Bearer ' + SPARK_TOKEN,
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve({ error: e.message, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('Consultando feed de Spark MLS / GLAR para New Era Real Estate...\n');

  // 1. Listings activos
  const activeRes = await sparkFetch('/v1/listings?_filter=ListOfficeName%20Eq%20%27New%20Era%20Real%20Estate%27%20And%20StandardStatus%20Eq%20%27Active%27&_limit=250&_pagination=count');
  const activeListings = activeRes.D?.Results || [];

  // 2. Todos los listados de la oficina
  const allRes = await sparkFetch('/v1/listings?_filter=ListOfficeName%20Eq%20%27New%20Era%20Real%20Estate%27&_limit=250&_pagination=count');
  const allListings = allRes.D?.Results || [];

  console.log('=====================================================');
  console.log('📊 RESUMEN GENERAL DE NEW ERA REAL ESTATE EN EL MLS');
  console.log('=====================================================');
  console.log(`• Total de registros en feed de oficina: ${allListings.length}`);
  console.log(`• Propiedades con estatus ACTIVO: ${activeListings.length}`);

  const statusCounts = {};
  allListings.forEach(item => {
    const s = item.StandardFields?.StandardStatus || 'Sin Estatus';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  console.log('\nDesglose por Estatus:');
  Object.entries(statusCounts).forEach(([k, v]) => {
    console.log(`  - ${k}: ${v}`);
  });

  // Agentes
  const agentsMap = {};
  allListings.forEach(item => {
    const sf = item.StandardFields || {};
    const name = sf.ListAgentName || `${sf.ListAgentFirstName || ''} ${sf.ListAgentLastName || ''}`.trim() || 'Sin Nombre Asignado';
    const email = sf.ListAgentEmail || 'N/A';
    const phone = sf.ListAgentCellPhone || sf.ListAgentDirectPhone || sf.ListAgentOfficePhone || 'N/A';
    const status = sf.StandardStatus || 'Active';
    const price = sf.ListPrice || 0;
    const addr = sf.UnparsedAddress || `${sf.StreetNumber || ''} ${sf.StreetName || ''} ${sf.StreetSuffix || ''}`.trim();
    const city = sf.City || 'Louisville';

    if (!agentsMap[name]) {
      agentsMap[name] = {
        name,
        email,
        phone,
        active: [],
        pending: [],
        closed: [],
        other: [],
        totalValue: 0
      };
    }

    const propSummary = {
      id: item.Id,
      mlsId: sf.ListingId,
      address: addr,
      city: city,
      price: price,
      status: status,
      beds: sf.BedsTotal || sf.BedroomsTotal || 0,
      baths: sf.BathsTotal || sf.BathroomsTotalInteger || 0,
      sqft: sf.BuildingAreaTotal || sf.LivingArea || 0
    };

    if (status === 'Active') {
      agentsMap[name].active.push(propSummary);
    } else if (status === 'Pending') {
      agentsMap[name].pending.push(propSummary);
    } else if (status === 'Closed' || status === 'Sold') {
      agentsMap[name].closed.push(propSummary);
    } else {
      agentsMap[name].other.push(propSummary);
    }
    agentsMap[name].totalValue += price;
  });

  console.log('\n=====================================================');
  console.log('👥 AGENTES DE NEW ERA REAL ESTATE Y SU CARTERA');
  console.log('=====================================================');

  Object.values(agentsMap).forEach((agent, i) => {
    console.log(`\n[${i + 1}] Agente: ${agent.name}`);
    console.log(`    Contacto: ${agent.email} | Tel: ${agent.phone}`);
    console.log(`    Activas: ${agent.active.length} | Pendientes: ${agent.pending.length} | Cerradas/Otras: ${agent.closed.length + agent.other.length}`);
    if (agent.active.length > 0) {
      console.log('    Listados Activos:');
      agent.active.forEach(p => {
        console.log(`      * $${p.price.toLocaleString()} - ${p.address}, ${p.city} (${p.beds} hab, ${p.baths} ba, ${p.sqft} sqft) [MLS #${p.mlsId || p.id}]`);
      });
    }
    if (agent.pending.length > 0) {
      console.log('    Listados Pendientes:');
      agent.pending.forEach(p => {
        console.log(`      * [PENDING] $${p.price.toLocaleString()} - ${p.address}, ${p.city} [MLS #${p.mlsId || p.id}]`);
      });
    }
  });

})();
