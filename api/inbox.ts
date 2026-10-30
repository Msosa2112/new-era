import { Resend } from 'resend';
import crypto from 'crypto';

type VercelRequest = any;
type VercelResponse = any;

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';
const RESEND_AUDIENCE_ID = '6eaef17a-2346-4274-9f93-ba05379c9091';
const SECRET_SALT = (RESEND_API_KEY || 'newera-secret-2026') + '-inbox-hmac-v1';
const MASTER_ADMIN_PINS = ['newera2026', 'admin2026', 'NewEra2026'];

interface AgentDirectoryEntry {
  id: string;
  name: string;
  title: string;
  licenseNumber?: string;
  phone: string;
  corporateEmail: string;
  personalEmail: string;
  defaultPin: string;
  photoUrl: string;
  isOfficeAdmin?: boolean;
}

const AGENTS_DIRECTORY: AgentDirectoryEntry[] = [
  { id: 'yeilen-contreras', name: 'Yeilen Contreras', title: 'Principal Broker', licenseNumber: '302425', phone: '(502) 500-0409', corporateEmail: 'yeilen@neweraky.com', personalEmail: 'newerabroker25@gmail.com', defaultPin: '0409', photoUrl: 'https://www.neweraky.com/assets/agents/yeilen-contreras.jpg', isOfficeAdmin: true },
  { id: 'rebeca-lopez-portuondo', name: 'Rebeca Lopez', title: 'Administrative Assistant', phone: '(502) 658-4492', corporateEmail: 'rebeca@neweraky.com', personalEmail: 'office25newera@gmail.com', defaultPin: '4492', photoUrl: 'https://www.neweraky.com/assets/agents/rebeca-lopez-portuondo.jpg', isOfficeAdmin: true },
  { id: 'yazbel-diaz', name: 'Yazbel Diaz', title: 'Licensed REALTOR®', licenseNumber: '268934', phone: '(502) 956-3177', corporateEmail: 'yazbel@neweraky.com', personalEmail: 'Yazbelrealtor@gmail.com', defaultPin: '3177', photoUrl: 'https://www.neweraky.com/assets/agents/yazbel-diaz.jpg' },
  { id: 'darien-hernandez', name: 'Darien Hernandez', title: 'Licensed REALTOR®', phone: '(502) 389-2234', corporateEmail: 'darien@neweraky.com', personalEmail: 'newerarealestateky@gmail.com', defaultPin: '2234', photoUrl: 'https://www.neweraky.com/assets/agents/darien-hernandez.jpg' },
  { id: 'yenny-mendoza-molina', name: 'Yenny Mendoza', title: 'Licensed REALTOR®', licenseNumber: '286756', phone: '(502) 356-4187', corporateEmail: 'yenny@neweraky.com', personalEmail: 'Yennymm1997@gmail.com', defaultPin: '4187', photoUrl: 'https://www.neweraky.com/assets/agents/yenny-mendoza-molina.jpg' },
  { id: 'dianelis-segrea-castellon', name: 'Dianelis Segrea', title: 'Licensed REALTOR®', licenseNumber: '303315', phone: '(502) 249-4050', corporateEmail: 'dianelis@neweraky.com', personalEmail: 'dianelis.realtor@gmail.com', defaultPin: '4050', photoUrl: 'https://www.neweraky.com/assets/agents/dianelis-segrea-castellon.jpg' },
  { id: 'marien-rodriguez-reyes', name: 'Marien Rodriguez', title: 'Licensed REALTOR®', licenseNumber: '298140', phone: '(502) 565-5401', corporateEmail: 'marien@neweraky.com', personalEmail: 'marienrodriguez7908@gmail.com', defaultPin: '5401', photoUrl: 'https://www.neweraky.com/assets/agents/marien-rodriguez-reyes.jpg' },
  { id: 'claudia-aguilera-cuenca', name: 'Claudia Aguilera', title: 'Licensed REALTOR®', licenseNumber: '310109', phone: '(502) 389-6889', corporateEmail: 'claudia@neweraky.com', personalEmail: 'claudiaguilera1999@gmail.com', defaultPin: '6889', photoUrl: 'https://www.neweraky.com/assets/agents/claudia-aguilera-cuenca.jpg' },
  { id: 'javier-ferrer-rodriguez', name: 'Javier Ferrer', title: 'Licensed REALTOR®', licenseNumber: '308704', phone: '(502) 281-1462', corporateEmail: 'javier@neweraky.com', personalEmail: 'Javferrer96@gmail.com', defaultPin: '1462', photoUrl: 'https://www.neweraky.com/assets/agents/javier-ferrer-rodriguez.jpg' },
  { id: 'leidys-herrera', name: 'Leidys Herrera', title: 'Licensed REALTOR®', licenseNumber: '245387', phone: '(502) 356-7264', corporateEmail: 'leidys@neweraky.com', personalEmail: 'lhtopagent@gmail.com', defaultPin: '7264', photoUrl: 'https://www.neweraky.com/assets/agents/leidys-herrera.jpg' },
  { id: 'dahana-aguila', name: 'Dahana Aguila', title: 'Licensed REALTOR®', licenseNumber: '311049', phone: '(502) 650-5926', corporateEmail: 'dahana@neweraky.com', personalEmail: 'Dahanaaguila@gmail.com', defaultPin: '5926', photoUrl: 'https://www.neweraky.com/assets/agents/dahana-aguila.jpg' },
  { id: 'karla-fernandez-soto', name: 'Karla Fernandez', title: 'Licensed REALTOR®', licenseNumber: '304851', phone: '(502) 676-8141', corporateEmail: 'karla@neweraky.com', personalEmail: 'Karlafsoto26@gmail.com', defaultPin: '8141', photoUrl: 'https://www.neweraky.com/assets/agents/karla-fernandez-soto.jpg' },
  { id: 'geraldine-santiago-then', name: 'Geraldine Santiago', title: 'Licensed REALTOR®', licenseNumber: '289628', phone: '(502) 321-0671', corporateEmail: 'geraldine@neweraky.com', personalEmail: 'Geraldine10realtor@gmail.com', defaultPin: '0671', photoUrl: 'https://www.neweraky.com/assets/agents/geraldine-santiago-then.jpg' },
  { id: 'lizandra-parra-rodriguez', name: 'Lizandra Parra', title: 'Licensed REALTOR®', licenseNumber: '311105', phone: '(786) 818-8531', corporateEmail: 'lizandra@neweraky.com', personalEmail: 'realestate@lizandraparra.com', defaultPin: '8531', photoUrl: 'https://www.neweraky.com/assets/agents/lizandra-parra-rodriguez.jpg' },
  { id: 'yisel-pupo', name: 'Yisel Pupo', title: 'Licensed REALTOR®', licenseNumber: '305523', phone: '(502) 643-9265', corporateEmail: 'yisel@neweraky.com', personalEmail: 'yiselatnewera@gmail.com', defaultPin: '9265', photoUrl: 'https://www.neweraky.com/assets/agents/yisel-pupo.jpg' },
  { id: 'solanch-rodriguez-curbeira', name: 'Solanch Rodríguez', title: 'Licensed REALTOR®', licenseNumber: '306436', phone: '(502) 240-8463', corporateEmail: 'solanch@neweraky.com', personalEmail: 'Solanchrodriguez.realtor@gmail.com', defaultPin: '8463', photoUrl: 'https://www.neweraky.com/assets/agents/solanch-rodriguez-curbeira.jpg' },
  { id: 'albin-machado-campo', name: 'Albin Machado', title: 'Licensed REALTOR®', licenseNumber: '307238', phone: '(502) 701-4699', corporateEmail: 'albin@neweraky.com', personalEmail: 'albinmm2005@gmail.com', defaultPin: '4699', photoUrl: 'https://www.neweraky.com/assets/agents/albin-machado-campo.jpg' },
  { id: 'ivonne-medina', name: 'Ivonne Medina', title: 'Licensed REALTOR®', licenseNumber: '307711', phone: '(502) 202-7557', corporateEmail: 'ivonne@neweraky.com', personalEmail: 'ivon.ori@icloud.com', defaultPin: '7557', photoUrl: 'https://www.neweraky.com/assets/agents/ivonne-medina.jpg' },
  { id: 'maria-mendez', name: 'Maria Méndez', title: 'Licensed REALTOR®', licenseNumber: '251631', phone: '(305) 923-7367', corporateEmail: 'maria@neweraky.com', personalEmail: 'mtm60bayona@gmail.com', defaultPin: '7367', photoUrl: 'https://www.neweraky.com/assets/agents/maria-mendez.jpg' },
  { id: 'rosa-mustelier-jimenez', name: 'Rosa Mustelier', title: 'Licensed REALTOR®', licenseNumber: '309143', phone: '(502) 909-7399', corporateEmail: 'rosa@neweraky.com', personalEmail: 'rosamustelierrealtor@gmail.com', defaultPin: '7399', photoUrl: 'https://www.neweraky.com/assets/agents/rosa-mustelier-jimenez.jpg' },
  { id: 'dayani-chavez', name: 'Dayani Chavez', title: 'Licensed REALTOR®', licenseNumber: '306338', phone: '(502) 500-0409', corporateEmail: 'dayani@neweraky.com', personalEmail: 'dayanichavez.realtor@gmail.com', defaultPin: '0409', photoUrl: 'https://www.neweraky.com/assets/agents/dayani-chavez.jpg' },
  { id: 'nina-gonzalez', name: 'Grisel (Nina) Gonzalez', title: 'Licensed REALTOR®', licenseNumber: '308875', phone: '(502) 500-9828', corporateEmail: 'nina@neweraky.com', personalEmail: 'Griselgonzalez.realtor@gmail.com', defaultPin: '9828', photoUrl: 'https://www.neweraky.com/assets/agents/nina-gonzalez.jpg' },
  { id: 'yordanis-alba-elias', name: 'Yordanis Alba', title: 'Licensed REALTOR®', licenseNumber: '307105', phone: '(786) 838-9751', corporateEmail: 'yordanis@neweraky.com', personalEmail: 'yalbarealty@gmail.com', defaultPin: '9751', photoUrl: 'https://www.neweraky.com/assets/agents/yordanis-alba-elias.jpg' },
  { id: 'stephanie-preciado', name: 'Stephanie Preciado', title: 'Licensed REALTOR®', licenseNumber: '283571', phone: '(502) 500-0409', corporateEmail: 'stephanie@neweraky.com', personalEmail: 'claudiakyrealtor@gmail.com', defaultPin: '0409', photoUrl: 'https://www.neweraky.com/assets/agents/stephanie-preciado.jpg' },
  { id: 'alejandro-robles', name: 'Alejandro Robles', title: 'Licensed REALTOR®', licenseNumber: '304383', phone: '(502) 630-9799', corporateEmail: 'alejandro@neweraky.com', personalEmail: 'Alex.realtorky@gmail.com', defaultPin: '9799', photoUrl: 'https://www.neweraky.com/assets/agents/alejandro-robles.jpg' },
  { id: 'esneider-ochoa', name: 'Esneider Ochoa', title: 'Licensed REALTOR®', phone: '(786) 899-1816', corporateEmail: 'esneider@neweraky.com', personalEmail: 'ky.realtor.ochoa@gmail.com', defaultPin: '1816', photoUrl: 'https://www.neweraky.com/assets/agents/esneider-ochoa.jpg' }
];

function findAgent(emailOrId: string): AgentDirectoryEntry | undefined {
  const q = (emailOrId || '').trim().toLowerCase();
  return AGENTS_DIRECTORY.find(
    (a) =>
      a.corporateEmail.toLowerCase() === q ||
      a.id.toLowerCase() === q ||
      a.corporateEmail.split('@')[0].toLowerCase() === q
  );
}

function signPayload(data: Record<string, any>): string {
  const json = JSON.stringify(data);
  const b64 = Buffer.from(json).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET_SALT).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

function verifyToken(token: string): Record<string, any> | null {
  if (!token || !token.includes('.')) return null;
  const [b64, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET_SALT).update(b64).digest('base64url');
  if (sig !== expected) return null;
  try {
    const parsed = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
    if (parsed.exp && Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function getResendStoredPinMap(): Promise<Record<string, { contactId: string; pin: string }>> {
  const map: Record<string, { contactId: string; pin: string }> = {};
  if (!RESEND_API_KEY) return map;
  try {
    const resp = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
    });
    if (!resp.ok) return map;
    const json = await resp.json();
    for (const c of json.data || []) {
      const email = String(c.email || '').toLowerCase().trim();
      const last = String(c.last_name || '');
      if (email && last.startsWith('PIN:')) {
        map[email] = { contactId: c.id, pin: last.slice(4).trim() };
      }
    }
  } catch (err) {
    console.warn('Error reading PINs from Resend Audience:', err);
  }
  return map;
}

async function saveAgentPinInResend(agent: AgentDirectoryEntry, newPin: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const resp = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: agent.corporateEmail.toLowerCase(),
        first_name: agent.name,
        last_name: `PIN:${newPin.trim()}`,
        unsubscribed: false
      })
    });
    return resp.ok;
  } catch (err) {
    console.error('Error saving PIN in Resend:', err);
    return false;
  }
}

function maskEmail(email: string): string {
  const [local, domain] = (email || '').split('@');
  if (!local || !domain) return email;
  if (local.length <= 3) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 3)}***${local.slice(-1)}@${domain}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const { action } = body;

    // 1. LOGIN
    if (action === 'login') {
      const { emailOrId = '', pin = '' } = body;
      const cleanPin = String(pin).trim();
      const agent = findAgent(emailOrId) || AGENTS_DIRECTORY[0];

      if (!cleanPin) {
        return res.status(400).json({ success: false, error: 'Ingresa tu PIN de acceso.' });
      }

      const isMasterPin = MASTER_ADMIN_PINS.includes(cleanPin);
      const pinMap = await getResendStoredPinMap();
      const storedPin = pinMap[agent.corporateEmail.toLowerCase()]?.pin || agent.defaultPin;

      if (!isMasterPin && cleanPin !== storedPin) {
        return res.status(401).json({
          success: false,
          error: 'PIN incorrecto. Recuerda que tu PIN inicial son los últimos 4 dígitos de tu teléfono, o usa "¿Olvidaste tu PIN?" para recibir un código en tu Gmail.'
        });
      }

      const isAdmin = isMasterPin || Boolean(agent.isOfficeAdmin);
      const token = signPayload({
        agentId: agent.id,
        corporateEmail: agent.corporateEmail,
        isAdmin,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 14 // 14 days
      });

      return res.status(200).json({
        success: true,
        token,
        isAdmin,
        agent: {
          ...agent,
          maskedPersonalEmail: maskEmail(agent.personalEmail)
        }
      });
    }

    // 2. REQUEST PIN RESET CODE (Sent to agent's personal Gmail/iCloud)
    if (action === 'request_pin_reset') {
      const { emailOrId = '' } = body;
      const agent = findAgent(emailOrId);
      if (!agent) {
        return res.status(404).json({ success: false, error: 'Agente no encontrado.' });
      }

      const code = String(Math.floor(100000 + Math.random() * 900000));
      const resetToken = signPayload({
        agentId: agent.id,
        corporateEmail: agent.corporateEmail,
        code,
        exp: Date.now() + 1000 * 60 * 15 // 15 minutes
      });

      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: 'Seguridad New Era <info@neweraky.com>',
        to: [agent.personalEmail],
        subject: `🔐 Código de seguridad (${code}) — Correo Corporativo ${agent.corporateEmail}`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8E3DA; border-radius: 14px; overflow: hidden;">
            <div style="background: #660E1A; color: #FFFFFF; padding: 24px; text-align: center;">
              <img src="https://www.neweraky.com/assets/logo-white.png" alt="New Era Real Estate" width="130" style="display: block; margin: 0 auto 10px auto; height: auto;" />
              <div style="font-size: 11px; letter-spacing: 0.14em; color: #F6D8A8; font-weight: 700;">NEW ERA REAL ESTATE</div>
              <h2 style="margin: 6px 0 0; font-size: 18px;">Cambio de PIN de Correo Corporativo</h2>
            </div>
            <div style="padding: 28px 24px; color: #121418; text-align: center;">
              <p style="font-size: 14px; line-height: 1.6;">Hola <strong>${agent.name}</strong>, usa el siguiente código de 6 dígitos para configurar tu nuevo PIN de acceso a <strong>${agent.corporateEmail}</strong>:</p>
              <div style="margin: 22px auto; padding: 16px 24px; background: #FAF7F2; border: 2px dashed #660E1A; border-radius: 12px; font-size: 28px; font-weight: 800; letter-spacing: 0.25em; color: #660E1A; display: inline-block;">
                ${code}
              </div>
              <p style="font-size: 12px; color: #6E7480;">Este código es válido por 15 minutos.</p>
            </div>
          </div>
        `
      });

      return res.status(200).json({
        success: true,
        resetToken,
        maskedPersonalEmail: maskEmail(agent.personalEmail)
      });
    }

    // 3. CONFIRM PIN RESET WITH 6-DIGIT CODE
    if (action === 'confirm_pin_reset') {
      const { resetToken = '', code = '', newPin = '' } = body;
      const verified = verifyToken(resetToken);
      if (!verified || verified.code !== String(code).trim()) {
        return res.status(400).json({
          success: false,
          error: 'El código de 6 dígitos es inválido o ha expirado.'
        });
      }

      const cleanNewPin = String(newPin).trim();
      if (cleanNewPin.length < 4) {
        return res.status(400).json({
          success: false,
          error: 'El nuevo PIN debe tener al menos 4 caracteres.'
        });
      }

      const agent = findAgent(verified.agentId);
      if (!agent) {
        return res.status(404).json({ success: false, error: 'Agente no encontrado.' });
      }

      await saveAgentPinInResend(agent, cleanNewPin);

      const sessionToken = signPayload({
        agentId: agent.id,
        corporateEmail: agent.corporateEmail,
        isAdmin: Boolean(agent.isOfficeAdmin),
        exp: Date.now() + 1000 * 60 * 60 * 24 * 14
      });

      return res.status(200).json({
        success: true,
        token: sessionToken,
        isAdmin: Boolean(agent.isOfficeAdmin),
        agent: {
          ...agent,
          maskedPersonalEmail: maskEmail(agent.personalEmail)
        }
      });
    }

    // Protected actions below require valid session token
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : body.token || '';
    const session = verifyToken(token);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Sesión expirada. Inicia sesión nuevamente.' });
    }

    const activeAgentId = session.isAdmin && body.targetAgentId ? body.targetAgentId : session.agentId;
    const activeAgent = findAgent(activeAgentId) || findAgent(session.agentId) || AGENTS_DIRECTORY[0];

    // 4. CHANGE PIN WHILE LOGGED IN
    if (action === 'change_pin') {
      const { newPin = '' } = body;
      const cleanNewPin = String(newPin).trim();
      if (cleanNewPin.length < 4) {
        return res.status(400).json({
          success: false,
          error: 'El nuevo PIN debe tener al menos 4 caracteres.'
        });
      }

      await saveAgentPinInResend(activeAgent, cleanNewPin);
      return res.status(200).json({
        success: true,
        message: `PIN actualizado correctamente para ${activeAgent.corporateEmail}.`
      });
    }

    // 5. LIST EMAILS (Inbound Received + Sent)
    if (action === 'list') {
      const viewAll = Boolean(session.isAdmin && body.viewAll);
      const [recResp, sentResp] = await Promise.all([
        fetch('https://api.resend.com/emails/receiving?limit=100', {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
        }),
        fetch('https://api.resend.com/emails?limit=100', {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
        })
      ]);

      const recJson = recResp.ok ? await recResp.json() : { data: [] };
      const sentJson = sentResp.ok ? await sentResp.json() : { data: [] };

      const corpLower = activeAgent.corporateEmail.toLowerCase();
      const localPrefix = corpLower.split('@')[0];

      // Filter Inbound Received emails
      const received = (recJson.data || [])
        .filter((item: any) => {
          if (viewAll) return true;
          const toArr = Array.isArray(item.to) ? item.to : [String(item.to || '')];
          const toStr = toArr.join(' ').toLowerCase();
          if (toStr.includes(corpLower) || toStr.includes(`${localPrefix}@neweraky.com`)) {
            return true;
          }
          if (activeAgent.isOfficeAdmin && (toStr.includes('info@neweraky.com') || toStr.includes('office@neweraky.com'))) {
            return true;
          }
          return false;
        })
        .map((item: any) => ({
          id: item.id,
          direction: 'inbound',
          folder: 'received',
          from: item.from || 'Remitente Externo',
          to: Array.isArray(item.to) ? item.to : [String(item.to || '')],
          subject: item.subject || '(Sin asunto)',
          createdAt: item.created_at,
          hasAttachments: Array.isArray(item.attachments) && item.attachments.length > 0
        }));

      // Filter Outbound Sent emails strictly sent from this agent's corporate address
      const sent: any[] = [];

      for (const item of sentJson.data || []) {
        const fromStr = String(item.from || '').toLowerCase();
        const toArr = Array.isArray(item.to) ? item.to : [String(item.to || '')];
        const subj = String(item.subject || '');

        if (
          subj.startsWith('🔐') ||
          subj.startsWith('📩 [') ||
          subj.includes('New Era Lead') ||
          subj.includes('Hemos recibido tu solicitud')
        ) {
          continue;
        }

        const matchesSent = viewAll
          ? fromStr.includes('@neweraky.com') && !fromStr.includes('info@neweraky.com')
          : fromStr.includes(`<${corpLower}>`) || fromStr === corpLower;

        if (matchesSent) {
          sent.push({
            id: item.id,
            direction: 'outbound',
            folder: 'sent',
            from: item.from,
            to: toArr,
            subject: subj,
            createdAt: item.created_at,
            lastEvent: item.last_event || 'delivered',
            hasAttachments: Array.isArray(item.attachments) && item.attachments.length > 0
          });
        }
      }

      return res.status(200).json({
        success: true,
        activeAgent: {
          ...activeAgent,
          maskedPersonalEmail: maskEmail(activeAgent.personalEmail)
        },
        received,
        sent
      });
    }

    // 6. READ SINGLE EMAIL BODY + SIGNED ATTACHMENTS
    if (action === 'read') {
      const { emailId = '', direction = 'inbound' } = body;
      if (!emailId) {
        return res.status(400).json({ success: false, error: 'Falta emailId.' });
      }

      const endpoint =
        direction === 'inbound'
          ? `https://api.resend.com/emails/receiving/${emailId}`
          : `https://api.resend.com/emails/${emailId}`;

      const attEndpoint =
        direction === 'inbound'
          ? `https://api.resend.com/emails/receiving/${emailId}/attachments`
          : `https://api.resend.com/emails/${emailId}/attachments`;

      const [resp, attResp] = await Promise.all([
        fetch(endpoint, {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
        }),
        fetch(attEndpoint, {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
        }).catch(() => null)
      ]);

      if (!resp.ok) {
        return res.status(404).json({ success: false, error: 'No se pudo cargar el contenido del correo.' });
      }

      const detail = await resp.json();
      let signedAttachments: any[] = [];
      if (attResp && attResp.ok) {
        try {
          const attJson = await attResp.json();
          if (Array.isArray(attJson?.data)) {
            signedAttachments = attJson.data;
          } else if (Array.isArray(attJson)) {
            signedAttachments = attJson;
          }
        } catch {
          // ignore
        }
      }
      if (signedAttachments.length === 0 && Array.isArray(detail.attachments)) {
        signedAttachments = detail.attachments;
      }
      detail.signedAttachments = signedAttachments;

      return res.status(200).json({
        success: true,
        email: detail
      });
    }

    // 7. SEND / REPLY EMAIL FROM AGENT'S @neweraky.com ADDRESS (WITH OPTIONAL ATTACHMENTS)
    if (action === 'send') {
      const { to = '', cc = '', subject = '', message = '', replyToMessageId = '', attachments = [] } = body;
      const cleanTo = String(to)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.includes('@'));

      if (cleanTo.length === 0) {
        return res.status(400).json({ success: false, error: 'Ingresa un destinatario válido.' });
      }
      if (!subject || !String(subject).trim()) {
        return res.status(400).json({ success: false, error: 'Ingresa el asunto del correo.' });
      }

      const cleanCc = String(cc || '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.includes('@'));

      const formattedBody = String(message || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');

      const cleanPhone = activeAgent.phone.replace(/[^0-9]/g, '');

      // Process attachments (Base64 -> Buffer)
      const resendAttachments = Array.isArray(attachments)
        ? attachments
            .filter((att: any) => att && att.filename && att.content)
            .map((att: any) => {
              const rawContent = String(att.content);
              const base64Clean = rawContent.includes('base64,')
                ? rawContent.split('base64,')[1]
                : rawContent;
              return {
                filename: String(att.filename),
                content: Buffer.from(base64Clean, 'base64'),
                ...(att.contentType ? { content_type: String(att.contentType) } : {})
              };
            })
        : [];

      const htmlEmail = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121418; line-height: 1.65; font-size: 15px; margin: 0; padding: 20px;">
          <div style="max-width: 640px;">
            <div style="margin-bottom: 28px; color: #1B1E24;">
              ${formattedBody}
            </div>

            <!-- Official New Era Real Estate Corporate Signature & Footer -->
            <table cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid #660E1A; padding-top: 20px; margin-top: 28px; width: 100%; max-width: 600px;">
              <tr>
                <td width="82" valign="top" style="padding-right: 16px;">
                  <img src="${activeAgent.photoUrl}" alt="${activeAgent.name}" width="72" height="92" style="border-radius: 10px; object-fit: cover; border: 1px solid #E5DFD5; display: block;" />
                </td>
                <td valign="top" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding-right: 14px;">
                  <div style="font-size: 16px; font-weight: 800; color: #121418; letter-spacing: 0.02em;">${activeAgent.name}</div>
                  <div style="font-size: 12px; font-weight: 700; color: #660E1A; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;">
                    ${activeAgent.title}${activeAgent.licenseNumber ? ` · Lic. #${activeAgent.licenseNumber}` : ''}
                  </div>
                  <div style="font-size: 12px; font-weight: 700; color: #5A606D; margin-top: 2px;">New Era Real Estate LLC</div>
                  <div style="font-size: 12px; color: #5A606D; margin-top: 8px; line-height: 1.55;">
                    📞 <a href="tel:${cleanPhone}" style="color: #121418; text-decoration: none; font-weight: 600;">${activeAgent.phone}</a> &nbsp;|&nbsp;
                    ✉️ <a href="mailto:${activeAgent.corporateEmail}" style="color: #660E1A; text-decoration: none; font-weight: 600;">${activeAgent.corporateEmail}</a><br/>
                    📍 6501 Shepherdsville Road, Suite 119, Louisville, KY 40219<br/>
                    🌐 <a href="https://www.neweraky.com/agents/${activeAgent.id}" style="color: #660E1A; text-decoration: none; font-weight: 600;">www.neweraky.com</a>
                  </div>
                </td>
                <td width="145" valign="middle" align="right" style="border-left: 1px solid #EAE3D8; padding-left: 16px;">
                  <a href="https://www.neweraky.com" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="https://www.neweraky.com/assets/logo-burgundy.png" alt="New Era Real Estate" width="135" style="display: block; width: 135px; max-width: 135px; height: auto; border: 0;" />
                  </a>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="padding-top: 14px;">
                  <div style="background: #FAF8F5; border: 1px solid #EAE3D8; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #78736B; line-height: 1.45;">
                    <strong style="color: #660E1A;">New Era Real Estate LLC</strong> · Licensed Brokerage in the Commonwealth of Kentucky · Equal Housing Opportunity.
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>
      `;

      const resend = new Resend(RESEND_API_KEY);
      const sendRes = await resend.emails.send({
        from: `${activeAgent.name} — New Era Real Estate <${activeAgent.corporateEmail}>`,
        to: cleanTo,
        cc: cleanCc.length > 0 ? cleanCc : undefined,
        replyTo: activeAgent.corporateEmail,
        subject: String(subject).trim(),
        html: htmlEmail,
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
        headers: replyToMessageId ? { 'In-Reply-To': replyToMessageId } : undefined
      });

      if (sendRes?.error) {
        return res.status(400).json({ success: false, error: sendRes.error.message });
      }

      return res.status(200).json({
        success: true,
        data: sendRes?.data || sendRes
      });
    }

    return res.status(400).json({ success: false, error: 'Acción no reconocida.' });
  } catch (error: any) {
    console.error('Inbox API error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error interno en el servidor de correo.'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb'
    }
  }
};
