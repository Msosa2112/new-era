import { createClient } from '@supabase/supabase-js';
import { Agent, Property } from '../types/property';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rxejkmuzhkxfezkqrjnm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZWprbXV6aGt4ZmV6a3Fyam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODc3MDksImV4cCI6MjEwNTI2MzcwOX0.-p98aKj5-g47E1_kfniokkXGCgejyj072fXSv78WW0o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const recentSubmissions = new Map<string, number>();

/**
 * Detects random bot-generated gibberish strings (e.g., "Sktvau Uhaxb", "Cdfiogi Gxaqtv", "Fjqakznpv")
 * while allowing all legitimate Spanish and English names and addresses.
 */
export function isGibberishText(str: string): boolean {
  if (!str) return false;
  const words = str
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/g, ''))
    .filter((w) => w.length >= 3);
  if (words.length === 0) return false;

  const badPairs =
    /(gx|xg|xz|zx|zs|sz|kq|qk|vq|qv|jq|qj|wx|xw|qz|zq|vx|xv|jx|xj|fx|xf|bx|xb|cx|xc|dx|xd|px|xp|tx|mx|xm|nx|xn|lx|rx|xr|sx|ktv|dfi|kdct|dkeb|sqlc|mfrr|begy|chnd|uodn|rnwg|cfov|khva|efny|rkad|wykn)/i;

  for (const w of words) {
    if (badPairs.test(w)) return true;

    const norm = w
      .toLowerCase()
      .replace(/(sch|chr|str|thr|shr|spl|spr|scr|ph|th|sh|ch|wh|ck|ng|qu|ll|rr)/g, 'c');

    const vowels = (norm.match(/[aeiouáéíóúüAEIOUÁÉÍÓÚÜyY]/g) || []).length;
    if (norm.length >= 4 && vowels === 0) return true;
    if (norm.length >= 7 && vowels / norm.length < 0.2) return true;
    if (/[^aeiouáéíóúüAEIOUÁÉÍÓÚÜyY]{4,}/i.test(norm)) return true;
  }
  return false;
}

/**
 * Comprehensive client & server bot detector
 */
export function isSpamLead(payload: {
  name?: string;
  email?: string;
  message?: string;
  address?: string;
  type?: string;
  honeypot?: string;
  elapsedMs?: number;
}): boolean {
  if (payload.honeypot && payload.honeypot.trim() !== '') return true;
  if (typeof payload.elapsedMs === 'number' && payload.elapsedMs >= 0 && payload.elapsedMs < 1500) {
    return true;
  }

  const cleanEmail = (payload.email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) return true;

  const [localPart, domain] = cleanEmail.split('@');
  if (localPart && (domain === 'gmail.com' || domain === 'googlemail.com')) {
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 3) return true;
  }

  const cleanMsg = (payload.message || '').trim();
  if (cleanMsg && /^\d{5,20}$/.test(cleanMsg)) return true;

  const cleanAddr = (payload.address || '').trim();
  if (payload.type === 'valuation' || cleanAddr) {
    if (cleanAddr && (!cleanAddr.includes(' ') || !/\d/.test(cleanAddr) || isGibberishText(cleanAddr))) {
      return true;
    }
  }

  const cleanName = (payload.name || '').trim();
  if (cleanName && cleanName !== 'Website Visitor' && cleanName !== 'Cliente Web') {
    if (isGibberishText(cleanName)) return true;
  }

  return false;
}

/**
 * Lead / Inquire submission interface
 */
export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  type: 'general' | 'tour' | 'valuation' | 'agent_inquiry' | 'offer';
  propertyId?: string;
  agentId?: string;
  message?: string;
  metadata?: Record<string, any>;
  honeypot?: string;
  elapsedMs?: number;
}

/**
 * Submit lead or contact message
 */
export async function submitLead(lead: LeadSubmission) {
  try {
    if (
      isSpamLead({
        name: lead.name,
        email: lead.email,
        message: lead.message,
        type: lead.type,
        honeypot: lead.honeypot,
        elapsedMs: lead.elapsedMs
      })
    ) {
      return { success: true, filtered: true };
    }

    const dedupeKey = `lead:${lead.email.toLowerCase().trim()}:${lead.type}`;
    const lastSent = recentSubmissions.get(dedupeKey) || 0;
    if (Date.now() - lastSent < 30000) {
      return { success: true, deduplicated: true };
    }
    recentSubmissions.set(dedupeKey, Date.now());

    // Trigger email notification via Resend asynchronously in background
    import('../services/emailService').then(({ triggerLeadEmailNotification }) => {
      triggerLeadEmailNotification({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        type: lead.type,
        propertyId: lead.propertyId,
        agentId: lead.agentId,
        message: lead.message,
        metadata: lead.metadata
      }).catch((err) => console.warn('Resend notification trigger caught:', err));
    }).catch(() => {});

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: lead.name,
          email: lead.email,
          phone: lead.phone || null,
          type: lead.type,
          property_id: lead.propertyId || null,
          agent_id: lead.agentId || null,
          message: lead.message || null,
          metadata: lead.metadata || {}
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase lead submission error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Network / client error submitting lead:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Submit instant home valuation request
 */
export interface HomeValuationSubmission {
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  condition?: string;
  timeline?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  notes?: string;
  honeypot?: string;
  elapsedMs?: number;
}

export async function submitHomeValuation(val: HomeValuationSubmission) {
  try {
    if (
      isSpamLead({
        name: val.ownerName,
        email: val.ownerEmail,
        address: val.address,
        message: val.notes,
        type: 'valuation',
        honeypot: val.honeypot,
        elapsedMs: val.elapsedMs
      })
    ) {
      return { success: true, filtered: true };
    }

    const dedupeKey = `val:${val.ownerEmail.toLowerCase().trim()}:${val.address.toLowerCase().trim()}`;
    const lastSent = recentSubmissions.get(dedupeKey) || 0;
    if (Date.now() - lastSent < 30000) {
      return { success: true, deduplicated: true };
    }
    recentSubmissions.set(dedupeKey, Date.now());

    // Trigger email notification via Resend asynchronously in background
    import('../services/emailService').then(({ triggerLeadEmailNotification }) => {
      triggerLeadEmailNotification({
        name: val.ownerName,
        email: val.ownerEmail,
        phone: val.ownerPhone,
        type: 'valuation',
        address: val.address,
        message: val.notes || `Condition: ${val.condition || 'N/A'}, Timeline: ${val.timeline || 'N/A'}`,
        metadata: {
          bedrooms: val.bedrooms,
          bathrooms: val.bathrooms,
          sqft: val.sqft,
          condition: val.condition,
          timeline: val.timeline
        }
      }).catch((err) => console.warn('Resend valuation trigger caught:', err));
    }).catch(() => {});

    const { data, error } = await supabase
      .from('home_valuations')
      .insert([
        {
          address: val.address,
          bedrooms: val.bedrooms || null,
          bathrooms: val.bathrooms || null,
          sqft: val.sqft || null,
          condition: val.condition || null,
          timeline: val.timeline || null,
          owner_name: val.ownerName,
          owner_email: val.ownerEmail,
          owner_phone: val.ownerPhone || null,
          estimated_value_min: val.estimatedValueMin || null,
          estimated_value_max: val.estimatedValueMax || null,
          notes: val.notes || null
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase valuation submission error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Network / client error submitting valuation:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Fetch all agents from Supabase
 */
export async function fetchSupabaseAgents(): Promise<Agent[] | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('featured', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      title: row.title,
      licenseNumber: row.license_number,
      phone: row.phone,
      email: row.email,
      photoUrl: row.photo_url,
      photoNobgUrl: row.photo_nobg_url,
      bio: row.bio,
      specialties: row.specialties || [],
      languages: row.languages || ['English', 'Spanish'],
      activeListingsCount: row.active_listings_count,
      yearsExperience: row.years_experience,
      featured: row.featured
    }));
  } catch (err) {
    console.warn('Error fetching agents from Supabase:', err);
    return null;
  }
}

/**
 * Fetch all properties from Supabase
 */
export async function fetchSupabaseProperties(): Promise<Property[] | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('featured', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      price: Number(row.price),
      status: row.status,
      transactionType: row.transaction_type,
      propertyType: row.property_type,
      location: row.location,
      bedrooms: row.bedrooms,
      bathrooms: Number(row.bathrooms),
      halfBaths: row.half_baths || 0,
      sqft: row.sqft,
      lotSizeAcres: Number(row.lot_size_acres) || 0,
      garageSpaces: row.garage_spaces || 0,
      description: row.description || '',
      highlightStory: row.highlight_story || '',
      featured: Boolean(row.featured),
      architecturalStyle: row.architectural_style || '',
      media: row.media || [],
      features: row.features || [],
      mls: row.mls || {},
      agentId: row.agent_id || '',
      listedAt: row.listed_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    }));
  } catch (err) {
    console.warn('Error fetching properties from Supabase:', err);
    return null;
  }
}
