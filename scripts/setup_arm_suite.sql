-- =============================================================================
-- New Era ARM & AI Suite - Production Supabase Schema (Kentucky Brokerage)
-- Run on New Era Real Estate LLC's own Supabase project upon final deployment.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Agent Channel Connections (WhatsApp QR, IG DMs, Facebook Messenger, Corporate Email)
CREATE TABLE IF NOT EXISTS public.agent_channel_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  whatsapp_connected BOOLEAN DEFAULT false,
  whatsapp_phone TEXT,
  whatsapp_linked_at TIMESTAMPTZ,
  instagram_connected BOOLEAN DEFAULT false,
  instagram_handle TEXT,
  facebook_connected BOOLEAN DEFAULT false,
  facebook_page TEXT,
  email_connected BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- 2. Omnichannel Conversations & Messages
CREATE TABLE IF NOT EXISTS public.omni_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'email')),
  qualification_badge TEXT,
  unread_count INT DEFAULT 0,
  last_preview TEXT,
  ai_suggested_reply TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.omni_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.omni_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'agent', 'system')),
  channel TEXT NOT NULL,
  body TEXT NOT NULL,
  property_card JSONB,
  status TEXT DEFAULT 'delivered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Kentucky Deal Rooms, Checklist Items & Audited PDFs
CREATE TABLE IF NOT EXISTS public.arm_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  property_address TEXT NOT NULL,
  neighborhood TEXT,
  city TEXT DEFAULT 'Louisville, KY',
  price NUMERIC NOT NULL,
  earnest_money NUMERIC DEFAULT 0,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Compra', 'Venta', 'Renta')),
  client_name TEXT NOT NULL,
  client_phone TEXT,
  title_company TEXT DEFAULT 'Bluegrass Title Co.',
  lender_name TEXT,
  closing_date DATE,
  stage TEXT NOT NULL DEFAULT 'under_contract',
  deadlines JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.deal_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES public.arm_deals(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'missing_urgent', 'scheduled')),
  verified_by_ai BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.deal_audited_pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES public.arm_deals(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  page_count INT DEFAULT 1,
  extracted_data JSONB DEFAULT '{}'::jsonb,
  summary TEXT,
  audited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AI Creative Studio & 30-Day Social Planner
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  day_of_month INT NOT NULL CHECK (day_of_month >= 1 AND day_of_month <= 31),
  format TEXT NOT NULL CHECK (format IN ('POST', 'REEL', 'STORY', 'FLYER')),
  template_type TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  reel_script TEXT,
  property_address TEXT,
  property_price NUMERIC,
  image_url TEXT,
  platforms JSONB DEFAULT '["IG", "FB"]'::jsonb,
  scheduled_time TEXT DEFAULT '10:00 AM',
  auto_publish BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.agent_channel_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_audited_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
