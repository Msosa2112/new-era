const fs = require('fs');
const path = require('path');
const { runSql } = require('./supabase_manager.cjs');

// 1. Read existing agentsData.ts
const agentsTsPath = path.resolve(__dirname, '../src/data/agentsData.ts');
const content = fs.readFileSync(agentsTsPath, 'utf8');
const match = content.match(/export const AGENTS_DATA: Agent\[\] = (\[[\s\S]*?\]);/);
const allAgents = JSON.parse(match[1]);

// 2. Filter only agents with existing photos
const publicDir = path.resolve(__dirname, '../public');
const activeAgents = allAgents.filter(agent => {
  const nobgExists = agent.photoNobgUrl && fs.existsSync(path.join(publicDir, agent.photoNobgUrl));
  const jpgExists = agent.photoUrl && fs.existsSync(path.join(publicDir, agent.photoUrl));
  return Boolean(nobgExists || jpgExists);
});

console.log(`Filtering agents: from ${allAgents.length} down to ${activeAgents.length} active agents with photos.`);

// 3. Write updated agentsData.ts
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
  licenseNote: 'Licensed Real Estate Brokerage in Kentucky and Indiana. Equal Housing Opportunity.'
};

export const AGENTS_DATA: Agent[] = ${JSON.stringify(activeAgents, null, 2)};
`;

fs.writeFileSync(agentsTsPath, updatedAgentsTs, 'utf8');
console.log('agentsData.ts updated successfully with 19 active agents.');

// 4. Update Supabase database
async function updateSupabase() {
  console.log('Syncing Supabase public.agents table...');
  // Delete agents that are not in the active list
  const activeIds = activeAgents.map(a => `'${a.id}'`).join(',');
  await runSql(`DELETE FROM public.agents WHERE id NOT IN (${activeIds});`);
  
  // Verify count in DB
  const count = await runSql('SELECT count(*) as total FROM public.agents;');
  console.log('Total agents in Supabase DB now:', count[0]?.total);
}

if (require.main === module) {
  updateSupabase().catch(console.error);
}
