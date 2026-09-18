import { createClient } from '@supabase/supabase-js';
import { Agent, Property } from '../types/property';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rxejkmuzhkxfezkqrjnm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZWprbXV6aGt4ZmV6a3Fyam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODc3MDksImV4cCI6MjEwNTI2MzcwOX0.-p98aKj5-g47E1_kfniokkXGCgejyj072fXSv78WW0o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
}

/**
 * Submit lead or contact message
 */
export async function submitLead(lead: LeadSubmission) {
  try {
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
}

export async function submitHomeValuation(val: HomeValuationSubmission) {
  try {
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
