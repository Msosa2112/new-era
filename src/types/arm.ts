export type ArmThemeMode = 'light' | 'dark';

export type ArmTabId = 'home' | 'broker' | 'properties' | 'finance' | 'messages' | 'deals' | 'studio' | 'cma';

export type OmniChannel = 'whatsapp' | 'instagram' | 'facebook' | 'email';

export interface AgentChannelStatus {
  whatsappConnected: boolean;
  whatsappPhone: string;
  whatsappLinkedAt?: string;
  instagramConnected: boolean;
  instagramHandle: string;
  facebookConnected: boolean;
  facebookPage: string;
  emailConnected: boolean;
}

export interface EmbeddedPropertyCard {
  id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  mlsId?: string;
}

export interface OmniMessage {
  id: string;
  sender: 'client' | 'agent' | 'system';
  text: string;
  createdAt: string;
  channel: OmniChannel;
  propertyCard?: EmbeddedPropertyCard;
  status?: 'sent' | 'delivered' | 'read';
}

export interface OmniConversation {
  id: string;
  agentId: string;
  clientName: string;
  clientInitials: string;
  avatarBg: string;
  clientPhone?: string;
  clientEmail?: string;
  channel: OmniChannel;
  qualificationBadge?: string;
  unreadCount: number;
  updatedAt: string;
  lastPreview: string;
  aiSuggestedReplyEs: string;
  aiSuggestedReplyEn: string;
  aiActionNoteEs?: string;
  messages: OmniMessage[];
}

export type DealStage = 'listed' | 'under_contract' | 'inspection' | 'appraisal' | 'closing';

export type KyDocStatus = 'verified' | 'pending' | 'missing_urgent' | 'scheduled';

export interface KyChecklistItem {
  id: string;
  code: string;
  titleEn: string;
  titleEs: string;
  subtitleEs: string;
  subtitleEn: string;
  status: KyDocStatus;
  badgeEs: string;
  badgeEn: string;
  verifiedByAi?: boolean;
}

export interface DealDeadline {
  id: string;
  titleEs: string;
  titleEn: string;
  dateLabel: string;
  daysRemaining: number;
  status: 'urgent' | 'soon' | 'scheduled' | 'auto_ok';
  badgeEs: string;
}

export interface AuditedPdfRecord {
  id: string;
  fileName: string;
  fileSizeLabel: string;
  pageCount: number;
  auditedAt: string;
  extractedPrice: string;
  extractedEarnest: string;
  extractedClosing: string;
  extractedSignatures: string;
  summaryEs: string;
}

export interface CopilotKpi {
  value: string;
  label: string;
  tone: 'green' | 'gold' | 'red';
}

export interface CopilotWhatsappAction {
  labelEs: string;
  labelEn: string;
  targetClientName: string;
  messageToSend: string;
  sent?: boolean;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  kpis?: CopilotKpi[];
  whatsappAction?: CopilotWhatsappAction;
}

export interface ArmDeal {
  id: string;
  agentId: string;
  propertyAddress: string;
  neighborhood: string;
  city: string;
  price: number;
  earnestMoney: number;
  transactionType: 'Compra' | 'Venta' | 'Renta';
  clientName: string;
  clientPhone: string;
  titleCompany: string;
  lenderName: string;
  closingDateLabel: string;
  stage: DealStage;
  checklist: KyChecklistItem[];
  deadlines: DealDeadline[];
  auditedPdfs: AuditedPdfRecord[];
  copilotMessages: CopilotMessage[];
  updatedAt: string;
}

export type SocialTemplateType = 'just_listed' | 'open_house' | 'reel_script' | 'market_report';

export interface ScheduledSocialPost {
  id: string;
  agentId: string;
  day: number;
  format: 'POST' | 'REEL' | 'STORY' | 'FLYER';
  templateType: SocialTemplateType;
  title: string;
  caption: string;
  reelScript?: string;
  propertyAddress?: string;
  propertyPrice?: number;
  imageUrl?: string;
  platforms: ('IG' | 'FB')[];
  scheduledTime: string;
  autoPublish: boolean;
}

export interface ArmLeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'general' | 'tour' | 'valuation' | 'offer' | 'agent_inquiry';
  subjectOrAddress: string;
  message: string;
  assignedAgentId: string;
  status: 'new' | 'contacted' | 'scheduled';
  createdAt: string;
}

export interface BrokerActivityEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  textEs: string;
  textEn: string;
  category: 'audit' | 'message' | 'deal' | 'lead' | 'social';
}

export type CommissionPaymentStatus = 'escrow' | 'ready_to_pay' | 'paid';

export type PaymentMethodType = 'Zelle' | 'ACH / Transferencia' | 'Cheque';

export interface ArmCommissionRecord {
  id: string;
  propertyAddress: string;
  mlsId?: string;
  clientName: string;
  agentId: string;
  salePrice: number;
  commissionPct: number;
  grossCommission: number;
  agentSplitPct: number;
  transactionFee: number;
  agentNetPayout: number;
  brokerageNetAmount: number;
  titleCompany: string;
  closingDate: string;
  status: CommissionPaymentStatus;
  paymentMethod?: PaymentMethodType;
  paidAt?: string;
}

export interface ArmOfficeExpense {
  id: string;
  dateLabel: string;
  concept: string;
  category:
    | 'Renta & Oficina'
    | 'MLS & Sistemas'
    | 'Marketing & Letreros'
    | 'Cuota Agente (Ingreso)';
  entryType: 'expense' | 'income';
  amount: number;
  status: 'paid' | 'pending';
}

export interface ArmState {
  conversations: OmniConversation[];
  deals: ArmDeal[];
  socialPosts: ScheduledSocialPost[];
  autoPublishByAgent: Record<string, boolean>;
  channelStatusByAgent: Record<string, AgentChannelStatus>;
  websiteLeads: ArmLeadItem[];
  activityFeed: BrokerActivityEntry[];
  commissions: ArmCommissionRecord[];
  officeLedger: ArmOfficeExpense[];
}

export interface ArmSessionAgent {
  id: string;
  name: string;
  title: string;
  licenseNumber?: string;
  phone: string;
  corporateEmail: string;
  personalEmail?: string;
  photoUrl: string;
  photoNobgUrl?: string;
  isOfficeAdmin?: boolean;
  maskedPersonalEmail?: string;
}

export interface ArmSessionData {
  token: string;
  isAdmin: boolean;
  agent: ArmSessionAgent;
}
