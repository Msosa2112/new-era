import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { BROKERAGE_DATA } from '../../data/agentsData';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact-section"
      className="section-padding"
      style={{
        backgroundColor: 'var(--color-charcoal-950)',
        color: '#FFFFFF',
        position: 'relative'
      }}
    >
      <div className="container">
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
              <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
                {lang === 'es' ? 'SEDE PRINCIPAL LOUISVILLE' : 'LOUISVILLE HEADQUARTERS'}
              </span>
              <h2
                className="display-title"
                style={{
                  color: '#FFFFFF',
                  marginTop: '0.75rem',
                  marginBottom: '1.25rem'
                }}
              >
                {lang === 'es' ? (
                  <>
                    INICIA TU <br />
                    <span style={{ color: 'var(--color-orange-accent)', fontStyle: 'italic' }}>
                      SIGUIENTE ERA.
                    </span>
                  </>
                ) : (
                  <>
                    START YOUR <br />
                    <span style={{ color: 'var(--color-orange-accent)', fontStyle: 'italic' }}>
                      NEXT ERA.
                    </span>
                  </>
                )}
              </h2>
              <p className="editorial-lead" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
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
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(114, 22, 35, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={20} color="var(--color-orange-accent)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {lang === 'es' ? 'Ubicación' : 'Office Address'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {BROKERAGE_DATA.address.fullFormatted}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(114, 22, 35, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Phone size={20} color="var(--color-orange-accent)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {lang === 'es' ? 'Teléfono Directo' : 'Direct Line'}
                  </h4>
                  <a
                    href="tel:5025000409"
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--color-orange-accent)',
                      fontFamily: 'var(--font-serif)'
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
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(114, 22, 35, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Clock size={20} color="var(--color-orange-accent)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {lang === 'es' ? 'Horario de Atención' : 'Office Hours'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {BROKERAGE_DATA.officeHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Broker Leadership Note */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--color-orange-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                LEADERSHIP & COMPLIANCE
              </span>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.25rem' }}>
                {BROKERAGE_DATA.brokerCeo} — Principal Broker & CEO
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.2rem' }}>
                {BROKERAGE_DATA.licenseNote}
              </p>
            </div>
          </div>

          {/* Right: Interactive Consultation Form */}
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              backgroundColor: 'var(--color-charcoal-900)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-xs)',
              boxShadow: 'var(--shadow-luxury)'
            }}
          >
            <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
              {lang === 'es' ? 'SOLICITAR CONSULTA' : 'SCHEDULE ADVISORY'}
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#FFFFFF', marginTop: '0.35rem', marginBottom: '1.5rem' }}>
              {lang === 'es' ? '¿En qué podemos ayudarte hoy?' : 'How can we assist your next move?'}
            </h3>

            {submitted ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  backgroundColor: 'rgba(114, 22, 35, 0.35)',
                  border: '1px solid var(--color-orange-accent)',
                  borderRadius: 'var(--radius-xs)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={40} color="var(--color-orange-accent)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {lang === 'es' ? 'Mensaje Enviado con Éxito' : 'Consultation Scheduled'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {lang === 'es'
                    ? 'Yeilen Contreras o un asesor principal de New Era se comunicará contigo a la brevedad.'
                    : 'Our advisory team will reach out directly to coordinate your consultation.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Inquiry Type Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                    {lang === 'es' ? 'Tipo de Asesoría' : 'Inquiry Type'}
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Buying a Home" style={{ background: '#121418', color: '#fff' }}>
                      {lang === 'es' ? 'Comprar una Residencia' : 'Buying a Home in Louisville / KY'}
                    </option>
                    <option value="Selling a Property" style={{ background: '#121418', color: '#fff' }}>
                      {lang === 'es' ? 'Vender mi Propiedad (CMA Valuation)' : 'Selling a Property'}
                    </option>
                    <option value="Down Payment Assistance" style={{ background: '#121418', color: '#fff' }}>
                      {lang === 'es' ? 'Asistencia para Primer Comprador / ITIN' : 'Down Payment Assistance / ITIN'}
                    </option>
                    <option value="Investment / Commercial" style={{ background: '#121418', color: '#fff' }}>
                      {lang === 'es' ? 'Inversión & Portafolio Comercial' : 'Investment & Commercial Advisory'}
                    </option>
                    <option value="Join New Era as Agent" style={{ background: '#121418', color: '#fff' }}>
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
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-xs)',
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
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-xs)',
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
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-xs)',
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
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-xs)',
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
                    backgroundColor: 'var(--color-orange-accent)'
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
