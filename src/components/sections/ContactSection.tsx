import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { BROKERAGE_DATA } from '../../data/agentsData';
import { HexPattern } from '../common/HexPattern';
import { submitLead } from '../../lib/supabase';

interface ContactSectionProps {
  lang: 'en' | 'es';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const [inquiryType, setInquiryType] = useState('Buying a Home');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitLead({
      name,
      email,
      phone,
      message,
      type: 'general',
      metadata: { inquiryType }
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact-section"
      className="section-padding"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <HexPattern variant="burgundy" opacity={0.07} maskFade="radial-top-right" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left: Office Information & Executive Identity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span className="display-subtitle" style={{ color: '#660E1A' }}>
                {lang === 'es' ? 'SEDE PRINCIPAL LOUISVILLE' : 'LOUISVILLE HEADQUARTERS'}
              </span>
              <h2
                className="display-title"
                style={{
                  color: '#121418',
                  marginTop: '0.75rem',
                  marginBottom: '1.25rem'
                }}
              >
                {lang === 'es' ? (
                  <>
                    INICIA TU <br />
                    <span style={{ color: '#660E1A', fontStyle: 'italic' }}>
                      SIGUIENTE ERA.
                    </span>
                  </>
                ) : (
                  <>
                    START YOUR <br />
                    <span style={{ color: '#660E1A', fontStyle: 'italic' }}>
                      NEXT ERA.
                    </span>
                  </>
                )}
              </h2>
              <p className="editorial-lead" style={{ color: '#5A606D' }}>
                {lang === 'es'
                  ? 'Nuestras puertas están abiertas para atenderte con la calidez, profesionalismo y discreción que mereces.'
                  : 'Connect with our leadership team for a confidential real estate advisory consultation.'}
              </p>
            </div>

            {/* Direct Information Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(102, 14, 26, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={20} color="#660E1A" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#121418' }}>
                    {lang === 'es' ? 'Ubicación' : 'Office Address'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#5A606D' }}>
                    {BROKERAGE_DATA.address.fullFormatted}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(102, 14, 26, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Phone size={20} color="#660E1A" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#121418' }}>
                    {lang === 'es' ? 'Teléfono Directo' : 'Direct Line'}
                  </h4>
                  <a
                    href="tel:5025000409"
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#660E1A',
                      fontFamily: 'var(--font-serif)',
                      textDecoration: 'none'
                    }}
                  >
                    {BROKERAGE_DATA.phone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(102, 14, 26, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Clock size={20} color="#660E1A" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#121418' }}>
                    {lang === 'es' ? 'Horario de Atención' : 'Office Hours'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#5A606D' }}>
                    {BROKERAGE_DATA.officeHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Broker Leadership Note */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(102, 14, 26, 0.12)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#660E1A', fontWeight: 700, textTransform: 'uppercase' }}>
                LEADERSHIP & COMPLIANCE
              </span>
              <p style={{ fontSize: '0.85rem', color: '#121418', fontWeight: 600, marginTop: '0.25rem' }}>
                {BROKERAGE_DATA.brokerCeo} — Principal Broker & CEO
              </p>
              <p style={{ fontSize: '0.75rem', color: '#5A606D', marginTop: '0.2rem' }}>
                {BROKERAGE_DATA.licenseNote}
              </p>
            </div>
          </div>

          {/* Right: Interactive Consultation Form */}
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(102, 14, 26, 0.15)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 36px rgba(102, 14, 26, 0.08)'
            }}
          >
            <span className="display-subtitle" style={{ color: '#660E1A' }}>
              {lang === 'es' ? 'SOLICITAR CONSULTA' : 'SCHEDULE ADVISORY'}
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#121418', marginTop: '0.35rem', marginBottom: '1.5rem' }}>
              {lang === 'es' ? '¿En qué podemos ayudarte hoy?' : 'How can we assist your next move?'}
            </h3>

            {submitted ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  backgroundColor: 'rgba(102, 14, 26, 0.06)',
                  border: '1px solid #660E1A',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={40} color="#660E1A" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.35rem', color: '#121418', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {lang === 'es' ? 'Mensaje Enviado con Éxito' : 'Consultation Scheduled'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#5A606D' }}>
                  {lang === 'es'
                    ? 'Yeilen Contreras o un asesor principal de New Era se comunicará contigo a la brevedad.'
                    : 'Our advisory team will reach out directly to coordinate your consultation.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Inquiry Type Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5A606D' }}>
                    {lang === 'es' ? 'Tipo de Asesoría' : 'Inquiry Type'}
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid rgba(102, 14, 26, 0.18)',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Buying a Home">
                      {lang === 'es' ? 'Comprar una Residencia' : 'Buying a Home in Louisville / KY'}
                    </option>
                    <option value="Selling a Property">
                      {lang === 'es' ? 'Vender mi Propiedad (CMA Valuation)' : 'Selling a Property'}
                    </option>
                    <option value="Down Payment Assistance">
                      {lang === 'es' ? 'Asistencia para Primer Comprador / ITIN' : 'Down Payment Assistance / ITIN'}
                    </option>
                    <option value="Investment / Commercial">
                      {lang === 'es' ? 'Inversión & Portafolio Comercial' : 'Investment & Commercial Advisory'}
                    </option>
                    <option value="Join New Era as Agent">
                      {lang === 'es' ? 'Unirse al Equipo como Agente' : 'Join New Era as an Agent'}
                    </option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'es' ? 'Nombre Completo' : 'Full Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid rgba(102, 14, 26, 0.18)',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid rgba(102, 14, 26, 0.18)',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone (502-xxx-xxxx)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid rgba(102, 14, 26, 0.18)',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder={lang === 'es' ? 'Detalles o requerimientos de tu búsqueda...' : 'Tell us about your property goals or timeframe...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid rgba(102, 14, 26, 0.18)',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '1rem',
                    backgroundColor: '#660E1A',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #660E1A',
                    boxShadow: '0 4px 14px rgba(102, 14, 26, 0.22)',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  <span>{lang === 'es' ? 'SOLICITAR ASESORÍA PERSONALIZADA' : 'SUBMIT ADVISORY REQUEST'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
