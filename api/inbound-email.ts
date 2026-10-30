import { Resend } from 'resend';

type VercelRequest = any;
type VercelResponse = any;

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';

// Map corporate local-part (before @neweraky.com) to agent personal email & display name
const CORPORATE_TO_PERSONAL: Record<string, { name: string; personalEmail: string }> = {
  yeilen: { name: 'Yeilen Contreras', personalEmail: 'newerabroker25@gmail.com' },
  rebeca: { name: 'Rebeca Lopez', personalEmail: 'office25newera@gmail.com' },
  yazbel: { name: 'Yazbel Diaz', personalEmail: 'Yazbelrealtor@gmail.com' },
  darien: { name: 'Darien Hernandez', personalEmail: 'newerarealestateky@gmail.com' },
  yenny: { name: 'Yenny Mendoza', personalEmail: 'Yennymm1997@gmail.com' },
  dianelis: { name: 'Dianelis Segrea', personalEmail: 'dianelis.realtor@gmail.com' },
  marien: { name: 'Marien Rodriguez', personalEmail: 'marienrodriguez7908@gmail.com' },
  claudia: { name: 'Claudia Aguilera', personalEmail: 'claudiaguilera1999@gmail.com' },
  javier: { name: 'Javier Ferrer', personalEmail: 'Javferrer96@gmail.com' },
  leidys: { name: 'Leidys Herrera', personalEmail: 'lhtopagent@gmail.com' },
  dahana: { name: 'Dahana Aguila', personalEmail: 'Dahanaaguila@gmail.com' },
  karla: { name: 'Karla Fernandez', personalEmail: 'Karlafsoto26@gmail.com' },
  geraldine: { name: 'Geraldine Santiago', personalEmail: 'Geraldine10realtor@gmail.com' },
  lizandra: { name: 'Lizandra Parra', personalEmail: 'realestate@lizandraparra.com' },
  yisel: { name: 'Yisel Pupo', personalEmail: 'yiselatnewera@gmail.com' },
  solanch: { name: 'Solanch Rodríguez', personalEmail: 'Solanchrodriguez.realtor@gmail.com' },
  albin: { name: 'Albin Machado', personalEmail: 'albinmm2005@gmail.com' },
  ivonne: { name: 'Ivonne Medina', personalEmail: 'ivon.ori@icloud.com' },
  maria: { name: 'Maria Méndez', personalEmail: 'mtm60bayona@gmail.com' },
  rosa: { name: 'Rosa Mustelier', personalEmail: 'rosamustelierrealtor@gmail.com' },
  dayani: { name: 'Dayani Chavez', personalEmail: 'dayanichavez.realtor@gmail.com' },
  nina: { name: 'Grisel (Nina) Gonzalez', personalEmail: 'Griselgonzalez.realtor@gmail.com' },
  grisel: { name: 'Grisel (Nina) Gonzalez', personalEmail: 'Griselgonzalez.realtor@gmail.com' },
  yordanis: { name: 'Yordanis Alba', personalEmail: 'yalbarealty@gmail.com' },
  stephanie: { name: 'Stephanie Preciado', personalEmail: 'claudiakyrealtor@gmail.com' },
  alejandro: { name: 'Alejandro Robles', personalEmail: 'Alex.realtorky@gmail.com' },
  alex: { name: 'Alejandro Robles', personalEmail: 'Alex.realtorky@gmail.com' },
  esneider: { name: 'Esneider Ochoa', personalEmail: 'ky.realtor.ochoa@gmail.com' },
  info: { name: 'New Era Real Estate Office', personalEmail: 'newerabroker25@gmail.com' },
  office: { name: 'New Era Real Estate Office', personalEmail: 'office25newera@gmail.com' },
  broker: { name: 'Yeilen Contreras', personalEmail: 'newerabroker25@gmail.com' }
};

function extractEmailAddress(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/<([^>]+)>/);
  return (match ? match[1] : raw).trim().toLowerCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body || {};
    const eventType = event.type || '';
    const data = event.data || {};
    const emailId = data.email_id || data.id;

    if (!RESEND_API_KEY) {
      return res.status(200).json({ received: true, warning: 'Missing RESEND_API_KEY' });
    }

    // Fetch full received email body AND signed attachments from Resend Receiving API
    let fullEmail: any = data;
    let signedAttachments: any[] = [];
    if (emailId) {
      try {
        const [resp, attResp] = await Promise.all([
          fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`https://api.resend.com/emails/receiving/${emailId}/attachments`, {
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }).catch(() => null)
        ]);
        if (resp.ok) {
          fullEmail = await resp.json();
        }
        if (attResp && attResp.ok) {
          const attJson = await attResp.json();
          if (Array.isArray(attJson?.data)) {
            signedAttachments = attJson.data;
          } else if (Array.isArray(attJson)) {
            signedAttachments = attJson;
          }
        }
      } catch (err) {
        console.warn('Could not fetch full received email details:', err);
      }
    }

    const fromRaw = fullEmail.from || data.from || 'Remitente Externo';
    const senderAddress = extractEmailAddress(fromRaw);
    const toList: string[] = Array.isArray(fullEmail.to || data.to)
      ? (fullEmail.to || data.to)
      : [String(fullEmail.to || data.to || '')];
    const subject = fullEmail.subject || data.subject || '(Sin asunto)';
    const htmlBody = fullEmail.html || '';
    const textBody = fullEmail.text || '';

    // Determine which agent(s) should receive the personal Gmail/iCloud copy
    const forwardTargets = new Set<string>();
    const matchedAgentNames: string[] = [];
    const matchedCorpEmails: string[] = [];

    for (const rawRecipient of toList) {
      const cleanRecipient = extractEmailAddress(rawRecipient);
      const [localPart, domain] = cleanRecipient.split('@');
      if (localPart && (!domain || domain === 'neweraky.com')) {
        const key = localPart.toLowerCase().trim();
        const mapped = CORPORATE_TO_PERSONAL[key];
        if (mapped) {
          forwardTargets.add(mapped.personalEmail);
          matchedAgentNames.push(mapped.name);
          matchedCorpEmails.push(`${key}@neweraky.com`);
        }
      }
    }

    // Fallback to main brokerage notification email if sent to an unknown @neweraky.com alias
    if (forwardTargets.size === 0) {
      forwardTargets.add('newerabroker25@gmail.com');
      matchedCorpEmails.push(toList[0] || 'info@neweraky.com');
    }

    const resend = new Resend(RESEND_API_KEY);
    const bodyPreview = htmlBody
      ? htmlBody
      : `<div style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px; color: #121418;">${textBody || '(Mensaje sin texto)'}</div>`;

    const attachmentsHtmlSection =
      signedAttachments.length > 0
        ? `
          <div style="padding: 16px 24px; background: #FAF8F5; border-top: 1px solid #E8E3DA;">
            <div style="font-size: 12px; font-weight: 800; color: #660E1A; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;">
              📎 Archivos Adjuntos (${signedAttachments.length})
            </div>
            <div>
              ${signedAttachments
                .map(
                  (att: any) => `
                  <div style="margin-bottom: 6px; font-size: 13px;">
                    <a href="${att.download_url || 'https://www.neweraky.com/inbox'}" target="_blank" style="color: #660E1A; font-weight: 700; text-decoration: underline;">
                      📄 ${att.filename || 'Archivo adjunto'}
                    </a>
                    ${att.size ? `<span style="color: #78736B; font-size: 11px;"> (${Math.max(1, Math.round(att.size / 1024))} KB)</span>` : ''}
                  </div>
                `
                )
                .join('')}
            </div>
          </div>
        `
        : '';

    const forwardAttachments = signedAttachments
      .filter((att: any) => att && att.download_url)
      .map((att: any) => ({
        filename: att.filename || 'adjunto',
        path: att.download_url
      }));

    await resend.emails.send({
      from: `Buzón New Era (${matchedCorpEmails[0] || 'info@neweraky.com'}) <info@neweraky.com>`,
      to: Array.from(forwardTargets),
      replyTo: senderAddress || undefined,
      subject: `📩 [${matchedCorpEmails[0] || 'neweraky.com'}] ${subject}`,
      attachments: forwardAttachments.length > 0 ? forwardAttachments : undefined,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF8F5; padding: 24px 14px; color: #121418;">
          <div style="max-width: 640px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; border: 1px solid #E8E3DA; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.06);">
            <div style="background: linear-gradient(135deg, #660E1A 0%, #420710 100%); color: #FFFFFF; padding: 20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #F6D8A8; font-weight: 700;">CORREO CORPORATIVO RECIBIDO</div>
                    <div style="font-size: 17px; font-weight: 800; margin-top: 4px; color: #FFFFFF;">${matchedCorpEmails.join(', ')}</div>
                  </td>
                  <td valign="middle" align="right" width="120">
                    <img src="https://www.neweraky.com/assets/logo-white.png" alt="New Era Real Estate" width="110" style="display: block; width: 110px; height: auto; border: 0;" />
                  </td>
                </tr>
              </table>
            </div>
            <div style="padding: 20px 24px; background: #F8F6F2; border-bottom: 1px solid #E8E3DA; font-size: 13px; line-height: 1.6;">
              <div><strong>De:</strong> ${fromRaw}</div>
              <div><strong>Para:</strong> ${toList.join(', ')}</div>
              <div><strong>Asunto:</strong> ${subject}</div>
            </div>
            <div style="padding: 24px;">
              ${bodyPreview}
            </div>
            ${attachmentsHtmlSection}
            <div style="padding: 18px 24px; background: #F4F1EA; border-top: 1px solid #E8E3DA; text-align: center;">
              <a href="https://www.neweraky.com/inbox" target="_blank" style="display: inline-block; background: #660E1A; color: #FFFFFF; text-decoration: none; padding: 11px 22px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;">
                📬 Responder desde mi Bandeja New Era (neweraky.com/inbox)
              </a>
              <div style="font-size: 11px; color: #78736B; margin-top: 10px;">
                También puedes responder directamente a este correo para contestar a ${senderAddress || fromRaw}.
              </div>
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #E5DFD5;">
                <img src="https://www.neweraky.com/assets/logo-burgundy.png" alt="New Era Real Estate" width="95" style="display: inline-block; width: 95px; height: auto; opacity: 0.9;" />
              </div>
            </div>
          </div>
        </div>
      `
    });

    return res.status(200).json({
      received: true,
      eventType,
      emailId,
      forwardedTo: Array.from(forwardTargets)
    });
  } catch (error: any) {
    console.error('Error processing inbound email webhook:', error);
    return res.status(200).json({ received: true, error: error?.message });
  }
}
