import React, { useState } from 'react';
import {
  X,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Calculator,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Property, TourBookingRequest } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { BROKERAGE_DATA } from '../../data/agentsData';

interface PropertyDetailViewProps {
  property: Property;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  lang: 'en' | 'es';
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onClose,
  onSelectProperty,
  lang
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('11:00 AM');
  const [tourType, setTourType] = useState<'In-Person' | 'Live Video Tour'>('In-Person');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [tourBooked, setTourBooked] = useState(false);

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const agent = propertyService.getAgentById(property.agentId);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  React.useEffect(() => {
    propertyService.getSimilarProperties(property.id, 2).then(setSimilarProperties);
  }, [property.id]);

  // Mortgage calculation
  const downPaymentAmount = (property.price * downPaymentPercent) / 100;
  const loanPrincipal = property.price - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const monthlyMortgage =
    (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  const estimatedMonthlyTax = (property.mls.taxAnnualAmount || 6000) / 12;
  const estimatedInsurance = (property.price * 0.004) / 12;
  const totalMonthlyPayment = Math.round(monthlyMortgage + estimatedMonthlyTax + estimatedInsurance + (property.mls.hoaFee || 0));

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTourBooked(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(12, 13, 16, 0.92)',
        backdropFilter: 'blur(16px)',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-dark)',
          position: 'relative',
          margin: 'auto 0'
        }}
      >
        {/* Sticky Close / Header Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="tag-badge tag-badge-accent">{property.status}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              MLS #{property.mls.mlsId}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition-fast)'
            }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cinematic Media Carousel */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(340px, 50vh, 580px)',
            backgroundColor: '#000000',
            overflow: 'hidden'
          }}
        >
          <img
            src={property.media[activeMediaIndex]?.url || property.media[0]?.url}
            alt={property.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Navigation Controls */}
          {property.media.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveMediaIndex((prev) =>
                    prev === 0 ? property.media.length - 1 : prev - 1
                  )
                }
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(18, 20, 24, 0.75)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setActiveMediaIndex((prev) =>
                    prev === property.media.length - 1 ? 0 : prev + 1
                  )
                }
                style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(18, 20, 24, 0.75)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Media Caption & Index Pill */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '2rem',
              right: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(18, 20, 24, 0.8)',
                color: '#FFFFFF',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8rem',
                backdropFilter: 'blur(6px)'
              }}
            >
              {property.media[activeMediaIndex]?.caption || property.title}
            </span>

            <span
              style={{
                backgroundColor: 'rgba(18, 20, 24, 0.8)',
                color: '#FFFFFF',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}
            >
              {activeMediaIndex + 1} / {property.media.length}
            </span>
          </div>
        </div>

        {/* Content Body Layout */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 3.5rem)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Story, Specs, Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-orange-accent)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                  }}
                >
                  <MapPin size={15} />
                  <span>{property.location.neighborhood}, {property.location.city}, KY</span>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                    fontWeight: 400,
                    lineHeight: 1.15,
                    marginBottom: '0.5rem'
                  }}
                >
                  {property.title}
                </h1>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                </p>

                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.75rem',
                    fontWeight: 600,
                    color: 'var(--color-burgundy-primary)',
                    marginTop: '1rem'
                  }}
                >
                  {formattedPrice}
                </div>
              </div>

              {/* Key Architectural Specs Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '1rem',
                  padding: '1.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Bedrooms</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.bedrooms} Beds</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Bathrooms</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.bathrooms} Baths</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Living Space</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.sqft.toLocaleString()} Sq Ft</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Year Built</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.mls.yearBuilt}</div>
                </div>
              </div>

              {/* The Property Narrative */}
              <div>
                <span className="display-subtitle">THE PROPERTY</span>
                <p
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginTop: '0.75rem'
                  }}
                >
                  {property.description}
                </p>

                {property.highlightStory && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '1.25rem 1.5rem',
                      borderLeft: '3px solid var(--color-orange-accent)',
                      backgroundColor: 'rgba(230, 74, 42, 0.04)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.15rem',
                      fontStyle: 'italic',
                      color: 'var(--color-charcoal-900)'
                    }}
                  >
                    "{property.highlightStory}"
                  </div>
                )}
              </div>

              {/* The Details / Features Category */}
              <div>
                <span className="display-subtitle">ARCHITECTURAL FEATURES</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                  {property.features.map((cat, idx) => (
                    <div key={idx}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {cat.category}
                      </h4>
                      <ul
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '0.6rem',
                          listStyle: 'none'
                        }}
                      >
                        {cat.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.9rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <CheckCircle2 size={15} color="var(--color-burgundy-primary)" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mortgage Calculator Section */}
              <div
                style={{
                  padding: '1.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Calculator size={18} color="var(--color-orange-accent)" />
                  <span className="display-subtitle" style={{ margin: 0 }}>
                    {lang === 'es' ? 'Estimador de Hipoteca' : 'Mortgage Estimator'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {lang === 'es' ? 'Pago Mensual Estimado:' : 'Estimated Monthly Payment:'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-burgundy-primary)' }}>
                    ${totalMonthlyPayment.toLocaleString()}/mo
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Down Payment ({downPaymentPercent}%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-burgundy-primary)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>${downPaymentAmount.toLocaleString()}</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Interest Rate ({interestRate}%)
                    </label>
                    <input
                      type="range"
                      min="4.0"
                      max="10.0"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-burgundy-primary)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{interestRate}% Fixed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Agent Card & Private Tour Booking Form */}
            <div style={{ position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Agent Representation Card */}
              {agent && (
                <div
                  style={{
                    padding: '2rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span className="display-subtitle">YOUR ADVISORY AGENT</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: '1.25rem 0' }}>
                    <img
                      src={agent.photoUrl}
                      alt={agent.name}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-burgundy-primary)'
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{agent.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-orange-accent)', fontWeight: 600 }}>{agent.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{BROKERAGE_DATA.name}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {agent.bio}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <a
                      href={`tel:${agent.phone.replace(/[^0-9]/g, '')}`}
                      className="btn-outline"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.75rem' }}
                    >
                      <Phone size={14} color="var(--color-burgundy-primary)" />
                      <span>{agent.phone}</span>
                    </a>

                    <a
                      href={`mailto:${agent.email}`}
                      className="btn-outline"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.75rem' }}
                    >
                      <Mail size={14} color="var(--color-burgundy-primary)" />
                      <span>Email Advisor</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Private Tour Booking Form */}
              <div
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--color-charcoal-950)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={16} color="var(--color-orange-accent)" />
                  <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)', margin: 0 }}>
                    {lang === 'es' ? 'RECORRIDO PRIVADO' : 'SCHEDULE PRIVATE TOUR'}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                  {lang === 'es'
                    ? 'Coordina una visita confidencial con el equipo de New Era Real Estate.'
                    : 'Experience this residence with an architectural preview tour.'}
                </p>

                {tourBooked ? (
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'rgba(114, 22, 35, 0.3)',
                      border: '1px solid var(--color-orange-accent)',
                      borderRadius: 'var(--radius-xs)',
                      textAlign: 'center'
                    }}
                  >
                    <CheckCircle2 size={32} color="var(--color-orange-accent)" style={{ margin: '0 auto 0.75rem' }} />
                    <h4 style={{ color: '#FFFFFF', marginBottom: '0.35rem' }}>
                      {lang === 'es' ? 'Visita Solicitada' : 'Tour Requested'}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {lang === 'es'
                        ? 'Un asesor de New Era confirmará tu cita en los próximos 15 minutos.'
                        : 'A New Era advisor will confirm your private itinerary shortly.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTourSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Tour Type */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(['In-Person', 'Live Video Tour'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setTourType(type)}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-xs)',
                            border: tourType === type ? '1px solid var(--color-orange-accent)' : '1px solid rgba(255, 255, 255, 0.15)',
                            backgroundColor: tourType === type ? 'rgba(230, 74, 42, 0.15)' : 'transparent',
                            color: '#FFFFFF'
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          borderRadius: 'var(--radius-xs)'
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          borderRadius: 'var(--radius-xs)'
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          borderRadius: 'var(--radius-xs)'
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number (e.g. 502-500-0409)"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          borderRadius: 'var(--radius-xs)'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: '0.5rem',
                        backgroundColor: 'var(--color-orange-accent)'
                      }}
                    >
                      <span>CONFIRM TOUR REQUEST</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
