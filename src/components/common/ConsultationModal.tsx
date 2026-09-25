import React, { useState } from 'react';
import { X, CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { HexPattern } from './HexPattern';
import { BROKERAGE_DATA } from '../../data/agentsData';
import { submitLead } from '../../lib/supabase';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Buying a Home');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitLead({
      name,
      email,
      phone,
      message: notes,
      type: 'general',
      metadata: { service, preferredDate: date, preferredTime: time }
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      className="consultation-modal-backdrop"
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
        padding: '1.5rem',
        animation: 'modalBackdropFade 180ms var(--ease-out-fluid) both'
      }}
    >
      <div
        className="consultation-modal-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FAF7F2',
          color: '#121418',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #E5E0D8',
          boxShadow: '0 25px 60px -12px rgba(18, 20, 24, 0.25)',
          position: 'relative',
          padding: '2.5rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'modalContentScale 240ms var(--ease-out-fluid) both',
          willChange: 'transform, opacity'
        }}
      >
        <HexPattern variant="burgundy" opacity={0.06} />
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
            transition: 'all 0.2s ease'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <BrandLogo variant="full-burgundy" height={34} />
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.85rem',
              marginTop: '0.75rem',
              marginBottom: '0.25rem',
              color: '#121418'
            }}
          >
            {lang === 'es' ? 'Agendar Consulta Privada' : 'Schedule Private Advisory'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#5A606D' }}>
            {lang === 'es'
              ? 'Atención personalizada con el equipo ejecutivo de New Era Real Estate.'
              : 'Direct consultation with our principal broker and advisory specialists.'}
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              padding: '2rem 1.5rem',
              backgroundColor: 'rgba(102, 14, 26, 0.06)',
              border: '1.5px solid #660E1A',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <CheckCircle2 className="animate-success-icon" size={40} color="#660E1A" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.25rem', color: '#121418', marginBottom: '0.5rem' }}>
              {lang === 'es' ? 'Consulta Agendada' : 'Advisory Request Received'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#5A606D', marginBottom: '1.5rem' }}>
              {lang === 'es'
                ? 'Nos pondremos en contacto contigo para confirmar el horario de tu cita.'
                : 'A New Era representative will confirm your consultation details promptly.'}
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '0.8rem' }}
            >
              <span>{lang === 'es' ? 'Cerrar' : 'Done'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5A606D', display: 'block', marginBottom: '0.3rem' }}>
                {lang === 'es' ? 'Servicio de Interés' : 'Area of Advisory'}
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #DCD5C9',
                  color: '#121418',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Buying a Home" style={{ background: '#FFFFFF', color: '#121418' }}>Buying a Home / Relocation</option>
                <option value="Selling a Property" style={{ background: '#FFFFFF', color: '#121418' }}>Selling a Property / Valuation</option>
                <option value="Down Payment Assistance" style={{ background: '#FFFFFF', color: '#121418' }}>Down Payment Assistance / ITIN</option>
                <option value="Commercial / Investment" style={{ background: '#FFFFFF', color: '#121418' }}>Commercial / Investment Portfolios</option>
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
                  padding: '0.8rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #DCD5C9',
                  color: '#121418',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #DCD5C9',
                  color: '#121418',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
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
                  padding: '0.8rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #DCD5C9',
                  color: '#121418',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#5A606D', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #DCD5C9',
                    color: '#121418',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: '#5A606D', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                  Preferred Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #DCD5C9',
                    color: '#121418',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="9:00 AM" style={{ background: '#FFFFFF', color: '#121418' }}>9:00 AM</option>
                  <option value="11:00 AM" style={{ background: '#FFFFFF', color: '#121418' }}>11:00 AM</option>
                  <option value="2:00 PM" style={{ background: '#FFFFFF', color: '#121418' }}>2:00 PM</option>
                  <option value="4:30 PM" style={{ background: '#FFFFFF', color: '#121418' }}>4:30 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                padding: '0.9rem'
              }}
            >
              <span>{lang === 'es' ? 'CONFIRMAR SOLICITUD' : 'CONFIRM ADVISORY REQUEST'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
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
