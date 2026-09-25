const fs = require('fs');
const path = require('path');
const { runSql } = require('./supabase_manager.cjs');

const simplifiedNames = {
  'yeilen-contreras': 'Yeilen Contreras',
  'yenny-mendoza-molina': 'Yenny Mendoza',
  'dianelis-segrea-castellon': 'Dianelis Segrea',
  'marien-rodriguez-reyes': 'Marien Rodriguez',
  'claudia-aguilera-cuenca': 'Claudia Aguilera',
  'yazbel-diaz': 'Yazbel Diaz',
  'javier-ferrer-rodriguez': 'Javier Ferrer',
  'leidys-herrera': 'Leidys Herrera',
  'dahana-aguila': 'Dahana Aguila',
  'walter-gotay': 'Walter Gotay',
  'karla-fernandez-soto': 'Karla Fernandez',
  'geraldine-santiago-then': 'Geraldine Santiago',
  'lizandra-parra-rodriguez': 'Lizandra Parra',
  'yisel-pupo': 'Yisel Pupo',
  'solanch-rodriguez-curbeira': 'Solanch Rodríguez',
  'albin-machado-campo': 'Albin Machado',
  'ivonne-medina': 'Ivonne Medina',
  'maria-mendez': 'Maria Méndez',
  'rosa-mustelier-jimenez': 'Rosa Mustelier'
};

const agentsTsPath = path.resolve(__dirname, '../src/data/agentsData.ts');
const content = fs.readFileSync(agentsTsPath, 'utf8');
const match = content.match(/export const AGENTS_DATA: Agent\[\] = (\[[\s\S]*?\]);/);
const agents = JSON.parse(match[1]);

for (const agent of agents) {
  if (simplifiedNames[agent.id]) {
    agent.name = simplifiedNames[agent.id];
  }
}

const updatedAgentsTs = `import { Agent, BrokerageInfo } from '../types/property';

export const BROKERAGE_DATA: BrokerageInfo = {
  name: 'New Era Real Estate',
  legalName: 'New Era Real Estate LLC',
  brokerCeo: 'Yeilen Contreras',
  phone: '(502) 500-0409',
  email: 'newerabroker25@gmail.com',
  address: {
    street: '6501 Shepherdsville Road',
    suite: 'Suite 119',
    city: 'Louisville',
    state: 'KY',
    zip: '40219',
    fullFormatted: '6501 Shepherdsville Road, Suite 119, Louisville, KY 40219'
  },
  officeHours: 'Monday - Friday: 9:00 AM - 5:30 PM | Saturday & Sunday: By Appointment',
  licenseNote: 'Licensed Real Estate Brokerage in Kentucky. Equal Housing Opportunity.'
};

export const AGENTS_DATA: Agent[] = ${JSON.stringify(agents, null, 2)};
`;

fs.writeFileSync(agentsTsPath, updatedAgentsTs, 'utf8');
console.log('agentsData.ts updated with simplified names (First Name + First Surname).');

async function syncDb() {
  console.log('Updating Supabase database...');
  for (const agent of agents) {
    const escapedName = agent.name.replace(/'/g, "''");
    await runSql(`UPDATE public.agents SET name = '${escapedName}' WHERE id = '${agent.id}';`);
  }
  const sample = await runSql('SELECT id, name FROM public.agents LIMIT 5;');
  console.log('Sample updated agents in DB:', sample);
}

if (require.main === module) {
  syncDb().catch(console.error);
}
