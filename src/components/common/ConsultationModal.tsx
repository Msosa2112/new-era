import React, { useState } from 'react';
import { X, CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { HexPattern } from './HexPattern';
import { BROKERAGE_DATA } from '../../data/agentsData';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        backgroundColor: 'rgba(12, 13, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'var(--shadow-dark)',
          position: 'relative',
          padding: '2.5rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <HexPattern variant="gradient-vibrant" opacity={0.18} size={240} />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <BrandLogo variant="monogram-white" height={32} />
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.85rem',
              marginTop: '0.75rem',
              marginBottom: '0.25rem',
              color: '#FFFFFF'
            }}
          >
            {lang === 'es' ? 'Agendar Consulta Privada' : 'Schedule Private Advisory'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            {lang === 'es'
              ? 'Atención personalizada con el equipo ejecutivo de New Era Real Estate.'
              : 'Direct consultation with our principal broker and advisory specialists.'}
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              padding: '2rem 1.5rem',
              backgroundColor: 'rgba(114, 22, 35, 0.35)',
              border: '1px solid var(--color-orange-accent)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center'
            }}
          >
            <CheckCircle2 size={36} color="var(--color-orange-accent)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              {lang === 'es' ? 'Consulta Agendada' : 'Advisory Request Received'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                {lang === 'es' ? 'Servicio de Interés' : 'Area of Advisory'}
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Buying a Home" style={{ background: '#121418' }}>Buying a Home / Relocation</option>
                <option value="Selling a Property" style={{ background: '#121418' }}>Selling a Property / Valuation</option>
                <option value="Down Payment Assistance" style={{ background: '#121418' }}>Down Payment Assistance / ITIN</option>
                <option value="Commercial / Investment" style={{ background: '#121418' }}>Commercial / Investment Portfolios</option>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.2rem' }}>
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.2rem' }}>
                  Preferred Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="9:00 AM" style={{ background: '#121418' }}>9:00 AM</option>
                  <option value="11:00 AM" style={{ background: '#121418' }}>11:00 AM</option>
                  <option value="2:00 PM" style={{ background: '#121418' }}>2:00 PM</option>
                  <option value="4:30 PM" style={{ background: '#121418' }}>4:30 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: 'var(--color-orange-accent)',
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
    </div>
  );
};
