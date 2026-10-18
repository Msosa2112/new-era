import { Resend } from 'resend';

type VercelRequest = any;
type VercelResponse = any;

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
const BROKERAGE_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'newerabroker25@gmail.com';
const RESEND_ACCOUNT_OWNER_EMAIL = process.env.RESEND_OWNER_EMAIL || 'newerarealestateky@gmail.com';
const rawFromEmail = process.env.FROM_EMAIL || '';
const FROM_EMAIL = (!rawFromEmail || rawFromEmail.toLowerCase().includes('@resend.dev'))
  ? 'New Era Real Estate <info@neweraky.com>'
  : rawFromEmail;

// Real map of all 24 New Era Real Estate agents' emails
const AGENT_EMAILS: Record<string, string> = {
  'yeilen-contreras': 'newerabroker25@gmail.com',
  'yenny-mendoza-molina': 'Yennymm1997@gmail.com',
  'dianelis-segrea-castellon': 'dianelis.realtor@gmail.com',
  'marien-rodriguez-reyes': 'marienrodriguez7908@gmail.com',
  'claudia-aguilera-cuenca': 'claudiaguilera1999@gmail.com',
  'yazbel-diaz': 'Yazbelrealtor@gmail.com',
  'javier-ferrer-rodriguez': 'Javferrer96@gmail.com',
  'leidys-herrera': 'lhtopagent@gmail.com',
  'dahana-aguila': 'Dahanaaguila@gmail.com',
  'karla-fernandez-soto': 'Karlafsoto26@gmail.com',
  'geraldine-santiago-then': 'Geraldine10realtor@gmail.com',
  'lizandra-parra-rodriguez': 'realestate@lizandraparra.com',
  'yisel-pupo': 'yiselatnewera@gmail.com',
  'solanch-rodriguez-curbeira': 'Solanchrodriguez.realtor@gmail.com',
  'albin-machado-campo': 'albinmm2005@gmail.com',
  'ivonne-medina': 'ivon.ori@icloud.com',
  'maria-mendez': 'mtm60bayona@gmail.com',
  'rosa-mustelier-jimenez': 'rosamustelierrealtor@gmail.com',
  'dayani-chavez': 'newerarealestateky@gmail.com',
  'nina-gonzalez': 'Griselgonzalez.realtor@gmail.com',
  'rebeca-lopez-portuondo': 'rebecalopezp1984@gmail.com',
  'yordanis-alba-elias': 'yalbarealty@gmail.com',
  'stephanie-preciado': 'newerarealestateky@gmail.com',
  'alejandro-robles': 'Alex.realtorky@gmail.com'
};

/**
 * Detects random bot-generated gibberish strings (e.g., "Sktvau Uhaxb", "Cdfiogi Gxaqtv", "Fjqakznpv")
 * while allowing all legitimate Spanish and English names and addresses.
 */
function isGibberishText(str: string): boolean {
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
 * Comprehensive bot & spam lead detector
 */
function isSpamLead(payload: Record<string, any>): { spam: boolean; reason?: string } {
  const {
    name = '',
    email = '',
    message = '',
    address = '',
    type = '',
    honeypot = '',
    elapsedMs,
    metadata = {}
  } = payload;

  // 1. Honeypot trap triggered
  if (honeypot && String(honeypot).trim() !== '') {
    return { spam: true, reason: 'honeypot_filled' };
  }
  if (metadata?.honeypot && String(metadata.honeypot).trim() !== '') {
    return { spam: true, reason: 'metadata_honeypot_filled' };
  }

  // 2. Submission speed trap (< 1.5s after mount)
  const elapsed = typeof elapsedMs === 'number' ? elapsedMs : metadata?.elapsedMs;
  if (typeof elapsed === 'number' && elapsed >= 0 && elapsed < 1500) {
    return { spam: true, reason: 'submitted_too_fast' };
  }

  // 3. Invalid or missing email
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { spam: true, reason: 'missing_email' };
  }

  // 4. Dot-stuffed Gmail bot accounts (e.g., pa.p.a.gay.or.eserve@gmail.com)
  const [localPart, domain] = cleanEmail.split('@');
  if (localPart && (domain === 'gmail.com' || domain === 'googlemail.com')) {
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 3) {
      return { spam: true, reason: 'dot_stuffed_gmail' };
    }
  }

  // 5. Numeric-only message body (bot puts 10-digit random numbers in the message textarea)
  const cleanMsg = String(message || '').trim();
  if (cleanMsg && /^\d{5,20}$/.test(cleanMsg)) {
    return { spam: true, reason: 'numeric_only_message' };
  }

  // 6. Valuation address validation (real addresses have spaces and street numbers, not a single random word like "Fjqakznpv" or "Ssjljauke")
  const cleanAddr = String(address || '').trim();
  if (type === 'valuation' || cleanAddr) {
    if (!cleanAddr || !cleanAddr.includes(' ') || !/\d/.test(cleanAddr) || isGibberishText(cleanAddr)) {
      return { spam: true, reason: 'invalid_or_gibberish_address' };
    }
  }

  // 7. Gibberish name check
  const cleanName = String(name || '').trim();
  if (cleanName && cleanName !== 'Website Visitor' && cleanName !== 'Cliente Web') {
    if (isGibberishText(cleanName)) {
      return { spam: true, reason: 'gibberish_name' };
    }
  }

  return { spam: false };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-NewEra-Shield'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    const shieldHeader = req.headers?.['x-newera-shield'];

    // Anti-spam shield: silently drop automated bot submissions or stale/direct requests before calling Resend
    const spamCheck = isSpamLead(payload);
    if (spamCheck.spam || shieldHeader !== 'ne-human-verified-2026') {
      console.warn(`🛡️ [Anti-Spam] Blocked bot lead (${spamCheck.reason || 'missing_shield_header'}):`, {
        name: payload.name,
        email: payload.email,
        type: payload.type,
        address: payload.address
      });
      return res.status(200).json({
        success: true,
        filtered: true
      });
    }

    const {
      name = 'Cliente Web',
      email = '',
      phone = '',
      type = 'general',
      message = '',
      propertyId = '',
      agentId = '',
      metadata = {},
      address = '' // for valuation requests
    } = payload;

    if (!RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY is not configured in environment variables.');
      return res.status(200).json({
        success: true,
        mocked: true,
        message: 'Lead registered in Supabase. Set RESEND_API_KEY in .env to enable instant live email notifications.'
      });
    }

    const resend = new Resend(RESEND_API_KEY);
    const isSandboxSender = FROM_EMAIL.toLowerCase().includes('@resend.dev');

    // Format subject based on lead type
    let subjectType = 'Nuevo Contacto de Cliente';
    if (type === 'tour') subjectType = 'Solicitud de Recorrido de Propiedad';
    if (type === 'valuation') subjectType = 'Solicitud de Valuación de Vivienda';
    if (type === 'agent_inquiry') subjectType = 'Mensaje para Realtor Asignado';
    if (type === 'offer') subjectType = 'Propuesta de Compra';

    const subject = `🏛️ New Era Lead: ${subjectType} — ${name}`;

    // Target recipients when domain is verified
    const intendedRecipients = [BROKERAGE_NOTIFICATION_EMAIL];
    if (agentId && AGENT_EMAILS[agentId] && !intendedRecipients.includes(AGENT_EMAILS[agentId])) {
      intendedRecipients.push(AGENT_EMAILS[agentId]);
    }

    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('1') ? cleanPhone : '1' + cleanPhone}` : '';

    // Luxury HTML Email Template
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 30px 15px; color: #121418; }
          .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.08); border: 1px solid #EAE5DE; }
          .header { background: linear-gradient(135deg, #7A1220 0%, #4D0811 100%); padding: 36px 30px; text-align: center; color: #FFFFFF; }
          .brand { font-size: 22px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin: 0; }
          .badge { display: inline-block; background: rgba(246, 216, 168, 0.2); border: 1px solid #F6D8A8; color: #F6D8A8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 10px; }
          .content { padding: 32px 30px; }
          .section-title { font-size: 14px; font-weight: 800; color: #660E1A; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
          .lead-card { background: #F8F6F2; border: 1px solid #E8E3DA; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ECE7DF; font-size: 14px; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #6E7480; font-weight: 600; }
          .info-val { color: #121418; font-weight: 700; text-align: right; }
          .message-box { background: #FFFFFF; border: 1px solid #E2DCD4; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #2D3139; margin-top: 8px; font-style: italic; }
          .cta-wrap { display: flex; gap: 12px; margin-top: 25px; }
          .btn-primary { flex: 1; background: #660E1A; color: #FFFFFF !important; text-decoration: none; padding: 12px 18px; border-radius: 8px; text-align: center; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
          .btn-whatsapp { flex: 1; background: #25D366; color: #FFFFFF !important; text-decoration: none; padding: 12px 18px; border-radius: 8px; text-align: center; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
          .footer { background: #F4F1EA; padding: 24px 30px; text-align: center; font-size: 12px; color: #78736B; border-top: 1px solid #ECE7DE; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">NEW ERA REAL ESTATE</h1>
            <div class="badge">NUEVO LEAD RECIBIDO</div>
          </div>
          
          <div class="content">
            <div class="section-title">👤 Datos del Interesado</div>
            <div class="lead-card">
              <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span class="info-val">${name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Correo Electrónico:</span>
                <span class="info-val"><a href="mailto:${email}" style="color: #660E1A; text-decoration: none;">${email}</a></span>
              </div>
              <div class="info-row">
                <span class="info-label">Teléfono:</span>
                <span class="info-val">${phone ? `<a href="tel:${cleanPhone}" style="color: #660E1A; text-decoration: none;">${phone}</a>` : 'No proporcionado'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo de Solicitud:</span>
                <span class="info-val" style="color: #660E1A;">${subjectType}</span>
              </div>
              ${address ? `
              <div class="info-row">
                <span class="info-label">Dirección / Propiedad:</span>
                <span class="info-val">${address}</span>
              </div>
              ` : ''}
              ${propertyId ? `
              <div class="info-row">
                <span class="info-label">ID Propiedad:</span>
                <span class="info-val">${propertyId}</span>
              </div>
              ` : ''}
              ${metadata?.service ? `
              <div class="info-row">
                <span class="info-label">Servicio Requerido:</span>
                <span class="info-val">${metadata.service}</span>
              </div>
              ` : ''}
              ${metadata?.tourDate ? `
              <div class="info-row">
                <span class="info-label">Fecha y Hora Preferida:</span>
                <span class="info-val">${metadata.tourDate} a las ${metadata.tourTime || ''} (${metadata.tourType || 'Presencial'})</span>
              </div>
              ` : ''}
              ${(metadata?.agentName || agentId) ? `
              <div class="info-row">
                <span class="info-label">Realtor Asignado:</span>
                <span class="info-val">${metadata?.agentName || agentId}${agentId && AGENT_EMAILS[agentId] ? ` (${AGENT_EMAILS[agentId]})` : ''}</span>
              </div>
              ` : ''}
            </div>

            ${message ? `
            <div class="section-title">💬 Mensaje / Notas del Cliente</div>
            <div class="message-box">
              "${message}"
            </div>
            ` : ''}

            <!-- Direct Contact CTAs -->
            <div class="cta-wrap">
              ${phone ? `<a href="tel:${cleanPhone}" class="btn-primary">📞 Llamar al Cliente</a>` : ''}
              ${whatsappLink ? `<a href="${whatsappLink}" target="_blank" class="btn-whatsapp">💬 Enviar WhatsApp</a>` : ''}
            </div>
          </div>

          <div class="footer">
            <strong>New Era Real Estate LLC</strong><br>
            6501 Shepherdsville Road, Suite 119, Louisville, KY 40219<br>
            Teléfono: (502) 500-0409 · Email: newerabroker25@gmail.com<br>
            <em>Sistema de Notificaciones Inmobiliarias en Tiempo Real</em>
          </div>
        </div>
      </body>
      </html>
    `;

    // Note: Resend SDK v2+ returns { data, error } and does NOT throw on 403.
    // While using onboarding@resend.dev (unverified domain), Resend only permits sending to the account owner email (newerarealestateky@gmail.com).
    let sendResult;
    if (isSandboxSender) {
      sendResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: [RESEND_ACCOUNT_OWNER_EMAIL],
        replyTo: email || undefined,
        subject: agentId && AGENT_EMAILS[agentId]
          ? `[Para: ${AGENT_EMAILS[agentId]}] ${subject}`
          : subject,
        html: htmlEmail
      });
    } else {
      sendResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: intendedRecipients,
        replyTo: email || undefined,
        subject,
        html: htmlEmail
      });

      // Fallback if custom domain is not yet verified in Resend
      if (sendResult?.error) {
        console.warn('Resend domain restriction or error detected, falling back to account owner email:', sendResult.error);
        sendResult = await resend.emails.send({
          from: 'New Era Real Estate <onboarding@resend.dev>',
          to: [RESEND_ACCOUNT_OWNER_EMAIL],
          replyTo: email || undefined,
          subject: `[Para: ${intendedRecipients.join(', ')}] ${subject}`,
          html: htmlEmail
        });
      }
    }

    // Client auto-reply confirmation email:
    // Only send if custom domain is verified (!isSandboxSender) OR if the client email matches the Resend owner email
    if (
      email &&
      email.includes('@') &&
      (!isSandboxSender || email.toLowerCase().trim() === RESEND_ACCOUNT_OWNER_EMAIL.toLowerCase())
    ) {
      const clientReply = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: '🏛️ Hemos recibido tu solicitud — New Era Real Estate',
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #ECE7DE; border-radius: 12px; background: #FFFFFF;">
            <div style="text-align: center; border-bottom: 2px solid #660E1A; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #660E1A; margin: 0; font-size: 20px; letter-spacing: 0.1em;">NEW ERA REAL ESTATE</h2>
            </div>
            <p>Hola <strong>${name}</strong>,</p>
            <p>Gracias por contactar a <strong>New Era Real Estate</strong>. Hemos recibido tu solicitud exitosamente y uno de nuestros asesores especializados se comunicará contigo a la brevedad posible.</p>
            <div style="background: #F8F6F2; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; border: 1px solid #E8E3DA;">
              <strong>Resumen de tu solicitud:</strong><br>
              • <strong>Servicio:</strong> ${subjectType}<br>
              ${address ? `• <strong>Propiedad:</strong> ${address}<br>` : ''}
              ${phone ? `• <strong>Teléfono de contacto:</strong> ${phone}<br>` : ''}
            </div>
            <p>Si deseas comunicarte de inmediato con nuestra oficina central, puedes llamarnos directamente al <strong>(502) 500-0409</strong> o escribirnos a <strong>newerabroker25@gmail.com</strong>.</p>
            <br>
            <p style="margin-bottom: 0;">Atentamente,<br><strong>Equipo de Asesoría Inmobiliaria</strong><br>New Era Real Estate LLC</p>
          </div>
        `
      });
      if (clientReply?.error) {
        console.info('Client auto-reply skipped:', clientReply.error.message);
      }
    }

    if (sendResult?.error) {
      console.error('Resend error:', sendResult.error);
      return res.status(400).json({ success: false, error: sendResult.error.message });
    }

    return res.status(200).json({ success: true, data: sendResult?.data || sendResult });
  } catch (error: any) {
    console.error('Error sending email via Resend:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to send email' });
  }
}
