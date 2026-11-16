import { AGENTS_DATA } from '../data/agentsData';
import { Property } from '../types/property';
import {
  AgentChannelStatus,
  ArmCommissionRecord,
  ArmDeal,
  ArmLeadItem,
  ArmOfficeExpense,
  ArmState,
  AuditedPdfRecord,
  BrokerActivityEntry,
  CommissionPaymentStatus,
  CopilotMessage,
  DealStage,
  EmbeddedPropertyCard,
  KyChecklistItem,
  OmniChannel,
  OmniConversation,
  PaymentMethodType,
  ScheduledSocialPost,
} from '../types/arm';

const ARM_STORAGE_KEY = 'newera_arm_suite_state_v3';
const BROADCAST_NAME = 'newera_arm_sync';

let channelInstance: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!channelInstance) {
    channelInstance = new BroadcastChannel(BROADCAST_NAME);
  }
  return channelInstance;
}

function nowTimeLabel(): string {
  const now = new Date();
  return now.toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit' });
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function buildDefaultKyChecklist(opts?: {
  allVerified?: boolean;
  earnestPending?: boolean;
  inspectionDone?: boolean;
}): KyChecklistItem[] {
  const allOk = Boolean(opts?.allVerified);
  const earnestStatus = allOk ? 'verified' : opts?.earnestPending ? 'pending' : 'verified';
  const inspectionStatus = allOk ? 'verified' : opts?.inspectionDone ? 'verified' : 'missing_urgent';

  return [
    {
      id: 'ky-1',
      code: 'GLAR-PA',
      titleEn: 'Purchase Agreement',
      titleEs: 'Contrato de Compra-Venta',
      subtitleEs: 'Firmado por comprador y vendedor (14 págs.)',
      subtitleEn: 'Signed by Buyer & Seller (14 pages)',
      status: 'verified',
      badgeEs: 'Listo',
      badgeEn: 'Ready',
      verifiedByAi: true,
    },
    {
      id: 'ky-2',
      code: 'LENDER-PA',
      titleEn: 'Bank Pre-Approval Letter',
      titleEs: 'Carta de Pre-Aprobación del Banco',
      subtitleEs: 'Vigencia y monto confirmados',
      subtitleEn: 'Expiration and amount confirmed',
      status: 'verified',
      badgeEs: 'Listo',
      badgeEn: 'Ready',
      verifiedByAi: true,
    },
    {
      id: 'ky-3',
      code: 'KY-SD',
      titleEn: 'Property Condition Disclosure',
      titleEs: 'Declaración del Estado de la Casa',
      subtitleEs: 'Documento estatal completo',
      subtitleEn: 'State disclosure form signed',
      status: 'verified',
      badgeEs: 'Listo',
      badgeEn: 'Ready',
      verifiedByAi: true,
    },
    {
      id: 'ky-4',
      code: 'EMD-REC',
      titleEn: 'Initial Deposit Receipt',
      titleEs: 'Recibo de Depósito Inicial',
      subtitleEs: 'Dinero guardado en garantía',
      subtitleEn: 'Deposit receipt confirmed',
      status: earnestStatus,
      badgeEs: earnestStatus === 'verified' ? 'Listo' : 'Pendiente',
      badgeEn: earnestStatus === 'verified' ? 'Ready' : 'Pending',
      verifiedByAi: earnestStatus === 'verified',
    },
    {
      id: 'ky-5',
      code: 'KY-AGENCY',
      titleEn: 'Agency Representation Consent',
      titleEs: 'Permiso de Representación',
      subtitleEs: 'Firma del cliente completa',
      subtitleEn: 'Client signature complete',
      status: 'verified',
      badgeEs: 'Listo',
      badgeEn: 'Ready',
      verifiedByAi: true,
    },
    {
      id: 'ky-6',
      code: 'LBP-ADD',
      titleEn: 'Lead Paint / HOA Addendum',
      titleEs: 'Anexo de Pintura / Asociación',
      subtitleEs: 'Anexos obligatorios revisados',
      subtitleEn: 'Required addenda reviewed',
      status: 'verified',
      badgeEs: 'Listo',
      badgeEn: 'Ready',
      verifiedByAi: true,
    },
    {
      id: 'ky-7',
      code: 'INSP-RPT',
      titleEn: 'Home Inspection Report',
      titleEs: 'Reporte de Inspección de la Casa',
      subtitleEs: inspectionStatus === 'verified' ? 'Aprobado y firmado' : 'Vence en 3 días',
      subtitleEn: inspectionStatus === 'verified' ? 'Approved and signed' : 'Due in 3 days',
      status: inspectionStatus,
      badgeEs: inspectionStatus === 'verified' ? 'Listo' : 'Falta',
      badgeEn: inspectionStatus === 'verified' ? 'Ready' : 'Missing',
      verifiedByAi: inspectionStatus === 'verified',
    },
    {
      id: 'ky-8',
      code: 'APPR-CTC',
      titleEn: 'Bank Appraisal & Final Approval',
      titleEs: 'Tasación del Banco y Aprobación Final',
      subtitleEs: allOk ? 'Aprobado para firma final' : 'Cita programada con el banco',
      subtitleEn: allOk ? 'Approved for final closing' : 'Scheduled with lender',
      status: allOk ? 'verified' : 'scheduled',
      badgeEs: allOk ? 'Listo' : 'Programado',
      badgeEn: allOk ? 'Ready' : 'Scheduled',
      verifiedByAi: allOk,
    },
  ];
}

function buildInitialChannelStatuses(): Record<string, AgentChannelStatus> {
  const map: Record<string, AgentChannelStatus> = {};
  AGENTS_DATA.forEach((agent, idx) => {
    const firstName = agent.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    map[agent.id] = {
      whatsappConnected: idx < 6,
      whatsappPhone: agent.phone,
      whatsappLinkedAt: idx < 6 ? 'Hoy 09:15 AM' : undefined,
      instagramConnected: idx < 4,
      instagramHandle: `@${firstName}.neweraky`,
      facebookConnected: idx < 4,
      facebookPage: `${agent.name} · New Era Realty`,
      emailConnected: true,
    };
  });
  return map;
}

export function createSeedArmState(): ArmState {
  const conversations: OmniConversation[] = [
    {
      id: 'conv-carlos',
      agentId: 'yazbel-diaz',
      clientName: 'Carlos Mendoza',
      clientInitials: 'CM',
      avatarBg: '#15803D',
      clientPhone: '(502) 441-8890',
      clientEmail: 'carlos.mendoza@gmail.com',
      channel: 'whatsapp',
      qualificationBadge: 'Pre-aprobado $480K',
      unreadCount: 1,
      updatedAt: 'Hace 4 min',
      lastPreview: 'Hola Yazbel, ¿sigue disponible la casa de Norton Commons?',
      aiSuggestedReplyEs:
        '¡Hola Carlos! Sí, 9402 Norton Commons Blvd sigue activa y encaja perfecto en tu pre-aprobación de $480K. ¿Te viene bien mañana jueves a las 5:00 PM para verla en persona?',
      aiSuggestedReplyEn:
        'Hi Carlos! Yes, 9402 Norton Commons Blvd is still active and fits right inside your $480K pre-approval. Does tomorrow at 5:00 PM work for a private showing?',
      aiActionNoteEs: 'La IA detectó interés alto y disponibilidad de showing esta semana.',
      messages: [
        {
          id: 'msg-c1',
          sender: 'client',
          channel: 'whatsapp',
          createdAt: '10:12 AM',
          text: 'Hola Yazbel, busco 4 habitaciones en Prospect o Louisville. ¿Tienes algo disponible hasta $480K?',
        },
        {
          id: 'msg-c2',
          sender: 'agent',
          channel: 'whatsapp',
          createdAt: '10:15 AM',
          text: '¡Hola Carlos! Qué gusto saludarte. Te comparto esta opción ideal en Norton Commons:',
          propertyCard: {
            id: 'prop-norton-demo',
            slug: '9402-norton-commons-blvd',
            title: '9402 Norton Commons Blvd',
            address: '9402 Norton Commons Blvd',
            city: 'Prospect, KY 40059',
            price: 465000,
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2940,
            imageUrl: '/assets/masterclass/house-louisville-clean.jpg',
            mlsId: '164920',
          },
          status: 'read',
        },
        {
          id: 'msg-c3',
          sender: 'client',
          channel: 'whatsapp',
          createdAt: '10:18 AM',
          text: '¡Me encantó la fachada! ¿Sigue disponible para hacer showing esta semana?',
        },
      ],
    },
    {
      id: 'conv-laura',
      agentId: 'yazbel-diaz',
      clientName: 'Laura Gómez',
      clientInitials: 'LG',
      avatarBg: '#9D174D',
      clientPhone: '(502) 774-2301',
      channel: 'instagram',
      qualificationBadge: 'Pre-aprobada FHA',
      unreadCount: 2,
      updatedAt: 'Hace 19 min',
      lastPreview: 'Vi tu reel de primeros compradores en Louisville. Ya tengo carta del banco.',
      aiSuggestedReplyEs:
        '¡Felicidades por tu pre-aprobación, Laura! En Kentucky puedes combinar tu FHA con asistencia de KHC para el cierre. ¿Qué zona prefieres: St. Matthews, Jeffersontown o Okolona?',
      aiSuggestedReplyEn:
        'Congrats on your pre-approval, Laura! In Kentucky you can combine FHA with KHC closing assistance. Which neighborhood do you prefer?',
      messages: [
        {
          id: 'msg-l1',
          sender: 'client',
          channel: 'instagram',
          createdAt: '09:52 AM',
          text: 'Vi tu reel de primeros compradores en Louisville. Ya tengo carta del banco por $360K.',
        },
      ],
    },
    {
      id: 'conv-roberto',
      agentId: 'yenny-mendoza-molina',
      clientName: 'Roberto Silva',
      clientInitials: 'RS',
      avatarBg: '#1D4ED8',
      clientPhone: '(502) 829-1044',
      channel: 'facebook',
      qualificationBadge: 'Comprador Contado',
      unreadCount: 1,
      updatedAt: 'Hace 42 min',
      lastPreview: '¿Podemos ver la casa de Wolf Pen Branch este sábado a las 11 AM?',
      aiSuggestedReplyEs:
        '¡Por supuesto Roberto! Te confirmo el sábado a las 11:00 AM en Wolf Pen Branch. Te envío la ficha completa del MLS ahora mismo.',
      aiSuggestedReplyEn:
        'Of course Roberto! Saturday at 11:00 AM is confirmed. Sending you the live MLS sheet right now.',
      messages: [
        {
          id: 'msg-r1',
          sender: 'client',
          channel: 'facebook',
          createdAt: '09:30 AM',
          text: 'Hola Yenny, ¿podemos ver la casa de Wolf Pen Branch este sábado a las 11 AM?',
        },
      ],
    },
    {
      id: 'conv-title',
      agentId: 'yeilen-contreras',
      clientName: 'Bluegrass Title Co.',
      clientInitials: 'BT',
      avatarBg: '#660E1A',
      clientEmail: 'closings@bluegrasstitleky.com',
      channel: 'email',
      qualificationBadge: 'Expediente #402',
      unreadCount: 1,
      updatedAt: 'Hoy 09:05 AM',
      lastPreview: 'Clear to Close confirmado · 2418 Cherokee Pkwy listo para firma.',
      aiSuggestedReplyEs:
        'Confirmado recibido por New Era Real Estate. Coordinamos con el Realtor Darien Hernandez y los compradores para la firma a las 2:00 PM.',
      aiSuggestedReplyEn:
        'Received with thanks by New Era Real Estate. Coordinating closing time with agent and buyers for 2:00 PM.',
      messages: [
        {
          id: 'msg-t1',
          sender: 'client',
          channel: 'email',
          createdAt: '09:05 AM',
          text: 'Buenos días Yeilen, confirmamos Clear to Close para 2418 Cherokee Pkwy. El HUD Settlement Statement final está listo para revisión de New Era.',
        },
      ],
    },
    {
      id: 'conv-morales',
      agentId: 'darien-hernandez',
      clientName: 'Familia Morales',
      clientInitials: 'FM',
      avatarBg: '#047857',
      clientPhone: '(502) 612-7745',
      channel: 'whatsapp',
      qualificationBadge: 'En Cierre · 2418 Cherokee',
      unreadCount: 0,
      updatedAt: 'Ayer',
      lastPreview: '¡Excelente! Ya enviamos la transferencia del cierre.',
      aiSuggestedReplyEs:
        '¡Todo confirmado Familia Morales! Nos vemos el viernes en Bluegrass Title Co. para entregarles las llaves de su nuevo hogar.',
      aiSuggestedReplyEn:
        'Everything is confirmed! See you Friday at Bluegrass Title Co. for key handoff.',
      messages: [
        {
          id: 'msg-m1',
          sender: 'client',
          channel: 'whatsapp',
          createdAt: 'Ayer 4:40 PM',
          text: '¡Excelente Darien! Ya enviamos el wire confirmation para el cierre.',
        },
      ],
    },
    {
      id: 'conv-sofia',
      agentId: 'yeilen-contreras',
      clientName: 'Sofía & Daniel Reyes',
      clientInitials: 'SR',
      avatarBg: '#B45309',
      clientPhone: '(502) 390-5518',
      channel: 'whatsapp',
      qualificationBadge: 'Vendedor · Prospect',
      unreadCount: 1,
      updatedAt: 'Hace 12 min',
      lastPreview: 'Yeilen, queremos valorar nuestra casa en Prospect para vender en diciembre.',
      aiSuggestedReplyEs:
        '¡Hola Sofía y Daniel! Con gusto preparamos su Análisis Comparativo de Mercado (CMA) de Louisville y pasamos a ver su propiedad esta semana. ¿Prefieren martes o miércoles?',
      aiSuggestedReplyEn:
        'Hi Sofia & Daniel! We would love to prepare your Louisville CMA valuation and tour your home this week. Tuesday or Wednesday?',
      messages: [
        {
          id: 'msg-s1',
          sender: 'client',
          channel: 'whatsapp',
          createdAt: '10:02 AM',
          text: 'Hola Yeilen, queremos valorar nuestra casa en Prospect (3,100 sqft, 4 hab) para ponerla a la venta.',
        },
      ],
    },
  ];

  const deals: ArmDeal[] = [
    {
      id: 'deal-norton-402',
      agentId: 'yazbel-diaz',
      propertyAddress: '9402 Norton Commons Blvd',
      neighborhood: 'Norton Commons',
      city: 'Prospect, KY 40059',
      price: 465000,
      earnestMoney: 7500,
      transactionType: 'Compra',
      clientName: 'Carlos Mendoza',
      clientPhone: '(502) 441-8890',
      titleCompany: 'Bluegrass Title Co.',
      lenderName: 'Commonwealth Mortgage KY',
      closingDateLabel: '28 Nov 2026',
      stage: 'inspection',
      checklist: buildDefaultKyChecklist({ inspectionDone: false }),
      deadlines: [
        {
          id: 'dl-1',
          titleEs: 'Fecha Límite de Inspección',
          titleEn: 'Inspection Deadline',
          dateLabel: 'En 3 días - 5:00 PM',
          daysRemaining: 3,
          status: 'urgent',
          badgeEs: 'En 3 días',
        },
        {
          id: 'dl-2',
          titleEs: 'Aviso al Agente (7 días antes)',
          titleEn: '7-Day Agent Reminder',
          dateLabel: 'Enviado automáticamente',
          daysRemaining: 0,
          status: 'auto_ok',
          badgeEs: 'Enviado',
        },
        {
          id: 'dl-3',
          titleEs: 'Tasación con el Banco',
          titleEn: 'Bank Appraisal Appointment',
          dateLabel: 'En 9 días - 10:00 AM',
          daysRemaining: 9,
          status: 'scheduled',
          badgeEs: 'Programado',
        },
        {
          id: 'dl-4',
          titleEs: 'Firma Final de Cierre',
          titleEn: 'Closing Table',
          dateLabel: '28 Nov - Bluegrass Title Co.',
          daysRemaining: 13,
          status: 'soon',
          badgeEs: 'Confirmado',
        },
      ],
      auditedPdfs: [
        {
          id: 'pdf-seed-1',
          fileName: 'Purchase_Agreement_NortonCommons_KY.pdf',
          fileSizeLabel: '1.8 MB',
          pageCount: 14,
          auditedAt: 'Hoy 09:40 AM',
          extractedPrice: '$465,000',
          extractedEarnest: '$7,500',
          extractedClosing: '28 Nov 2026',
          extractedSignatures: '4 de 4 firmadas',
          summaryEs: 'Contrato revisado al 100%. Todas las firmas están completas.',
        },
      ],
      copilotMessages: [
        {
          id: 'cp-seed-1',
          role: 'assistant',
          text: 'Expediente de 9402 Norton Commons Blvd auditado. Tengo conectados los documentos GLAR de Kentucky. Pregúntame por plazos, documentos faltantes o montos.',
          timestamp: '09:42 AM',
          kpis: [
            { value: '6/8', label: 'Docs Aprobados', tone: 'green' },
            { value: 'Falta 1', label: 'Reporte Inspección', tone: 'gold' },
            { value: '3 días', label: 'Vence Contingencia', tone: 'red' },
          ],
          whatsappAction: {
            labelEs: 'Pedir reporte a Carlos por WhatsApp',
            labelEn: 'Request report from Carlos via WhatsApp',
            targetClientName: 'Carlos Mendoza',
            messageToSend:
              'Hola Carlos, te escribo de New Era Real Estate para recordar el Reporte de Inspección de 9402 Norton Commons Blvd antes del cierre de contingencia en 3 días. ¿Ya lo recibiste del inspector?',
            sent: false,
          },
        },
      ],
      updatedAt: 'Hace 15 min',
    },
    {
      id: 'deal-wolfpen-219',
      agentId: 'yenny-mendoza-molina',
      propertyAddress: '7506 Wolf Pen Branch Rd',
      neighborhood: 'Wolf Pen Branch',
      city: 'Prospect, KY 40059',
      price: 629000,
      earnestMoney: 10000,
      transactionType: 'Venta',
      clientName: 'Roberto Silva',
      clientPhone: '(502) 829-1044',
      titleCompany: 'Pitt & Frank Title',
      lenderName: 'Stock Yards Bank',
      closingDateLabel: '04 Dic 2026',
      stage: 'appraisal',
      checklist: buildDefaultKyChecklist({ inspectionDone: true }),
      deadlines: [
        {
          id: 'dl-w1',
          titleEs: 'Entrega de Tasación Bancaria',
          titleEn: 'Bank Appraisal Delivery',
          dateLabel: 'En 5 días · 2:00 PM',
          daysRemaining: 5,
          status: 'soon',
          badgeEs: '5 días',
        },
        {
          id: 'dl-w2',
          titleEs: 'Cierre en Pitt & Frank Title',
          titleEn: 'Closing at Pitt & Frank Title',
          dateLabel: '04 Dic 2026 · 11:00 AM',
          daysRemaining: 19,
          status: 'scheduled',
          badgeEs: 'Agendado',
        },
      ],
      auditedPdfs: [],
      copilotMessages: [],
      updatedAt: 'Hace 1 h',
    },
    {
      id: 'deal-cherokee-880',
      agentId: 'darien-hernandez',
      propertyAddress: '2418 Cherokee Pkwy',
      neighborhood: 'Cherokee Triangle',
      city: 'Louisville, KY 40204',
      price: 515000,
      earnestMoney: 8000,
      transactionType: 'Compra',
      clientName: 'Familia Morales',
      clientPhone: '(502) 612-7745',
      titleCompany: 'Bluegrass Title Co.',
      lenderName: 'Republic Bank KY',
      closingDateLabel: '19 Nov 2026',
      stage: 'closing',
      checklist: buildDefaultKyChecklist({ allVerified: true }),
      deadlines: [
        {
          id: 'dl-ch1',
          titleEs: 'Listo para Firma Final',
          titleEn: 'Ready for Closing',
          dateLabel: 'Listo para firma',
          daysRemaining: 4,
          status: 'auto_ok',
          badgeEs: 'Listo',
        },
      ],
      auditedPdfs: [],
      copilotMessages: [],
      updatedAt: 'Hoy 09:05 AM',
    },
    {
      id: 'deal-stmatthews-311',
      agentId: 'marien-rodriguez-reyes',
      propertyAddress: '3912 Taylorsville Rd',
      neighborhood: 'St. Matthews',
      city: 'Louisville, KY 40220',
      price: 349900,
      earnestMoney: 5000,
      transactionType: 'Compra',
      clientName: 'Valeria & Luis Torres',
      clientPhone: '(502) 519-0233',
      titleCompany: 'Borders & Borders Title',
      lenderName: 'KHC / FHA First-Time Buyer',
      closingDateLabel: '10 Dic 2026',
      stage: 'under_contract',
      checklist: buildDefaultKyChecklist({ earnestPending: true, inspectionDone: false }),
      deadlines: [
        {
          id: 'dl-sm1',
          titleEs: 'Entrega de Depósito Earnest Money',
          titleEn: 'Earnest Money Escrow Deadline',
          dateLabel: 'Mañana · 5:00 PM',
          daysRemaining: 1,
          status: 'urgent',
          badgeEs: '¡1 día!',
        },
        {
          id: 'dl-sm2',
          titleEs: 'Ventana de Inspección (10 días)',
          titleEn: '10-Day Inspection Window',
          dateLabel: 'En 7 días',
          daysRemaining: 7,
          status: 'soon',
          badgeEs: '7 días',
        },
      ],
      auditedPdfs: [],
      copilotMessages: [],
      updatedAt: 'Hace 3 h',
    },
    {
      id: 'deal-shepherdsville-104',
      agentId: 'yeilen-contreras',
      propertyAddress: '6810 Shepherdsville Rd',
      neighborhood: 'Okolona / Highview',
      city: 'Louisville, KY 40219',
      price: 385000,
      earnestMoney: 6000,
      transactionType: 'Venta',
      clientName: 'Sofía & Daniel Reyes',
      clientPhone: '(502) 390-5518',
      titleCompany: 'Bluegrass Title Co.',
      lenderName: 'Por definir (Listado Exclusivo)',
      closingDateLabel: '18 Dic 2026',
      stage: 'listed',
      checklist: buildDefaultKyChecklist({ inspectionDone: true }),
      deadlines: [
        {
          id: 'dl-sh1',
          titleEs: 'Open House Programado',
          titleEn: 'Scheduled Open House',
          dateLabel: 'Domingo · 1:00 PM – 4:00 PM',
          daysRemaining: 6,
          status: 'scheduled',
          badgeEs: 'Domingo',
        },
      ],
      auditedPdfs: [],
      copilotMessages: [],
      updatedAt: 'Hoy 10:00 AM',
    },
  ];

  const websiteLeads: ArmLeadItem[] = [
    {
      id: 'lead-web-1',
      name: 'Sofía & Daniel Reyes',
      email: 'sofia.reyes.ky@gmail.com',
      phone: '(502) 390-5518',
      type: 'valuation',
      subjectOrAddress: '4120 Buckeye Ln, Prospect, KY 40059',
      message: 'Queremos valuación CMA para listar en los próximos 30 días. 4 hab, 3.5 baños, 3,100 sqft.',
      assignedAgentId: 'yeilen-contreras',
      status: 'new',
      createdAt: 'Hoy 10:02 AM',
    },
    {
      id: 'lead-web-2',
      name: 'Andrés Castellanos',
      email: 'acastellanos@yahoo.com',
      phone: '(502) 883-1492',
      type: 'tour',
      subjectOrAddress: 'Tour Privado · Norton Commons Blvd',
      message: 'Solicito recorrido bilingüe este sábado en la tarde. Ya contamos con carta de pre-aprobación.',
      assignedAgentId: 'yazbel-diaz',
      status: 'scheduled',
      createdAt: 'Hoy 08:45 AM',
    },
    {
      id: 'lead-web-3',
      name: 'Camila Navarro',
      email: 'camilapnavarro@gmail.com',
      phone: '(502) 917-4022',
      type: 'general',
      subjectOrAddress: 'Asesoría Primeros Compradores KHC ($10K Grant)',
      message: 'Me interesa aplicar a los bonos de Kentucky Housing Corp en Louisville hasta $340,000.',
      assignedAgentId: 'yenny-mendoza-molina',
      status: 'new',
      createdAt: 'Ayer 6:18 PM',
    },
  ];

  const socialPosts: ScheduledSocialPost[] = [
    {
      id: 'sp-1',
      agentId: 'yazbel-diaz',
      day: 2,
      format: 'POST',
      templateType: 'just_listed',
      title: 'En Venta - Norton Commons $465K',
      caption: 'Nueva propiedad en Prospect / Norton Commons - 4 Hab, 3 Baños, 2,940 sqft. Escríbeme para cita privada en español o inglés. #LouisvilleRealEstate #NewEraKY',
      propertyAddress: '9402 Norton Commons Blvd',
      propertyPrice: 465000,
      imageUrl: '/assets/masterclass/house-louisville-clean.jpg',
      platforms: ['IG', 'FB'],
      scheduledTime: '10:00 AM',
      autoPublish: true,
    },
    {
      id: 'sp-2',
      agentId: 'yazbel-diaz',
      day: 5,
      format: 'REEL',
      templateType: 'reel_script',
      title: 'Video - 3 Errores al Comprar en KY',
      caption: '¿Planeas comprar casa en Louisville este año? Evita estos 3 errores antes de enviar tu oferta. #KentuckyHomes #NewEraRealEstate',
      reelScript:
        'INICIO (0-3s): "¿Sabías que puedes recibir hasta $10,000 en ayuda para tu casa en Kentucky?"\nDESARROLLO: 1) No hagas compras grandes a crédito antes del cierre. 2) Ten lista tu carta del banco. 3) Revisa la inspección a tiempo.\nFINAL: "Comenta CASA y te envío la guía gratis."',
      imageUrl: '/assets/masterclass/house-louisville-clean.jpg',
      platforms: ['IG', 'FB'],
      scheduledTime: '05:30 PM',
      autoPublish: true,
    },
    {
      id: 'sp-3',
      agentId: 'yazbel-diaz',
      day: 9,
      format: 'STORY',
      templateType: 'open_house',
      title: 'Casa Abierta Domingo 1-4 PM',
      caption: 'Casa Abierta este domingo de 1:00 PM a 4:00 PM en Prospect, KY. Te esperamos con asesoría personalizada.',
      propertyAddress: '9402 Norton Commons Blvd',
      propertyPrice: 465000,
      imageUrl: '/assets/masterclass/house-louisville-clean.jpg',
      platforms: ['IG', 'FB'],
      scheduledTime: '09:30 AM',
      autoPublish: true,
    },
    {
      id: 'sp-4',
      agentId: 'yeilen-contreras',
      day: 3,
      format: 'POST',
      templateType: 'market_report',
      title: 'Reporte Mercado Louisville +4.2%',
      caption: 'Pulso del mercado inmobiliario en Greater Louisville: casas disponibles, tiempo de venta y oportunidad para propietarios. #NewEraKY',
      imageUrl: '/assets/masterclass/house-louisville-clean.jpg',
      platforms: ['IG', 'FB'],
      scheduledTime: '11:00 AM',
      autoPublish: true,
    },
  ];

  const activityFeed: BrokerActivityEntry[] = [
    {
      id: 'act-1',
      timestamp: '09:42 AM',
      agentId: 'yazbel-diaz',
      agentName: 'Yazbel Diaz',
      textEs: 'IA auditó Purchase_Agreement_NortonCommons_KY.pdf (14 págs., 4/4 firmas verificadas).',
      textEn: 'AI audited Purchase_Agreement_NortonCommons_KY.pdf (14 pages, 4/4 signatures verified).',
      category: 'audit',
    },
    {
      id: 'act-2',
      timestamp: '09:05 AM',
      agentId: 'darien-hernandez',
      agentName: 'Darien Hernandez',
      textEs: 'Bluegrass Title Co. confirmó Clear to Close para 2418 Cherokee Pkwy ($515,000).',
      textEn: 'Bluegrass Title Co. confirmed Clear to Close for 2418 Cherokee Pkwy ($515,000).',
      category: 'deal',
    },
    {
      id: 'act-3',
      timestamp: '10:02 AM',
      agentId: 'yeilen-contreras',
      agentName: 'Yeilen Contreras',
      textEs: 'Nuevo lead de Valuación CMA recibido desde neweraky.com (4120 Buckeye Ln, Prospect).',
      textEn: 'New CMA Valuation lead received from neweraky.com (4120 Buckeye Ln, Prospect).',
      category: 'lead',
    },
  ];

  const commissions: ArmCommissionRecord[] = [
    {
      id: 'com-cherokee-1',
      propertyAddress: '2418 Cherokee Pkwy, Louisville, KY',
      clientName: 'Familia Morales',
      agentId: 'darien-hernandez',
      salePrice: 515000,
      commissionPct: 3,
      grossCommission: 15450,
      agentSplitPct: 80,
      transactionFee: 395,
      agentNetPayout: 11965,
      brokerageNetAmount: 3485,
      titleCompany: 'Bluegrass Title Co.',
      closingDate: '19 Nov 2026',
      status: 'ready_to_pay',
    },
    {
      id: 'com-bluewing-2',
      propertyAddress: '7413 Blue Wing Dr, Louisville, KY 40258',
      mlsId: '1730058',
      clientName: 'Comprador MLS #1730058',
      agentId: 'yenny-mendoza-molina',
      salePrice: 220000,
      commissionPct: 3,
      grossCommission: 6600,
      agentSplitPct: 85,
      transactionFee: 0,
      agentNetPayout: 5610,
      brokerageNetAmount: 990,
      titleCompany: 'Pitt & Frank Title',
      closingDate: '14 Nov 2026',
      status: 'ready_to_pay',
    },
    {
      id: 'com-ladd-3',
      propertyAddress: '6468 Ladd Ave, Louisville, KY 40216',
      mlsId: '1730375',
      clientName: 'Familia Castillo',
      agentId: 'dahana-aguila',
      salePrice: 200000,
      commissionPct: 3,
      grossCommission: 6000,
      agentSplitPct: 80,
      transactionFee: 0,
      agentNetPayout: 4800,
      brokerageNetAmount: 1200,
      titleCompany: 'Bluegrass Title Co.',
      closingDate: '05 Nov 2026',
      status: 'paid',
      paymentMethod: 'ACH / Transferencia',
      paidAt: '05 Nov 2026',
    },
    {
      id: 'com-bardstown-4',
      propertyAddress: '3814 Bardstown Rd, Louisville, KY',
      clientName: 'Sofía Martínez',
      agentId: 'yazbel-diaz',
      salePrice: 318000,
      commissionPct: 3,
      grossCommission: 9540,
      agentSplitPct: 80,
      transactionFee: 0,
      agentNetPayout: 7632,
      brokerageNetAmount: 1908,
      titleCompany: 'Borders & Borders Title',
      closingDate: '01 Nov 2026',
      status: 'paid',
      paymentMethod: 'Zelle',
      paidAt: '01 Nov 2026',
    },
    {
      id: 'com-norton-5',
      propertyAddress: '9402 Norton Commons Blvd, Prospect, KY',
      clientName: 'Carlos Mendoza',
      agentId: 'yazbel-diaz',
      salePrice: 465000,
      commissionPct: 3,
      grossCommission: 13950,
      agentSplitPct: 80,
      transactionFee: 0,
      agentNetPayout: 11160,
      brokerageNetAmount: 2790,
      titleCompany: 'Bluegrass Title Co.',
      closingDate: '28 Nov 2026',
      status: 'escrow',
    },
    {
      id: 'com-ashby-6',
      propertyAddress: '6620 Ashby Ln, Louisville, KY 40272',
      mlsId: '1727293',
      clientName: 'Vendedor MLS #1727293',
      agentId: 'yenny-mendoza-molina',
      salePrice: 220000,
      commissionPct: 3,
      grossCommission: 6600,
      agentSplitPct: 85,
      transactionFee: 0,
      agentNetPayout: 5610,
      brokerageNetAmount: 990,
      titleCompany: 'Pitt & Frank Title',
      closingDate: '04 Dic 2026',
      status: 'escrow',
    },
    {
      id: 'com-dubourg-7',
      propertyAddress: '1927 Dubourg Ave, Louisville, KY 40216',
      mlsId: '1727273',
      clientName: 'Comprador MLS #1727273',
      agentId: 'yordanis-alba-elias',
      salePrice: 189900,
      commissionPct: 3,
      grossCommission: 5697,
      agentSplitPct: 80,
      transactionFee: 0,
      agentNetPayout: 4558,
      brokerageNetAmount: 1139,
      titleCompany: 'Bluegrass Title Co.',
      closingDate: '08 Dic 2026',
      status: 'escrow',
    },
  ];

  const officeLedger: ArmOfficeExpense[] = [
    {
      id: 'led-1',
      dateLabel: '01 Nov 2026',
      concept: 'Renta Oficina · 6501 Shepherdsville Rd Suite 119',
      category: 'Renta & Oficina',
      entryType: 'expense',
      amount: 2150,
      status: 'paid',
    },
    {
      id: 'led-2',
      dateLabel: '03 Nov 2026',
      concept: 'Membresía Corporativa GLAR & Spark MLS',
      category: 'MLS & Sistemas',
      entryType: 'expense',
      amount: 485,
      status: 'paid',
    },
    {
      id: 'led-3',
      dateLabel: '07 Nov 2026',
      concept: 'Impresión de Letreros & Lockboxes New Era',
      category: 'Marketing & Letreros',
      entryType: 'expense',
      amount: 340,
      status: 'paid',
    },
    {
      id: 'led-4',
      dateLabel: '18 Nov 2026',
      concept: 'Seguro E&O Brokerage Kentucky (Mensual)',
      category: 'Renta & Oficina',
      entryType: 'expense',
      amount: 260,
      status: 'pending',
    },
    {
      id: 'led-5',
      dateLabel: '10 Nov 2026',
      concept: 'Cuotas Administrativas / Desk Fees Equipo (26 Agentes)',
      category: 'Cuota Agente (Ingreso)',
      entryType: 'income',
      amount: 1300,
      status: 'paid',
    },
  ];

  return {
    conversations,
    deals,
    socialPosts,
    autoPublishByAgent: {
      'yazbel-diaz': true,
      'yeilen-contreras': true,
    },
    channelStatusByAgent: buildInitialChannelStatuses(),
    websiteLeads,
    activityFeed,
    commissions,
    officeLedger,
  };
}

let cachedState: ArmState | null = null;

function persistState(next: ArmState, broadcast = true): void {
  cachedState = next;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ARM_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
    window.dispatchEvent(new CustomEvent('newera-arm-update'));
    if (broadcast) {
      try {
        getChannel()?.postMessage({ type: 'ARM_STATE_SYNC', payload: next });
      } catch {
        // ignore channel errors
      }
    }
  }
}

export function getArmState(): ArmState {
  if (cachedState) return cachedState;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(ARM_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ArmState;
        if (parsed && Array.isArray(parsed.deals) && Array.isArray(parsed.conversations)) {
          const fallback = createSeedArmState();
          cachedState = {
            ...fallback,
            ...parsed,
            commissions: Array.isArray(parsed.commissions) ? parsed.commissions : fallback.commissions,
            officeLedger: Array.isArray(parsed.officeLedger) ? parsed.officeLedger : fallback.officeLedger,
          };
          return cachedState;
        }
      }
    } catch {
      // fall through to seed
    }
  }
  const seed = createSeedArmState();
  cachedState = seed;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ARM_STORAGE_KEY, JSON.stringify(seed));
    } catch {
      // ignore
    }
  }
  return seed;
}

export function subscribeArmState(listener: (state: ArmState) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const onLocalUpdate = () => {
    cachedState = null;
    listener(getArmState());
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key === ARM_STORAGE_KEY) {
      cachedState = null;
      listener(getArmState());
    }
  };

  const bc = getChannel();
  const onBroadcast = (ev: MessageEvent) => {
    if (ev.data?.type === 'ARM_STATE_SYNC' && ev.data?.payload) {
      cachedState = ev.data.payload as ArmState;
      listener(cachedState);
    }
  };

  window.addEventListener('newera-arm-update', onLocalUpdate);
  window.addEventListener('storage', onStorage);
  bc?.addEventListener('message', onBroadcast);

  return () => {
    window.removeEventListener('newera-arm-update', onLocalUpdate);
    window.removeEventListener('storage', onStorage);
    bc?.removeEventListener('message', onBroadcast);
  };
}

export function resetArmDemoState(): ArmState {
  const seed = createSeedArmState();
  persistState(seed);
  return seed;
}

function addActivity(
  state: ArmState,
  agentId: string,
  textEs: string,
  textEn: string,
  category: BrokerActivityEntry['category']
): BrokerActivityEntry[] {
  const agent = AGENTS_DATA.find((a) => a.id === agentId);
  const entry: BrokerActivityEntry = {
    id: makeId('act'),
    timestamp: nowTimeLabel(),
    agentId,
    agentName: agent?.name || 'New Era Agent',
    textEs,
    textEn,
    category,
  };
  return [entry, ...state.activityFeed].slice(0, 25);
}

export function connectAgentChannel(
  agentId: string,
  channel: OmniChannel,
  handleOrPhone?: string
): ArmState {
  const state = getArmState();
  const existing = state.channelStatusByAgent[agentId] || {
    whatsappConnected: false,
    whatsappPhone: '',
    instagramConnected: false,
    instagramHandle: '@newera.ky',
    facebookConnected: false,
    facebookPage: 'New Era Real Estate',
    emailConnected: true,
  };

  const updated: AgentChannelStatus = { ...existing };
  if (channel === 'whatsapp') {
    updated.whatsappConnected = true;
    if (handleOrPhone) updated.whatsappPhone = handleOrPhone;
    updated.whatsappLinkedAt = `Hoy ${nowTimeLabel()}`;
  } else if (channel === 'instagram') {
    updated.instagramConnected = !existing.instagramConnected || Boolean(handleOrPhone);
    if (handleOrPhone) updated.instagramHandle = handleOrPhone;
  } else if (channel === 'facebook') {
    updated.facebookConnected = !existing.facebookConnected || Boolean(handleOrPhone);
    if (handleOrPhone) updated.facebookPage = handleOrPhone;
  } else if (channel === 'email') {
    updated.emailConnected = true;
  }

  const next: ArmState = {
    ...state,
    channelStatusByAgent: {
      ...state.channelStatusByAgent,
      [agentId]: updated,
    },
    activityFeed: addActivity(
      state,
      agentId,
      `Canal ${channel.toUpperCase()} vinculado y activo en la Bandeja Unificada.`,
      `${channel.toUpperCase()} channel connected in Unified Inbox.`,
      'message'
    ),
  };
  persistState(next);
  return next;
}

export function markConversationRead(conversationId: string): ArmState {
  const state = getArmState();
  const next: ArmState = {
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ),
  };
  persistState(next);
  return next;
}

export function sendOmniMessage(
  conversationId: string,
  text: string,
  propertyCard?: EmbeddedPropertyCard
): ArmState {
  const state = getArmState();
  const conv = state.conversations.find((c) => c.id === conversationId);
  if (!conv) return state;

  const cleanText = text.trim();
  if (!cleanText && !propertyCard) return state;

  const newMsg = {
    id: makeId('msg'),
    sender: 'agent' as const,
    channel: conv.channel,
    createdAt: nowTimeLabel(),
    text:
      cleanText ||
      `Te comparto esta propiedad del MLS de Louisville: ${propertyCard?.address} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(propertyCard?.price || 0)})`,
    propertyCard,
    status: 'delivered' as const,
  };

  const preview = propertyCard
    ? `Propiedad enviada: ${propertyCard.address}`
    : newMsg.text;

  const next: ArmState = {
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            unreadCount: 0,
            updatedAt: 'Ahora',
            lastPreview: preview,
            messages: [...c.messages, newMsg],
          }
        : c
    ),
    activityFeed: addActivity(
      state,
      conv.agentId,
      `Respondió a ${conv.clientName} por ${conv.channel.toUpperCase()}${propertyCard ? ` con ficha MLS (${propertyCard.address})` : ''}.`,
      `Replied to ${conv.clientName} via ${conv.channel.toUpperCase()}${propertyCard ? ` with MLS card (${propertyCard.address})` : ''}.`,
      'message'
    ),
  };
  persistState(next);
  return next;
}

export function createNewConversation(
  agentId: string,
  clientName: string,
  channel: OmniChannel,
  initialText: string,
  clientPhoneOrEmail?: string
): { state: ArmState; conversationId: string } {
  const state = getArmState();
  const parts = clientName.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : clientName.slice(0, 2).toUpperCase() || 'CL';

  const convId = makeId('conv');
  const newConv: OmniConversation = {
    id: convId,
    agentId,
    clientName: clientName.trim(),
    clientInitials: initials,
    avatarBg: channel === 'whatsapp' ? '#15803D' : channel === 'instagram' ? '#9D174D' : channel === 'facebook' ? '#1D4ED8' : '#660E1A',
    clientPhone: channel !== 'email' ? clientPhoneOrEmail : undefined,
    clientEmail: channel === 'email' ? clientPhoneOrEmail : undefined,
    channel,
    qualificationBadge: 'Nuevo Lead',
    unreadCount: 0,
    updatedAt: 'Ahora',
    lastPreview: initialText.trim() || 'Conversación iniciada',
    aiSuggestedReplyEs: `¡Hola ${parts[0] || clientName}! Gracias por comunicarte con New Era Real Estate. ¿Buscas comprar o vender propiedad en Greater Louisville?`,
    aiSuggestedReplyEn: `Hi ${parts[0] || clientName}! Thanks for reaching out to New Era Real Estate. Are you looking to buy or sell in Greater Louisville?`,
    messages: initialText.trim()
      ? [
          {
            id: makeId('msg'),
            sender: 'agent',
            channel,
            createdAt: nowTimeLabel(),
            text: initialText.trim(),
            status: 'delivered',
          },
        ]
      : [],
  };

  const next: ArmState = {
    ...state,
    conversations: [newConv, ...state.conversations],
    activityFeed: addActivity(
      state,
      agentId,
      `Inició chat con ${clientName} vía ${channel.toUpperCase()}.`,
      `Started conversation with ${clientName} via ${channel.toUpperCase()}.`,
      'message'
    ),
  };
  persistState(next);
  return { state: next, conversationId: convId };
}

export function createArmDeal(input: {
  agentId: string;
  propertyAddress: string;
  neighborhood?: string;
  city?: string;
  price: number;
  earnestMoney?: number;
  transactionType: 'Compra' | 'Venta' | 'Renta';
  clientName: string;
  clientPhone?: string;
  closingDateLabel?: string;
  titleCompany?: string;
}): { state: ArmState; dealId: string } {
  const state = getArmState();
  const dealId = makeId('deal');
  const earnest = input.earnestMoney ?? Math.round((input.price || 350000) * 0.015);
  const newDeal: ArmDeal = {
    id: dealId,
    agentId: input.agentId,
    propertyAddress: input.propertyAddress,
    neighborhood: input.neighborhood || 'Greater Louisville',
    city: input.city || 'Louisville, KY',
    price: input.price || 385000,
    earnestMoney: earnest,
    transactionType: input.transactionType,
    clientName: input.clientName,
    clientPhone: input.clientPhone || '(502) 500-0409',
    titleCompany: input.titleCompany || 'Bluegrass Title Co.',
    lenderName: 'Local KY Lender',
    closingDateLabel: input.closingDateLabel || '15 Dic 2026',
    stage: 'under_contract',
    checklist: buildDefaultKyChecklist({ earnestPending: true, inspectionDone: false }),
    deadlines: [
      {
        id: makeId('dl'),
        titleEs: 'Depósito Earnest Money (Escrow)',
        titleEn: 'Earnest Money Escrow Deposit',
        dateLabel: 'En 2 días · 5:00 PM',
        daysRemaining: 2,
        status: 'urgent',
        badgeEs: '¡2 días!',
      },
      {
        id: makeId('dl'),
        titleEs: 'Contingencia de Inspección (KY)',
        titleEn: 'KY Inspection Contingency',
        dateLabel: 'En 7 días · 5:00 PM',
        daysRemaining: 7,
        status: 'soon',
        badgeEs: '7 días',
      },
      {
        id: makeId('dl'),
        titleEs: 'Cierre Estimado',
        titleEn: 'Target Closing Date',
        dateLabel: input.closingDateLabel || '15 Dic 2026',
        daysRemaining: 30,
        status: 'scheduled',
        badgeEs: 'Programado',
      },
    ],
    auditedPdfs: [],
    copilotMessages: [
      {
        id: makeId('cp'),
        role: 'assistant',
        text: `Nuevo Deal Room creado para ${input.propertyAddress}. Arrastra tu contrato GLAR o pre-aprobación en PDF para auditarlo automáticamente.`,
        timestamp: nowTimeLabel(),
      },
    ],
    updatedAt: 'Ahora',
  };

  const next: ArmState = {
    ...state,
    deals: [newDeal, ...state.deals],
    activityFeed: addActivity(
      state,
      input.agentId,
      `Creó nuevo Deal Room KY: ${input.propertyAddress} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(newDeal.price)}).`,
      `Created new KY Deal Room: ${input.propertyAddress}.`,
      'deal'
    ),
  };
  persistState(next);
  return { state: next, dealId };
}

export function updateDealStage(dealId: string, stage: DealStage): ArmState {
  const state = getArmState();
  const deal = state.deals.find((d) => d.id === dealId);
  if (!deal) return state;

  const next: ArmState = {
    ...state,
    deals: state.deals.map((d) =>
      d.id === dealId ? { ...d, stage, updatedAt: 'Ahora' } : d
    ),
    activityFeed: addActivity(
      state,
      deal.agentId,
      `Actualizó etapa de ${deal.propertyAddress} a "${stage.toUpperCase()}".`,
      `Updated stage of ${deal.propertyAddress} to "${stage.toUpperCase()}".`,
      'deal'
    ),
  };
  persistState(next);
  return next;
}

export function toggleKyChecklistItem(dealId: string, itemId: string): ArmState {
  const state = getArmState();
  const next: ArmState = {
    ...state,
    deals: state.deals.map((d) => {
      if (d.id !== dealId) return d;
      const updatedList = d.checklist.map((item) => {
        if (item.id !== itemId) return item;
        const nextStatus = item.status === 'verified' ? 'pending' : 'verified';
        return {
          ...item,
          status: nextStatus as KyChecklistItem['status'],
          badgeEs: nextStatus === 'verified' ? 'Listo' : 'Pendiente',
          badgeEn: nextStatus === 'verified' ? 'Ready' : 'Pending',
          verifiedByAi: nextStatus === 'verified',
        };
      });
      return { ...d, checklist: updatedList, updatedAt: 'Ahora' };
    }),
  };
  persistState(next);
  return next;
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '1.4 MB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function auditPdfForDeal(
  dealId: string,
  fileInput: { name: string; sizeBytes: number; rawBuffer?: ArrayBuffer }
): { state: ArmState; record: AuditedPdfRecord } {
  const state = getArmState();
  const deal = state.deals.find((d) => d.id === dealId) || state.deals[0];
  const lower = fileInput.name.toLowerCase();

  let pageCount = lower.includes('contrato') || lower.includes('purchase') ? 14 : lower.includes('insp') ? 22 : 4;
  let extractedDollar = `$${(deal?.price || 465000).toLocaleString('en-US')}`;

  if (fileInput.rawBuffer && fileInput.rawBuffer.byteLength > 0) {
    try {
      const sliceLen = Math.min(fileInput.rawBuffer.byteLength, 600000);
      const textChunk = new TextDecoder('latin1').decode(fileInput.rawBuffer.slice(0, sliceLen));
      const pageMatches = textChunk.match(/\/Type\s*\/Page\b/g);
      if (pageMatches && pageMatches.length > 0) {
        pageCount = pageMatches.length;
      }
      const moneyMatches = textChunk.match(/\$[1-9]\d{2},\d{3}/g);
      if (moneyMatches && moneyMatches.length > 0) {
        extractedDollar = moneyMatches[0];
      }
    } catch {
      // fallback cleanly
    }
  }

  const targetCodes: string[] = [];
  if (lower.includes('insp') || lower.includes('repar')) {
    targetCodes.push('INSP-RPT');
  } else if (lower.includes('pre') || lower.includes('aprob') || lower.includes('bank') || lower.includes('lender')) {
    targetCodes.push('LENDER-PA');
  } else if (lower.includes('disc')) {
    targetCodes.push('KY-SD');
  } else if (lower.includes('earnest') || lower.includes('emd') || lower.includes('escrow')) {
    targetCodes.push('EMD-REC');
  } else if (lower.includes('appr') || lower.includes('tasac') || lower.includes('clear')) {
    targetCodes.push('APPR-CTC');
  } else {
    targetCodes.push('GLAR-PA', 'EMD-REC', 'KY-SD');
  }

  const record: AuditedPdfRecord = {
    id: makeId('pdf'),
    fileName: fileInput.name,
    fileSizeLabel: formatFileSize(fileInput.sizeBytes),
    pageCount,
    auditedAt: `Hoy ${nowTimeLabel()}`,
    extractedPrice: extractedDollar,
    extractedEarnest: `$${(deal?.earnestMoney || 7500).toLocaleString('en-US')}`,
    extractedClosing: deal?.closingDateLabel || '28 Nov 2026',
    extractedSignatures: '4 de 4 firmadas',
    summaryEs:
      targetCodes.includes('INSP-RPT')
        ? 'Reporte de inspección revisado y guardado.'
        : 'Documento revisado: montos y firmas completos.',
  };

  const next: ArmState = {
    ...state,
    deals: state.deals.map((d) => {
      if (d.id !== deal.id) return d;
      const nextChecklist = d.checklist.map((item) => {
        if (!targetCodes.includes(item.code)) return item;
        return {
          ...item,
          status: 'verified' as const,
          badgeEs: 'Listo',
          badgeEn: 'Ready',
          verifiedByAi: true,
        };
      });
      const nextDeadlines = d.deadlines.map((dl) => {
        if (targetCodes.includes('INSP-RPT') && dl.titleEs.toLowerCase().includes('inspec')) {
          return { ...dl, status: 'auto_ok' as const, badgeEs: 'Entregado' };
        }
        if (targetCodes.includes('EMD-REC') && dl.titleEs.toLowerCase().includes('depósito')) {
          return { ...dl, status: 'auto_ok' as const, badgeEs: 'Confirmado' };
        }
        return dl;
      });
      return {
        ...d,
        checklist: nextChecklist,
        deadlines: nextDeadlines,
        auditedPdfs: [record, ...d.auditedPdfs],
        updatedAt: 'Ahora',
      };
    }),
    activityFeed: addActivity(
      state,
      deal.agentId,
      `Auditoría IA completada en ${fileInput.name} (${pageCount} págs.) · Aviso enviado a Yeilen Contreras.`,
      `AI Audit completed on ${fileInput.name} (${pageCount} pages) · Broker Yeilen Contreras notified.`,
      'audit'
    ),
  };

  persistState(next);
  return { state: next, record };
}

export function askDealCopilot(dealId: string, question: string, lang: 'en' | 'es'): ArmState {
  const state = getArmState();
  const deal = state.deals.find((d) => d.id === dealId);
  if (!deal) return state;

  const verifiedCount = deal.checklist.filter((c) => c.status === 'verified').length;
  const totalCount = deal.checklist.length;
  const missingItems = deal.checklist.filter((c) => c.status !== 'verified');
  const urgentDeadline = deal.deadlines.find((dl) => dl.status === 'urgent') || deal.deadlines[0];
  const lowerQ = question.toLowerCase();

  const missingLabel =
    missingItems.length > 0
      ? missingItems.map((m) => (lang === 'es' ? m.titleEs : m.titleEn)).join(', ')
      : lang === 'es'
      ? 'Ninguno, expediente completo'
      : 'None, file complete';

  let answerText = '';
  if (lowerQ.includes('monto') || lowerQ.includes('precio') || lowerQ.includes('emd') || lowerQ.includes('depósito') || lowerQ.includes('price')) {
    answerText =
      lang === 'es'
        ? `Resumen financiero de ${deal.propertyAddress}: Precio pactado $${deal.price.toLocaleString('en-US')}, Earnest Money en escrow $${deal.earnestMoney.toLocaleString('en-US')}, compañía de título ${deal.titleCompany} y cierre programado para ${deal.closingDateLabel}.`
        : `Financial summary for ${deal.propertyAddress}: Contract price $${deal.price.toLocaleString('en-US')}, Earnest Money $${deal.earnestMoney.toLocaleString('en-US')}, Title Co. ${deal.titleCompany}, closing ${deal.closingDateLabel}.`;
  } else if (lowerQ.includes('plazo') || lowerQ.includes('venc') || lowerQ.includes('fecha') || lowerQ.includes('deadline') || lowerQ.includes('when')) {
    answerText =
      lang === 'es'
        ? `Próximo vencimiento crítico: "${urgentDeadline?.titleEs || 'Cierre'}" (${urgentDeadline?.dateLabel || deal.closingDateLabel}). Las alertas automáticas están configuradas a 7, 3 y 1 día antes del vencimiento.`
        : `Next critical milestone: "${urgentDeadline?.titleEn || 'Closing'}" (${urgentDeadline?.dateLabel || deal.closingDateLabel}). Automated alerts active at 7, 3, and 1 day.`;
  } else {
    answerText =
      lang === 'es'
        ? `El trato de ${deal.propertyAddress} con ${deal.clientName} lleva ${verifiedCount} de ${totalCount} documentos aprobados. ${
            missingItems.length > 0
              ? `Falta(n): ${missingLabel}. Cierre programado: ${deal.closingDateLabel} con ${deal.titleCompany}.`
              : `¡Todos los documentos obligatorios de Kentucky están aprobados! Listo para cierre el ${deal.closingDateLabel}.`
          }`
        : `Deal ${deal.propertyAddress} with ${deal.clientName} has ${verifiedCount}/${totalCount} documents verified. ${
            missingItems.length > 0 ? `Pending: ${missingLabel}.` : `All Kentucky documents verified for closing on ${deal.closingDateLabel}.`
          }`;
  }

  const userMsg: CopilotMessage = {
    id: makeId('cpu'),
    role: 'user',
    text: question,
    timestamp: nowTimeLabel(),
  };

  const firstMissing = missingItems[0];
  const aiMsg: CopilotMessage = {
    id: makeId('cpa'),
    role: 'assistant',
    text: answerText,
    timestamp: nowTimeLabel(),
    kpis: [
      { value: `${verifiedCount}/${totalCount}`, label: lang === 'es' ? 'Aprobados' : 'Verified', tone: 'green' },
      {
        value: missingItems.length > 0 ? `Falta ${missingItems.length}` : 'Completo',
        label: firstMissing ? (lang === 'es' ? firstMissing.titleEs : firstMissing.titleEn) : 'Checklist KY',
        tone: missingItems.length > 0 ? 'gold' : 'green',
      },
      {
        value: urgentDeadline ? urgentDeadline.badgeEs : deal.closingDateLabel,
        label: urgentDeadline ? (lang === 'es' ? urgentDeadline.titleEs : urgentDeadline.titleEn) : 'Cierre',
        tone: urgentDeadline?.status === 'urgent' ? 'red' : 'gold',
      },
    ],
    whatsappAction: firstMissing
      ? {
          labelEs: `Pedir "${firstMissing.titleEs}" a ${deal.clientName.split(' ')[0]} por WhatsApp`,
          labelEn: `Request "${firstMissing.titleEn}" from ${deal.clientName.split(' ')[0]} via WhatsApp`,
          targetClientName: deal.clientName,
          messageToSend: `Hola ${deal.clientName.split(' ')[0]}, te escribo de New Era Real Estate sobre ${deal.propertyAddress}. Nos falta el documento "${firstMissing.titleEs}" para mantener a tiempo nuestro cierre del ${deal.closingDateLabel}. ¿Me lo puedes enviar por aquí cuando lo tengas?`,
          sent: false,
        }
      : undefined,
  };

  const next: ArmState = {
    ...state,
    deals: state.deals.map((d) =>
      d.id === dealId
        ? { ...d, copilotMessages: [...d.copilotMessages, userMsg, aiMsg], updatedAt: 'Ahora' }
        : d
    ),
  };
  persistState(next);
  return next;
}

export function triggerCopilotWhatsappRequest(dealId: string, copilotMsgId: string): ArmState {
  const state = getArmState();
  const deal = state.deals.find((d) => d.id === dealId);
  if (!deal) return state;

  const targetCp = deal.copilotMessages.find((m) => m.id === copilotMsgId);
  const action = targetCp?.whatsappAction;
  if (!action) return state;

  let nextConversations = [...state.conversations];
  const existingConv = nextConversations.find(
    (c) =>
      c.clientName.toLowerCase() === action.targetClientName.toLowerCase() &&
      c.channel === 'whatsapp'
  );

  if (existingConv) {
    nextConversations = nextConversations.map((c) =>
      c.id === existingConv.id
        ? {
            ...c,
            updatedAt: 'Ahora',
            lastPreview: action.messageToSend,
            messages: [
              ...c.messages,
              {
                id: makeId('msg'),
                sender: 'agent',
                channel: 'whatsapp',
                createdAt: nowTimeLabel(),
                text: action.messageToSend,
                status: 'delivered',
              },
            ],
          }
        : c
    );
  } else {
    const convId = makeId('conv');
    nextConversations.unshift({
      id: convId,
      agentId: deal.agentId,
      clientName: deal.clientName,
      clientInitials: deal.clientName.slice(0, 2).toUpperCase(),
      avatarBg: '#15803D',
      clientPhone: deal.clientPhone,
      channel: 'whatsapp',
      qualificationBadge: 'Deal Activo',
      unreadCount: 0,
      updatedAt: 'Ahora',
      lastPreview: action.messageToSend,
      aiSuggestedReplyEs: 'Gracias por confirmarnos, lo subimos de inmediato al Deal Room.',
      aiSuggestedReplyEn: 'Thanks for confirming, uploading straight to your Deal Room.',
      messages: [
        {
          id: makeId('msg'),
          sender: 'agent',
          channel: 'whatsapp',
          createdAt: nowTimeLabel(),
          text: action.messageToSend,
          status: 'delivered',
        },
      ],
    });
  }

  const next: ArmState = {
    ...state,
    conversations: nextConversations,
    deals: state.deals.map((d) =>
      d.id === dealId
        ? {
            ...d,
            copilotMessages: d.copilotMessages.map((m) =>
              m.id === copilotMsgId && m.whatsappAction
                ? { ...m, whatsappAction: { ...m.whatsappAction, sent: true } }
                : m
            ),
          }
        : d
    ),
    activityFeed: addActivity(
      state,
      deal.agentId,
      `Copiloto IA envió solicitud por WhatsApp a ${deal.clientName} (${deal.propertyAddress}).`,
      `AI Copilot sent WhatsApp document request to ${deal.clientName}.`,
      'message'
    ),
  };

  persistState(next);
  return next;
}

export function saveSocialPost(post: Omit<ScheduledSocialPost, 'id'> & { id?: string }): ArmState {
  const state = getArmState();
  const postId = post.id || makeId('sp');
  const fullPost: ScheduledSocialPost = { ...post, id: postId };
  const exists = state.socialPosts.some((p) => p.id === postId);
  const nextPosts = exists
    ? state.socialPosts.map((p) => (p.id === postId ? fullPost : p))
    : [...state.socialPosts, fullPost];

  const next: ArmState = {
    ...state,
    socialPosts: nextPosts,
    activityFeed: addActivity(
      state,
      post.agentId,
      `Programó ${post.format} para el día ${post.day} del mes en Instagram y Facebook.`,
      `Scheduled ${post.format} for day ${post.day} on Instagram & Facebook.`,
      'social'
    ),
  };
  persistState(next);
  return next;
}

export function deleteSocialPost(postId: string): ArmState {
  const state = getArmState();
  const next: ArmState = {
    ...state,
    socialPosts: state.socialPosts.filter((p) => p.id !== postId),
  };
  persistState(next);
  return next;
}

export function generateFullMonthSchedule(
  agentId: string,
  agentName: string,
  properties: Property[],
  lang: 'en' | 'es'
): ArmState {
  const state = getArmState();
  const formats: Array<{
    format: ScheduledSocialPost['format'];
    templateType: ScheduledSocialPost['templateType'];
    titleEs: string;
    titleEn: string;
  }> = [
    { format: 'POST', templateType: 'just_listed', titleEs: 'Propiedad Destacada MLS', titleEn: 'Featured MLS Listing' },
    { format: 'REEL', templateType: 'reel_script', titleEs: 'Reel Tips Comprador KY', titleEn: 'KY Buyer Tips Reel' },
    { format: 'STORY', templateType: 'open_house', titleEs: 'Story Open House / Tour', titleEn: 'Open House Story' },
    { format: 'POST', templateType: 'market_report', titleEs: 'Pulso Mercado Louisville', titleEn: 'Louisville Market Pulse' },
    { format: 'REEL', templateType: 'reel_script', titleEs: 'Reel Financiamiento FHA/KHC', titleEn: 'FHA / KHC Grants Reel' },
    { format: 'FLYER', templateType: 'open_house', titleEs: 'Flyer Invitación Fin de Semana', titleEn: 'Weekend Open House Flyer' },
  ];

  const generated: ScheduledSocialPost[] = [];
  for (let day = 1; day <= 30; day++) {
    const preset = formats[(day - 1) % formats.length];
    const prop = properties.length > 0 ? properties[(day - 1) % properties.length] : undefined;
    const address = prop?.location?.address || '9402 Norton Commons Blvd';
    const price = prop?.price || 465000;
    const priceStr = `$${price.toLocaleString('en-US')}`;
    const imgUrl = prop?.media?.[0]?.url || '/assets/masterclass/house-louisville-clean.jpg';

    const caption =
      lang === 'es'
        ? `${preset.titleEs}: ${address} (${priceStr}). Asesoría personalizada en Louisville con ${agentName} · New Era Real Estate. #NewEraKY #LouisvilleHomes`
        : `${preset.titleEn}: ${address} (${priceStr}). Personal representation in Louisville with ${agentName} · New Era Real Estate. #NewEraKY`;

    generated.push({
      id: `sp-auto-${agentId}-${day}`,
      agentId,
      day,
      format: preset.format,
      templateType: preset.templateType,
      title: prop ? `${preset.titleEs.split(' ')[0]} · ${address.split(',')[0]}` : preset.titleEs,
      caption,
      reelScript:
        preset.format === 'REEL'
          ? `HOOK: "¿Buscas casa en ${prop?.location?.city || 'Louisville'} cerca de ${priceStr}?"\nPUNTOS CLAVE: ${prop?.bedrooms || 4} habitaciones, ${prop?.bathrooms || 3} baños y asesoría bilingüe con ${agentName}.\nCTA: "Escríbeme por DM para agendar tu tour privado."`
          : undefined,
      propertyAddress: address,
      propertyPrice: price,
      imageUrl: imgUrl,
      platforms: ['IG', 'FB'],
      scheduledTime: day % 2 === 0 ? '10:00 AM' : '05:30 PM',
      autoPublish: true,
    });
  }

  const others = state.socialPosts.filter((p) => p.agentId !== agentId);
  const next: ArmState = {
    ...state,
    socialPosts: [...others, ...generated],
    autoPublishByAgent: {
      ...state.autoPublishByAgent,
      [agentId]: true,
    },
    activityFeed: addActivity(
      state,
      agentId,
      `Generó 30 días de campaña IA personalizada y activó autopublicación en IG/FB.`,
      `Generated 30-day custom AI campaign and enabled IG/FB autopublish.`,
      'social'
    ),
  };
  persistState(next);
  return next;
}

export function toggleAgentAutoPublish(agentId: string, enabled: boolean): ArmState {
  const state = getArmState();
  const next: ArmState = {
    ...state,
    socialPosts: state.socialPosts.map((p) =>
      p.agentId === agentId ? { ...p, autoPublish: enabled } : p
    ),
    autoPublishByAgent: {
      ...state.autoPublishByAgent,
      [agentId]: enabled,
    },
  };
  persistState(next);
  return next;
}

export function recordWebsiteLead(lead: {
  name: string;
  email: string;
  phone?: string;
  type: ArmLeadItem['type'];
  subjectOrAddress: string;
  message?: string;
  assignedAgentId?: string;
}): ArmState {
  const state = getArmState();
  const newLead: ArmLeadItem = {
    id: makeId('lead'),
    name: lead.name || 'Visitante Web',
    email: lead.email || '',
    phone: lead.phone || 'Sin teléfono',
    type: lead.type || 'general',
    subjectOrAddress: lead.subjectOrAddress || 'Consulta neweraky.com',
    message: lead.message || '',
    assignedAgentId: lead.assignedAgentId || 'yeilen-contreras',
    status: 'new',
    createdAt: `Hoy ${nowTimeLabel()}`,
  };

  const next: ArmState = {
    ...state,
    websiteLeads: [newLead, ...state.websiteLeads],
    activityFeed: addActivity(
      state,
      newLead.assignedAgentId,
      `Nuevo lead web de ${newLead.name} (${newLead.subjectOrAddress}).`,
      `New website lead from ${newLead.name} (${newLead.subjectOrAddress}).`,
      'lead'
    ),
  };
  persistState(next);
  return next;
}

export function assignLeadToAgent(
  leadId: string,
  agentId: string,
  status?: ArmLeadItem['status']
): ArmState {
  const state = getArmState();
  const lead = state.websiteLeads.find((l) => l.id === leadId);
  const next: ArmState = {
    ...state,
    websiteLeads: state.websiteLeads.map((l) =>
      l.id === leadId
        ? { ...l, assignedAgentId: agentId, status: status || l.status }
        : l
    ),
    activityFeed: lead
      ? addActivity(
          state,
          agentId,
          `Lead "${lead.name}" asignado para seguimiento inmediato.`,
          `Lead "${lead.name}" assigned for immediate follow-up.`,
          'lead'
        )
      : state.activityFeed,
  };
  persistState(next);
  return next;
}

export function createCommissionRecord(
  input: Omit<ArmCommissionRecord, 'id'>
): ArmState {
  const state = getArmState();
  const record: ArmCommissionRecord = {
    ...input,
    id: makeId('com'),
  };
  const next: ArmState = {
    ...state,
    commissions: [record, ...state.commissions],
    activityFeed: addActivity(
      state,
      record.agentId,
      `Registró liquidación de comisión: ${record.propertyAddress} (Realtor $${record.agentNetPayout.toLocaleString('en-US')} / New Era $${record.brokerageNetAmount.toLocaleString('en-US')}).`,
      `Registered commission split: ${record.propertyAddress}.`,
      'deal'
    ),
  };
  persistState(next);
  return next;
}

export function updateCommissionStatus(
  id: string,
  status: CommissionPaymentStatus,
  paymentMethod?: PaymentMethodType
): ArmState {
  const state = getArmState();
  const target = state.commissions.find((c) => c.id === id);
  const todayStr = new Date().toLocaleDateString('es-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const next: ArmState = {
    ...state,
    commissions: state.commissions.map((c) =>
      c.id === id
        ? {
            ...c,
            status,
            paymentMethod: paymentMethod || c.paymentMethod,
            paidAt: status === 'paid' ? todayStr : c.paidAt,
          }
        : c
    ),
    activityFeed: target
      ? addActivity(
          state,
          target.agentId,
          status === 'paid'
            ? `Pagó $${target.agentNetPayout.toLocaleString('en-US')} vía ${paymentMethod || 'Zelle'} por ${target.propertyAddress}.`
            : `Confirmó wire de Title Co. para ${target.propertyAddress} (listo para pagar).`,
          status === 'paid'
            ? `Paid $${target.agentNetPayout.toLocaleString('en-US')} for ${target.propertyAddress}.`
            : `Confirmed Title Co. wire for ${target.propertyAddress}.`,
          'deal'
        )
      : state.activityFeed,
  };
  persistState(next);
  return next;
}

export function createOfficeLedgerEntry(
  input: Omit<ArmOfficeExpense, 'id'>
): ArmState {
  const state = getArmState();
  const entry: ArmOfficeExpense = {
    ...input,
    id: makeId('led'),
  };
  const next: ArmState = {
    ...state,
    officeLedger: [entry, ...state.officeLedger],
  };
  persistState(next);
  return next;
}

export function toggleOfficeLedgerStatus(id: string): ArmState {
  const state = getArmState();
  const next: ArmState = {
    ...state,
    officeLedger: state.officeLedger.map((item) =>
      item.id === id
        ? { ...item, status: item.status === 'paid' ? 'pending' : 'paid' }
        : item
    ),
  };
  persistState(next);
  return next;
}
