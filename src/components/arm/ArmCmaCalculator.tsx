import React, { useMemo, useState } from 'react';
import {
  Calculator,
  MapPin,
  PlusCircle,
  Printer,
} from 'lucide-react';
import { Property } from '../../types/property';
import { ArmSessionAgent } from '../../types/arm';
import { ArmPalette, formatUsd } from './armTheme';
import { createArmDeal } from '../../services/armStore';

interface ArmCmaCalculatorProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  activeAgent: ArmSessionAgent;
  properties: Property[];
  onCreatedDeal: (dealId: string) => void;
  onToast: (msg: string) => void;
}

const LOUISVILLE_PRESETS = [
  { label: 'Norton Commons', address: '9410 Norton Commons Blvd', city: 'Prospect', zip: '40059', beds: 4, baths: 3, sqft: 2900, garage: 2 },
  { label: 'Prospect / Wolf Pen', address: '7512 Wolf Pen Branch Rd', city: 'Prospect', zip: '40059', beds: 4, baths: 3.5, sqft: 3400, garage: 3 },
  { label: 'St. Matthews', address: '3915 Taylorsville Rd', city: 'Louisville', zip: '40220', beds: 3, baths: 2, sqft: 1950, garage: 2 },
  { label: 'Highlands / Cherokee', address: '2420 Cherokee Pkwy', city: 'Louisville', zip: '40204', beds: 4, baths: 2.5, sqft: 2600, garage: 2 },
  { label: 'Okolona / Shepherdsville', address: '6814 Shepherdsville Rd', city: 'Louisville', zip: '40219', beds: 3, baths: 2, sqft: 1750, garage: 2 },
  { label: 'Jeffersontown', address: '10412 Watterson Trail', city: 'Jeffersontown', zip: '40299', beds: 4, baths: 2.5, sqft: 2300, garage: 2 },
];

type ConditionTier = 'luxury' | 'excellent' | 'good' | 'needs_work';

const CONDITION_MULTIPLIER: Record<ConditionTier, { factor: number; labelEs: string; labelEn: string }> = {
  luxury: { factor: 1.08, labelEs: 'Remodelada / Lujo', labelEn: 'Remodeled / Luxury' },
  excellent: { factor: 1.04, labelEs: 'Muy Buena', labelEn: 'Very Good' },
  good: { factor: 1.0, labelEs: 'Normal / Buena', labelEn: 'Standard / Good' },
  needs_work: { factor: 0.92, labelEs: 'Necesita Arreglos', labelEn: 'Needs Work' },
};

export const ArmCmaCalculator: React.FC<ArmCmaCalculatorProps> = ({
  lang,
  palette,
  activeAgent,
  properties,
  onCreatedDeal,
  onToast,
}) => {
  const [address, setAddress] = useState('9410 Norton Commons Blvd');
  const [city, setCity] = useState('Prospect');
  const [zip, setZip] = useState('40059');
  const [beds, setBeds] = useState(4);
  const [baths, setBaths] = useState(3);
  const [sqft, setSqft] = useState(2900);
  const [garage, setGarage] = useState(2);
  const [condition, setCondition] = useState<ConditionTier>('excellent');
  const [ownerName, setOwnerName] = useState('Propietario');

  const cmaResult = useMemo(() => {
    const validComps = properties.filter((p) => p.price > 50000 && p.sqft > 400);

    const scored = validComps.map((p) => {
      let score = 0;
      if (p.location.zip === zip.trim()) score += 45;
      if (p.location.city.toLowerCase() === city.trim().toLowerCase()) score += 25;
      score -= Math.abs(p.bedrooms - beds) * 14;
      score -= Math.abs(p.bathrooms - baths) * 10;
      score -= Math.min(40, Math.abs(p.sqft - sqft) / 60);
      return { prop: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topComps = scored.slice(0, 4).map((s) => s.prop);

    const compPricesPerSqft = topComps.map((c) => c.price / Math.max(c.sqft, 600));
    const avgPricePerSqft =
      compPricesPerSqft.length > 0
        ? compPricesPerSqft.reduce((a, b) => a + b, 0) / compPricesPerSqft.length
        : city.toLowerCase().includes('prospect')
        ? 228
        : 192;

    const baseVal = sqft * avgPricePerSqft;
    const bedAdj = (beds - 3) * 11500;
    const bathAdj = (baths - 2) * 8500;
    const garageAdj = (garage - 2) * 7500;
    const condFactor = CONDITION_MULTIPLIER[condition].factor;

    const rawSuggested = (baseVal + bedAdj + bathAdj + garageAdj) * condFactor;
    const suggestedPrice = Math.round(rawSuggested / 1000) * 1000;
    const conservativePrice = Math.round((suggestedPrice * 0.96) / 1000) * 1000;
    const optimisticPrice = Math.round((suggestedPrice * 1.05) / 1000) * 1000;

    return {
      topComps,
      suggestedPrice,
      conservativePrice,
      optimisticPrice,
    };
  }, [properties, city, zip, beds, baths, sqft, garage, condition]);

  const handleCreateSellingDeal = () => {
    const { dealId } = createArmDeal({
      agentId: activeAgent.id,
      propertyAddress: address,
      city: `${city}, KY ${zip}`,
      price: cmaResult.suggestedPrice,
      transactionType: 'Venta',
      clientName: ownerName.trim() || 'Propietario',
    });
    onToast(`Contrato de venta creado por ${formatUsd(cmaResult.suggestedPrice)}`);
    onCreatedDeal(dealId);
  };

  return (
    <div className="arm-cma-grid">
      {/* Left: Inputs */}
      <div
        style={{
          backgroundColor: palette.bgPanel,
          borderRadius: '20px',
          border: `1.5px solid ${palette.stoneBorder}`,
          padding: '1.4rem',
          boxShadow: palette.shadow,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={20} color={palette.brand} />
          <strong style={{ fontSize: '1.18rem', color: palette.text }}>
            {lang === 'es' ? 'Datos de la Casa' : 'Home Details'}
          </strong>
        </div>

        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.45rem' }}>
            Zonas rápidas:
          </div>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {LOUISVILLE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setAddress(p.address);
                  setCity(p.city);
                  setZip(p.zip);
                  setBeds(p.beds);
                  setBaths(p.baths);
                  setSqft(p.sqft);
                  setGarage(p.garage);
                }}
                style={{
                  height: '40px',
                  padding: '0 0.85rem',
                  borderRadius: '9px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                height: '50px',
                padding: '0 0.9rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
                Ciudad
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', height: '48px', padding: '0 0.85rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.98rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
                Código Postal
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                style={{ width: '100%', height: '48px', padding: '0 0.85rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.98rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
                Cuartos
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={beds}
                onChange={(e) => setBeds(Math.max(1, Number(e.target.value) || 1))}
                style={{ width: '100%', height: '48px', padding: '0 0.75rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
                Baños
              </label>
              <input
                type="number"
                step="0.5"
                min={1}
                max={8}
                value={baths}
                onChange={(e) => setBaths(Math.max(1, Number(e.target.value) || 1))}
                style={{ width: '100%', height: '48px', padding: '0 0.75rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
                Garaje
              </label>
              <input
                type="number"
                min={0}
                max={6}
                value={garage}
                onChange={(e) => setGarage(Math.max(0, Number(e.target.value) || 0))}
                style={{ width: '100%', height: '48px', padding: '0 0.75rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: palette.textSecondary }}>
                Tamaño (Pies Cuadrados)
              </label>
              <strong style={{ fontSize: '1rem', color: palette.brand }}>
                {sqft.toLocaleString('en-US')} sqft
              </strong>
            </div>
            <input
              type="range"
              min={900}
              max={6500}
              step={50}
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              style={{ width: '100%', accentColor: palette.brand }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
              Estado de la casa
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ConditionTier)}
              style={{ width: '100%', height: '50px', padding: '0 0.85rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.98rem' }}
            >
              {Object.entries(CONDITION_MULTIPLIER).map(([key, item]) => (
                <option key={key} value={key}>
                  {lang === 'es' ? item.labelEs : item.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.25rem' }}>
              Nombre del dueño
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              style={{ width: '100%', height: '48px', padding: '0 0.85rem', borderRadius: '10px', border: `1.5px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.98rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* Right: Result + Nearby Comparable Homes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '20px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.5rem',
            boxShadow: palette.shadow,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: palette.brand, textTransform: 'uppercase' }}>
                Precio Recomendado de Venta
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 3rem)', fontWeight: 800, color: palette.text, marginTop: '0.2rem', lineHeight: 1.05 }}>
                {formatUsd(cmaResult.suggestedPrice)}
              </div>
              <div style={{ fontSize: '0.98rem', color: palette.textSecondary, marginTop: '0.35rem' }}>
                <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                {address}, {city}, KY {zip}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  height: '50px',
                  padding: '0 1.1rem',
                  borderRadius: '11px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgPanel,
                  color: palette.text,
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Printer size={16} />
                <span>Imprimir Hoja</span>
              </button>
              <button
                type="button"
                onClick={handleCreateSellingDeal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  height: '50px',
                  padding: '0 1.2rem',
                  borderRadius: '11px',
                  border: 'none',
                  backgroundColor: palette.brand,
                  color: palette.brandTextOnPrimary,
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <PlusCircle size={16} />
                <span>Crear Contrato</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.8rem',
              marginTop: '1.25rem',
            }}
          >
            <div style={{ padding: '0.9rem', borderRadius: '12px', backgroundColor: palette.bgSubtle, border: `1px solid ${palette.stoneBorder}` }}>
              <div style={{ fontSize: '0.8rem', color: palette.textSecondary, fontWeight: 700 }}>Venta Rápida</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: palette.text, marginTop: '0.2rem' }}>{formatUsd(cmaResult.conservativePrice)}</div>
            </div>
            <div style={{ padding: '0.9rem', borderRadius: '12px', backgroundColor: palette.brandSoft, border: `1.5px solid ${palette.brandBorder}` }}>
              <div style={{ fontSize: '0.8rem', color: palette.brand, fontWeight: 800 }}>Precio Sugerido</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: palette.brand, marginTop: '0.2rem' }}>{formatUsd(cmaResult.suggestedPrice)}</div>
            </div>
            <div style={{ padding: '0.9rem', borderRadius: '12px', backgroundColor: palette.bgSubtle, border: `1px solid ${palette.stoneBorder}` }}>
              <div style={{ fontSize: '0.8rem', color: palette.textSecondary, fontWeight: 700 }}>Precio Alto</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: palette.text, marginTop: '0.2rem' }}>{formatUsd(cmaResult.optimisticPrice)}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '20px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.35rem',
            boxShadow: palette.shadow,
          }}
        >
          <strong style={{ display: 'block', fontSize: '1.12rem', color: palette.text, marginBottom: '0.9rem' }}>
            Casas Parecidas en la Zona ({cmaResult.topComps.length})
          </strong>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem' }}>
            {cmaResult.topComps.map((comp) => {
              const imgUrl = comp.media?.[0]?.url || '/assets/masterclass/house-louisville-clean.jpg';
              return (
                <div
                  key={comp.id}
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: palette.bgSubtle,
                    border: `1px solid ${palette.stoneBorder}`,
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={comp.location.address}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/masterclass/house-louisville-clean.jpg';
                    }}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '0.85rem' }}>
                    <strong style={{ fontSize: '1.15rem', color: palette.text }}>{formatUsd(comp.price)}</strong>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: palette.text, marginTop: '0.2rem' }}>
                      {comp.location.address}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: palette.textSecondary, marginTop: '0.2rem' }}>
                      {comp.bedrooms} hab - {comp.bathrooms} baños - {comp.sqft.toLocaleString('en-US')} sqft
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .arm-cma-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .arm-cma-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
