import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, MapPin, Award, TrendingUp, Users, Sparkles, Building2, Calendar } from 'lucide-react';
import { HexPattern } from './HexPattern';
import { BrandLogo } from './BrandLogo';
import { submitLead } from '../../lib/supabase';
import { BROKERAGE_DATA } from '../../data/agentsData';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseStatus, setLicenseStatus] = useState('Licensed in KY');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [experienceNotes, setExperienceNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitLead({
        name,
        email,
        phone,
        type: 'agent_inquiry',
        message: `SOLICITUD DE ENTREVISTA PRESENCIAL EN OFICINA (JOIN NEW ERA):
Estado de Licencia: ${licenseStatus}
Fecha Preferida: ${preferredDate || 'Por coordinar'}
Horario Preferido: ${preferredTime}
Notas de Trayectoria: ${experienceNotes || 'N/A'}`
      });
    } catch (err) {
      console.warn('Error submitting join interview request:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        backgroundColor: 'rgba(12, 13, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'modalBackdropFade 180ms var(--ease-out-fluid) both'
      }}
    >
      <div
        className="join-team-modal-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#FAF7F2',
          color: '#121418',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #E5E0D8',
          boxShadow: '0 25px 60px -12px rgba(18, 20, 24, 0.3)',
          position: 'relative',
          padding: 'clamp(1.75rem, 4vw, 2.5rem)',
          maxHeight: '92vh',
          overflowY: 'auto',
          animation: 'modalContentScale 240ms var(--ease-out-fluid) both',
          willChange: 'transform, opacity'
        }}
      >
        <HexPattern variant="burgundy" opacity={0.06} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#EBE5DC',
            color: '#121418',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header - Clean Large Logo on Top */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', paddingTop: '0.5rem' }}>
            <BrandLogo variant="full-burgundy" height={52} />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              marginTop: '0.5rem',
              marginBottom: '0.35rem',
              color: '#121418',
              lineHeight: 1.2
            }}
          >
            {lang === 'es' ? 'Únete a New Era Real Estate' : 'Join New Era Real Estate'}
          </h3>

          <p style={{ fontSize: '0.9rem', color: '#5A606D', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
            {lang === 'es'
              ? 'Agenda una entrevista presencial confidencial con nuestra Principal Broker en nuestras oficinas de Louisville.'
              : 'Schedule a private in-person interview with our Principal Broker at our Louisville office.'}
          </p>
        </div>

        {submitted ? (
          /* Success Screen */
          <div
            style={{
              padding: '2.5rem 1.5rem',
              backgroundColor: 'rgba(102, 14, 26, 0.06)',
              border: '1.5px solid #660E1A',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <CheckCircle2 className="animate-success-icon" size={48} color="#660E1A" style={{ margin: '0 auto 0.85rem' }} />
            <h4 style={{ fontSize: '1.4rem', color: '#121418', marginBottom: '0.5rem', fontWeight: 600 }}>
              {lang === 'es' ? '¡Entrevista Solicitada con Éxito!' : 'Interview Request Received!'}
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#5A606D', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 1.75rem' }}>
              {lang === 'es'
                ? `Gracias ${name || ''}. Nuestro equipo de coordinación y la Principal Broker Yeilen Contreras confirmarán la fecha de tu cita presencial vía WhatsApp y correo electrónico.`
                : `Thank you ${name || ''}. Principal Broker Yeilen Contreras and our executive team will confirm your in-person office visit promptly.`}
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '0.8rem 2.5rem', fontSize: '0.84rem' }}
            >
              <span>{lang === 'es' ? 'Entendido / Cerrar' : 'Done'}</span>
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Value Speech / 4 Pillars Grid */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #E5E0D8',
                padding: '1.25rem 1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Award size={18} color="#660E1A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121418', margin: 0 }}>
                    {lang === 'es' ? '100% Splits & Máxima Ganancia' : 'Top Commission Splits'}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#5A606D', margin: '0.15rem 0 0 0', lineHeight: 1.4 }}>
                    {lang === 'es' ? 'Estructura transparente sin cuotas mensuales abusivas.' : 'Keep maximum proceeds with zero hidden desk fees.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <TrendingUp size={18} color="#660E1A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121418', margin: 0 }}>
                    {lang === 'es' ? 'Tecnología MLS & Leads Reales' : 'MLS Data & Real Leads'}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#5A606D', margin: '0.15rem 0 0 0', lineHeight: 1.4 }}>
                    {lang === 'es' ? 'Herramientas digitales avanzadas y flujo de compradores.' : 'Modern CRM, GLAR integration and active buyer pipeline.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Users size={18} color="#660E1A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121418', margin: 0 }}>
                    {lang === 'es' ? 'Mentoría Directa de Broker' : 'Direct Broker Support'}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#5A606D', margin: '0.15rem 0 0 0', lineHeight: 1.4 }}>
                    {lang === 'es' ? 'Respaldo legal, técnico y estratégico en cada contrato.' : 'One-on-one contract and negotiation coaching.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Building2 size={18} color="#660E1A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121418', margin: 0 }}>
                    {lang === 'es' ? 'Oficinas Ejecutivas en Dupont' : 'Prime Corporate Office'}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#5A606D', margin: '0.15rem 0 0 0', lineHeight: 1.4 }}>
                    {lang === 'es' ? 'Salas de firmas y reuniones privadas para tus clientes.' : 'Professional meeting suites in Louisville.'}
                  </p>
                </div>
              </div>
            </div>

            {/* In-Person Interview Booking Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                    {lang === 'es' ? 'Nombre y Apellidos' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'es' ? 'Ej: Alejandro Morales' : 'e.g. Alex Morgan'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #DCD5C9',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                    {lang === 'es' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(502) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #DCD5C9',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                    {lang === 'es' ? 'Correo Electrónico' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #DCD5C9',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                    {lang === 'es' ? 'Estado de Licencia Inmobiliaria' : 'Current Real Estate License'}
                  </label>
                  <select
                    value={licenseStatus}
                    onChange={(e) => setLicenseStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #DCD5C9',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Licensed in KY">{lang === 'es' ? 'Licencia activa en Kentucky' : 'Active Kentucky License'}</option>
                    <option value="In Real Estate School">{lang === 'es' ? 'En curso / Por tomar examen' : 'In Real Estate School / Taking Exam'}</option>
                    <option value="Seeking License">{lang === 'es' ? 'Interesado en iniciar carrera' : 'Looking to Get Licensed'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                    {lang === 'es' ? 'Fecha Preferida en Oficina' : 'Preferred Office Date'}
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #DCD5C9',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                    {lang === 'es' ? 'Horario Preferido' : 'Preferred Time'}
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #DCD5C9',
                      color: '#121418',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="9:30 AM">9:30 AM (Mañana)</option>
                    <option value="11:30 AM">11:30 AM (Mañana)</option>
                    <option value="2:00 PM">2:00 PM (Tarde)</option>
                    <option value="4:00 PM">4:00 PM (Tarde)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '0.5rem',
                  padding: '0.95rem',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  cursor: isSubmitting ? 'wait' : 'pointer'
                }}
              >
                <span>
                  {isSubmitting
                    ? (lang === 'es' ? 'Enviando Solicitud...' : 'Submitting Request...')
                    : (lang === 'es' ? 'AGENDAR ENTREVISTA PRESENCIAL' : 'CONFIRM IN-PERSON INTERVIEW')}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalContentScale {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
