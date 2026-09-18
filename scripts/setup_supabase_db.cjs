const { runSql } = require('./supabase_manager.cjs');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('--- Step 1: Creating database schema ---');

  const schemaSql = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- AGENTS TABLE
    CREATE TABLE IF NOT EXISTS public.agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      license_number TEXT,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      photo_url TEXT,
      photo_nobg_url TEXT,
      bio TEXT,
      specialties JSONB DEFAULT '[]'::jsonb,
      languages JSONB DEFAULT '["English", "Spanish"]'::jsonb,
      active_listings_count INT DEFAULT 0,
      years_experience INT DEFAULT 1,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- PROPERTIES TABLE
    CREATE TABLE IF NOT EXISTS public.properties (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      price NUMERIC NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      transaction_type TEXT NOT NULL DEFAULT 'Buy',
      property_type TEXT NOT NULL DEFAULT 'Single Family',
      location JSONB NOT NULL,
      bedrooms INT NOT NULL DEFAULT 0,
      bathrooms NUMERIC NOT NULL DEFAULT 0,
      half_baths INT DEFAULT 0,
      sqft INT NOT NULL DEFAULT 0,
      lot_size_acres NUMERIC,
      garage_spaces INT DEFAULT 0,
      description TEXT,
      highlight_story TEXT,
      featured BOOLEAN DEFAULT false,
      architectural_style TEXT,
      media JSONB DEFAULT '[]'::jsonb,
      features JSONB DEFAULT '[]'::jsonb,
      mls JSONB DEFAULT '{}'::jsonb,
      agent_id TEXT REFERENCES public.agents(id) ON DELETE SET NULL,
      listed_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- LEADS / CONTACT SUBMISSIONS TABLE
    CREATE TABLE IF NOT EXISTS public.leads (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      type TEXT NOT NULL DEFAULT 'general', -- 'general', 'tour', 'valuation', 'agent_inquiry', 'offer'
      property_id TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
      agent_id TEXT REFERENCES public.agents(id) ON DELETE SET NULL,
      message TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'archived'
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- HOME VALUATIONS TABLE
    CREATE TABLE IF NOT EXISTS public.home_valuations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      address TEXT NOT NULL,
      bedrooms INT,
      bathrooms NUMERIC,
      sqft INT,
      condition TEXT,
      timeline TEXT,
      owner_name TEXT NOT NULL,
      owner_email TEXT NOT NULL,
      owner_phone TEXT,
      estimated_value_min NUMERIC,
      estimated_value_max NUMERIC,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- REVIEWS / TESTIMONIALS TABLE
    CREATE TABLE IF NOT EXISTS public.reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_name TEXT NOT NULL,
      role TEXT,
      content TEXT NOT NULL,
      rating INT DEFAULT 5,
      property_type TEXT,
      agent_id TEXT REFERENCES public.agents(id) ON DELETE SET NULL,
      featured BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable Row Level Security (RLS)
    ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.home_valuations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any to prevent conflicts
    DROP POLICY IF EXISTS "Public can view agents" ON public.agents;
    DROP POLICY IF EXISTS "Public can view properties" ON public.properties;
    DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
    DROP POLICY IF EXISTS "Public can submit valuations" ON public.home_valuations;

    -- Create RLS Policies
    CREATE POLICY "Public can view agents" ON public.agents FOR SELECT USING (true);
    CREATE POLICY "Public can view properties" ON public.properties FOR SELECT USING (true);
    CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
    CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public can submit valuations" ON public.home_valuations FOR INSERT WITH CHECK (true);
  `;

  await runSql(schemaSql);
  console.log('Schema created successfully with RLS policies.');

  console.log('--- Step 2: Seeding Agents ---');
  // Read agents from agentsData.ts
  const agentsTsPath = path.resolve(__dirname, '../src/data/agentsData.ts');
  const agentsContent = fs.readFileSync(agentsTsPath, 'utf8');
  
  // Extract JSON array from AGENTS_DATA = [...]
  const agentsMatch = agentsContent.match(/export const AGENTS_DATA: Agent\[\] = (\[[\s\S]*?\]);/);
  if (agentsMatch) {
    const agents = JSON.parse(agentsMatch[1]);
    console.log(`Found ${agents.length} agents to insert.`);

    for (const agent of agents) {
      const insertAgentSql = `
        INSERT INTO public.agents (
          id, name, title, license_number, phone, email, photo_url, photo_nobg_url, 
          bio, specialties, languages, active_listings_count, years_experience, featured
        ) VALUES (
          ${escapeSql(agent.id)},
          ${escapeSql(agent.name)},
          ${escapeSql(agent.title)},
          ${escapeSql(agent.licenseNumber || null)},
          ${escapeSql(agent.phone)},
          ${escapeSql(agent.email)},
          ${escapeSql(agent.photoUrl || null)},
          ${escapeSql(agent.photoNobgUrl || null)},
          ${escapeSql(agent.bio || '')},
          '${JSON.stringify(agent.specialties || [])}'::jsonb,
          '${JSON.stringify(agent.languages || ["English", "Spanish"])}'::jsonb,
          ${agent.activeListingsCount || 0},
          ${agent.yearsExperience || 1},
          ${agent.featured ? 'true' : 'false'}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          title = EXCLUDED.title,
          license_number = EXCLUDED.license_number,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          photo_url = EXCLUDED.photo_url,
          photo_nobg_url = EXCLUDED.photo_nobg_url,
          bio = EXCLUDED.bio,
          specialties = EXCLUDED.specialties,
          languages = EXCLUDED.languages,
          active_listings_count = EXCLUDED.active_listings_count,
          years_experience = EXCLUDED.years_experience,
          featured = EXCLUDED.featured,
          updated_at = NOW();
      `;
      await runSql(insertAgentSql);
    }
    console.log('All agents seeded successfully.');
  }

  console.log('--- Step 3: Seeding Mock Properties ---');
  const mockPropTsPath = path.resolve(__dirname, '../src/data/mockProperties.ts');
  const propContent = fs.readFileSync(mockPropTsPath, 'utf8');
  
  // Extract MOCK_PROPERTIES
  const propMatch = propContent.match(/export const MOCK_PROPERTIES: Property\[\] = (\[[\s\S]*?\]);\s*$/);
  if (propMatch) {
    // Evaluation via safe Function or JSON
    let properties = [];
    try {
      properties = eval(propMatch[1]);
    } catch (e) {
      console.error('Error parsing mock properties:', e);
    }

    console.log(`Found ${properties.length} properties to insert.`);
    for (const prop of properties) {
      const insertPropSql = `
        INSERT INTO public.properties (
          id, slug, title, price, status, transaction_type, property_type,
          location, bedrooms, bathrooms, half_baths, sqft, lot_size_acres,
          garage_spaces, description, highlight_story, featured, architectural_style,
          media, features, mls, agent_id, listed_at
        ) VALUES (
          ${escapeSql(prop.id)},
          ${escapeSql(prop.slug)},
          ${escapeSql(prop.title)},
          ${prop.price},
          ${escapeSql(prop.status)},
          ${escapeSql(prop.transactionType || 'Buy')},
          ${escapeSql(prop.propertyType)},
          '${JSON.stringify(prop.location)}'::jsonb,
          ${prop.bedrooms || 0},
          ${prop.bathrooms || 0},
          ${prop.halfBaths || 0},
          ${prop.sqft || 0},
          ${prop.lotSizeAcres || 'NULL'},
          ${prop.garageSpaces || 0},
          ${escapeSql(prop.description || '')},
          ${escapeSql(prop.highlightStory || '')},
          ${prop.featured ? 'true' : 'false'},
          ${escapeSql(prop.architecturalStyle || '')},
          '${JSON.stringify(prop.media || [])}'::jsonb,
          '${JSON.stringify(prop.features || [])}'::jsonb,
          '${JSON.stringify(prop.mls || {})}'::jsonb,
          ${prop.agentId ? escapeSql(prop.agentId) : 'NULL'},
          ${escapeSql(prop.listedAt || new Date().toISOString())}
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          status = EXCLUDED.status,
          transaction_type = EXCLUDED.transaction_type,
          property_type = EXCLUDED.property_type,
          location = EXCLUDED.location,
          bedrooms = EXCLUDED.bedrooms,
          bathrooms = EXCLUDED.bathrooms,
          half_baths = EXCLUDED.half_baths,
          sqft = EXCLUDED.sqft,
          lot_size_acres = EXCLUDED.lot_size_acres,
          garage_spaces = EXCLUDED.garage_spaces,
          description = EXCLUDED.description,
          highlight_story = EXCLUDED.highlight_story,
          featured = EXCLUDED.featured,
          architectural_style = EXCLUDED.architectural_style,
          media = EXCLUDED.media,
          features = EXCLUDED.features,
          mls = EXCLUDED.mls,
          agent_id = EXCLUDED.agent_id,
          updated_at = NOW();
      `;
      await runSql(insertPropSql);
    }
    console.log('All properties seeded successfully.');
  }

  console.log('--- Step 4: Verification ---');
  const agentCount = await runSql('SELECT COUNT(*) as count FROM public.agents;');
  const propCount = await runSql('SELECT COUNT(*) as count FROM public.properties;');
  console.log('Agents in DB:', agentCount[0]?.count);
  console.log('Properties in DB:', propCount[0]?.count);
  console.log('--- SUPABASE DATABASE SETUP COMPLETE ---');
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

if (require.main === module) {
  setupDatabase().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
  });
}
