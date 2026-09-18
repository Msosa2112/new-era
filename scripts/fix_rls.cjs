const { runSql } = require('./supabase_manager.cjs');

async function fixRls() {
  const sql = `
    -- Grant schema usage and permissions to anon and authenticated
    GRANT USAGE ON SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

    -- Alter default privileges for future tables
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

    -- Reset RLS policies for leads
    DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
    CREATE POLICY "Public can submit leads" ON public.leads
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow select for leads" ON public.leads;
    CREATE POLICY "Allow select for leads" ON public.leads
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Reset RLS policies for home_valuations
    DROP POLICY IF EXISTS "Public can submit valuations" ON public.home_valuations;
    CREATE POLICY "Public can submit valuations" ON public.home_valuations
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow select for home_valuations" ON public.home_valuations;
    CREATE POLICY "Allow select for home_valuations" ON public.home_valuations
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Reset RLS policies for agents
    DROP POLICY IF EXISTS "Public can view agents" ON public.agents;
    CREATE POLICY "Public can view agents" ON public.agents
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Reset RLS policies for properties
    DROP POLICY IF EXISTS "Public can view properties" ON public.properties;
    CREATE POLICY "Public can view properties" ON public.properties
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Reset RLS policies for reviews
    DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
    CREATE POLICY "Public can view reviews" ON public.reviews
      FOR SELECT
      TO anon, authenticated
      USING (true);
  `;

  await runSql(sql);
  console.log('RLS policies updated successfully.');
}

if (require.main === module) {
  fixRls().catch(console.error);
}
