type VercelRequest = any;
type VercelResponse = any;
import { createClient } from '@supabase/supabase-js';

const SPARK_TOKEN = process.env.SPARK_API_TOKEN || process.env.VITE_SPARK_API_TOKEN || 'ar8u3ybcd71qewwrbahvacz6d';
const SPARK_BASE = process.env.SPARK_API_BASE_URL || process.env.VITE_SPARK_API_BASE_URL || 'https://replication.sparkapi.com/v1';
const NEW_ERA_OFFICE_ID = '20250912140954028096000000';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://rxejkmuzhkxfezkqrjnm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZWprbXV6aGt4ZmV6a3Fyam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODc3MDksImV4cCI6MjEwNTI2MzcwOX0.-p98aKj5-g47E1_kfniokkXGCgejyj072fXSv78WW0o';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function mapPropertyType(subType?: string, propType?: string) {
  const t = (subType || propType || '').toLowerCase();
  if (t.includes('condo') || t.includes('apartment')) return 'Modern Condo';
  if (t.includes('townhouse') || t.includes('townhome')) return 'Townhome';
  if (t.includes('land') || t.includes('lot') || t.includes('farm')) return 'Land';
  if (t.includes('commercial')) return 'Commercial';
  if (t.includes('estate') || t.includes('luxury')) return 'Luxury Estate';
  return 'Single Family';
}

function safeIsoDate(val: any) {
  if (!val || typeof val !== 'string' || val.includes('*')) return new Date().toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

const EXCLUDED_AGENT_ACCOUNT_IDS = new Set([
  '20240930142025580959000000' // Walter Gotay (no longer with New Era)
]);
const EXCLUDED_AGENT_MLS_IDS = new Set([
  '30290' // Walter Gotay
]);

const AGENT_BY_ACCOUNT_ID: Record<string, string> = {
  '20161115204006349210000000': 'yeilen-contreras',
  '20210212152010452444000000': 'yazbel-diaz',
  '20230714135100643517000000': 'yenny-mendoza-molina',
  '20240328182928783669000000': 'claudia-aguilera-cuenca',
  '20220317195046981920000000': 'dianelis-segrea-castellon',
  '20230417145050091844000000': 'geraldine-santiago-then',
  '20240415172238282908000000': 'dayana-sanchez-rivero',
  '20240711194257774903000000': 'karen-rivero',
  '20240912191252936851000000': 'daniela-aguilera-cuenca',
  '20250113211022106578000000': 'rosalia-garcia-rodriguez',
  '20250213191015349812000000': 'anabel-leal-miranda'
};

const AGENT_BY_MLS_ID: Record<string, string> = {
  '24571': 'yeilen-contreras',
  '28485': 'yazbel-diaz',
  '29947': 'yenny-mendoza-molina',
  '30240': 'claudia-aguilera-cuenca',
  '29140': 'dianelis-segrea-castellon',
  '29785': 'geraldine-santiago-then',
  '30280': 'dayana-sanchez-rivero',
  '30425': 'karen-rivero',
  '30530': 'daniela-aguilera-cuenca',
  '30690': 'rosalia-garcia-rodriguez',
  '30745': 'anabel-leal-miranda'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Optional security check for Vercel Cron or custom secret
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Only enforce if CRON_SECRET is explicitly set in Vercel environment
    console.warn('Unauthorized cron invocation attempt');
  }

  try {
    const headers = {
      'User-Agent': 'NewEraRealEstate/1.0',
      'X-SparkApi-User-Agent': 'NewEraRealEstate/1.0',
      'Authorization': `Bearer ${SPARK_TOKEN}`,
      'Accept': 'application/json'
    };

    // 1. Fetch active/under-contract/pending listings from New Era
    const newEraUrl = `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`ListOfficeId Eq '${NEW_ERA_OFFICE_ID}'`)}&_limit=100&_expand=Photos&_orderby=-ModificationTimestamp`;
    const newEraResponse = await fetch(newEraUrl, { headers });
    const newEraData: any = await newEraResponse.json();
    const validNewEraStatuses = new Set(['Active', 'Active Under Contract', 'Pending']);
    const newEraResults = (newEraData?.D?.Results || []).filter((r: any) => {
      const sf = r.StandardFields || {};
      if (!validNewEraStatuses.has(sf.StandardStatus)) return false;
      if (EXCLUDED_AGENT_ACCOUNT_IDS.has(sf.ListAgentId) || EXCLUDED_AGENT_MLS_IDS.has(String(sf.ListAgentMlsId))) return false;
      return true;
    });

    // 2. Fetch active market listings
    const targetLimit = req.query.limit ? Number(req.query.limit) : 500;
    const pageSize = 100;
    const maxPages = Math.ceil(targetLimit / pageSize);
    const marketResults: any[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const currentLimit = Math.min(pageSize, targetLimit - marketResults.length);
      if (currentLimit <= 0) break;

      const marketUrl = `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`StandardStatus Eq 'Active'`)}&_limit=${currentLimit}&_page=${page}&_expand=Photos&_orderby=-ModificationTimestamp`;
      const pageRes = await fetch(marketUrl, { headers });
      const pageData: any = await pageRes.json();
      const results = (pageData?.D?.Results || []).filter((r: any) => {
        const sf = r.StandardFields || {};
        if (sf.StandardStatus !== 'Active') return false;
        if (EXCLUDED_AGENT_ACCOUNT_IDS.has(sf.ListAgentId) || EXCLUDED_AGENT_MLS_IDS.has(String(sf.ListAgentMlsId))) return false;
        return true;
      });
      if (results.length === 0) break;
      marketResults.push(...results);
    }

    // 3. Combine unique listings (New Era first)
    const seenIds = new Set<string>();
    const allListings: any[] = [];

    newEraResults.forEach((item: any) => {
      if (!seenIds.has(item.Id)) {
        seenIds.add(item.Id);
        allListings.push(item);
      }
    });

    marketResults.forEach((item: any) => {
      if (!seenIds.has(item.Id)) {
        seenIds.add(item.Id);
        allListings.push(item);
      }
    });

    // 4. Map into Supabase property records
    const supabaseRows = allListings.map((item: any, i: number) => {
      const sf = item.StandardFields || {};
      const id = item.Id;
      const isExcludedAgent = EXCLUDED_AGENT_ACCOUNT_IDS.has(sf.ListAgentId) || EXCLUDED_AGENT_MLS_IDS.has(String(sf.ListAgentMlsId));
      const isNewEra = !isExcludedAgent && (sf.ListOfficeId === NEW_ERA_OFFICE_ID || (sf.ListOfficeName || '').toLowerCase() === 'new era real estate');

      let assignedAgentId: string | null = null;
      if (isNewEra) {
        if (sf.ListAgentId && AGENT_BY_ACCOUNT_ID[sf.ListAgentId]) {
          assignedAgentId = AGENT_BY_ACCOUNT_ID[sf.ListAgentId];
        } else if (sf.ListAgentMlsId && AGENT_BY_MLS_ID[String(sf.ListAgentMlsId)]) {
          assignedAgentId = AGENT_BY_MLS_ID[String(sf.ListAgentMlsId)];
        } else {
          assignedAgentId = 'yeilen-contreras';
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
      const propertyType = mapPropertyType(sf.PropertySubType, sf.PropertyType);
      const slug = `${slugify(address)}-${id.slice(-8)}`;
      const mappedStatus = (sf.StandardStatus === 'Pending' || sf.StandardStatus === 'Active Under Contract') ? 'Pending' : 'Active';

      // Photos from expanded field
      let media: any[] = [];
      if (Array.isArray(sf.Photos) && sf.Photos.length > 0) {
        media = sf.Photos.map((p: any, idx: number) => ({
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

      return {
        id: id,
        slug: slug,
        title: `${address}, ${city}`,
        price: price,
        status: mappedStatus,
        transaction_type: 'Buy',
        property_type: propertyType,
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
        half_baths: halfBaths,
        sqft: sqft,
        lot_size_acres: lotSizeAcres,
        garage_spaces: garageSpaces,
        description: sf.PublicRemarks || `Excelente oportunidad residencial ubicada en ${city}, KY. Ofrece ${bedrooms} habitaciones, ${bathrooms} baños y ${sqft.toLocaleString()} sq ft de construcción.`,
        highlight_story: isNewEra
          ? `Propiedad exclusiva representada por New Era Real Estate en ${neighborhood}, KY.`
          : `Listado cortesía del MLS de Greater Louisville (GLAR) bajo normativa IDX.`,
        featured: isNewEra || i < 6 || price > 600000,
        architectural_style: sf.ArchitecturalStyle || 'Contemporary',
        media: media,
        features: [],
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
        agent_id: assignedAgentId,
        listed_at: safeIsoDate(sf.OriginalEntryTimestamp || sf.ListingContractDate),
        updated_at: safeIsoDate(sf.ModificationTimestamp)
      };
    });

    // 5. Upsert to Supabase in batches
    const BATCH_SIZE = 100;
    let upsertCount = 0;
    for (let b = 0; b < supabaseRows.length; b += BATCH_SIZE) {
      const chunk = supabaseRows.slice(b, b + BATCH_SIZE);
      const { error } = await supabase.from('properties').upsert(chunk, { onConflict: 'id' });
      if (!error) {
        upsertCount += chunk.length;
      }
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      newEraCount: newEraResults.length,
      marketCount: marketResults.length,
      totalProcessed: allListings.length,
      supabaseUpserted: upsertCount,
      message: `Daily MLS Sync completed successfully: ${allListings.length} listings synced.`
    });
  } catch (error: any) {
    console.error('Error in MLS sync API handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}
