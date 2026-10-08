import { Resend } from 'resend';

type VercelRequest = any;
type VercelResponse = any;

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
const BROKERAGE_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'newerabroker25@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'New Era Real Estate <onboarding@resend.dev>';

// Quick map of agents' emails
const AGENT_EMAILS: Record<string, string> = {
  'yeilen-contreras': 'newerabroker25@gmail.com',
  'dianelys-hernandez': 'dianelys@newerarealestateky.com',
  'lazaro-perez': 'lazaro@newerarealestateky.com',
  'marien-carmona': 'marien@newerarealestateky.com',
  'yosvany-perez': 'yosvany@newerarealestateky.com',
  'yosniel-valdes': 'yosniel@newerarealestateky.com',
  'pedro-cabrera': 'pedro@newerarealestateky.com'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
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

    // Format subject based on lead type
    let subjectType = 'Nuevo Contacto de Cliente';
    if (type === 'tour') subjectType = 'Solicitud de Recorrido de Propiedad';
    if (type === 'valuation') subjectType = 'Solicitud de Valuación de Vivienda';
    if (type === 'agent_inquiry') subjectType = 'Mensaje para Realtor Asignado';
    if (type === 'offer') subjectType = 'Propuesta de Compra';

    const subject = `🏛️ New Era Lead: ${subjectType} — ${name}`;

    // Target recipients
    const toRecipients = [BROKERAGE_NOTIFICATION_EMAIL];
    if (agentId && AGENT_EMAILS[agentId] && AGENT_EMAILS[agentId] !== BROKERAGE_NOTIFICATION_EMAIL) {
      toRecipients.push(AGENT_EMAILS[agentId]);
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
              ${metadata?.agentName ? `
              <div class="info-row">
                <span class="info-label">Realtor Asignado:</span>
                <span class="info-val">${metadata.agentName}</span>
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

    // Send email to brokerage/agent with fallback for unverified domains in test mode
    let sendResult;
    try {
      sendResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: toRecipients,
        replyTo: email || undefined,
        subject,
        html: htmlEmail
      });
    } catch (sendErr: any) {
      if (sendErr?.statusCode === 403 || sendErr?.message?.includes('verify a domain')) {
        console.warn('Resend test mode detected. Falling back to account email. Verify your domain at resend.com/domains to send to any recipient.');
        sendResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: ['newerarealestateky@gmail.com'],
          replyTo: email || undefined,
          subject: `[Lead Broker: ${toRecipients.join(', ')}] ${subject}`,
          html: htmlEmail
        });
      } else {
        throw sendErr;
      }
    }

    // Optional confirmation email to the client (only works when domain is verified)
    if (email && email.includes('@')) {
      try {
        await resend.emails.send({
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
      } catch (clientEmailErr) {
        // Expected in Resend free test mode until domain is verified
        console.info('Client auto-reply skipped (requires verified domain in resend.com/domains):', clientEmailErr);
      }
    }

    return res.status(200).json({ success: true, data: sendResult });
  } catch (error: any) {
    console.error('Error sending email via Resend:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to send email' });
  }
}
