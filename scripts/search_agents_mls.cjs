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

const agentsList = [
  { first: 'Yeilen', last: 'Contreras' },
  { first: 'Yenny', last: 'Mendoza' },
  { first: 'Yusleivy', last: 'Lozada' },
  { first: 'Dayana', last: 'Perez' },
  { first: 'Dayron', last: 'Herrera' },
  { first: 'Alena', last: 'Hernandez' },
  { first: 'Yaimaris', last: 'Calzadilla' },
  { first: 'Lilian', last: 'Guerra' },
  { first: 'Yuriel', last: 'Perez' },
  { first: 'Claudia', last: 'Mendez' },
  { first: 'Darel', last: 'Alvarez' },
  { first: 'Ernesto', last: 'Diaz' },
  { first: 'Gleysi', last: 'Perez' },
  { first: 'Laura', last: 'Alvarez' },
  { first: 'Manuel', last: 'Herrera' },
  { first: 'Mayara', last: 'Alvarez' },
  { first: 'Olenka', last: 'Pena' },
  { first: 'Orlando', last: 'Rodriguez' },
  { first: 'Rosario', last: 'Rivero' }
];

async function run() {
  console.log('--- Buscando agentes en Spark MLS (GLAR) ---\n');

  for (const ag of agentsList) {
    const filter = `ListAgentLastName Eq '${ag.last}'`;
    const res = await sparkFetch(`/v1/listings?_filter=${encodeURIComponent(filter)}&_limit=20&_pagination=count`);
    const results = res.D?.Results || [];
    if (results.length > 0) {
      console.log(`✅ [COINCIDENCIA] ${ag.first} ${ag.last}: ${results.length} propiedades encontradas.`);
      results.forEach(r => {
        const sf = r.StandardFields || {};
        console.log(`   - ${sf.StandardStatus || 'N/A'} | $${sf.ListPrice?.toLocaleString()} | ${sf.UnparsedAddress} | Agente: ${sf.ListAgentName} | Oficina: ${sf.ListOfficeName}`);
      });
    } else {
      // Check first name if last name had variations
      const filterFirst = `ListAgentFirstName Eq '${ag.first}'`;
      const resFirst = await sparkFetch(`/v1/listings?_filter=${encodeURIComponent(filterFirst)}&_limit=20&_pagination=count`);
      const resultsFirst = resFirst.D?.Results || [];
      if (resultsFirst.length > 0) {
        console.log(`✅ [COINCIDENCIA NOMBRE] ${ag.first} ${ag.last}: ${resultsFirst.length} propiedades.`);
        resultsFirst.forEach(r => {
          const sf = r.StandardFields || {};
          console.log(`   - ${sf.StandardStatus || 'N/A'} | $${sf.ListPrice?.toLocaleString()} | ${sf.UnparsedAddress} | Agente: ${sf.ListAgentName} | Oficina: ${sf.ListOfficeName}`);
        });
      }
    }
  }

  console.log('\n--- Búsqueda finalizada ---');
}

run().catch(console.error);
