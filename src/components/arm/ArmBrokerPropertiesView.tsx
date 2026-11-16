import React, { useMemo, useState } from 'react';
import {
  Building2,
  Eye,
  FileText,
  MapPin,
  Phone,
  Search,
  Wallet,
  X,
} from 'lucide-react';
import { Agent, Property } from '../../types/property';
import { ArmState } from '../../types/arm';
import { ArmPalette, formatUsd } from './armTheme';
import { createArmDeal } from '../../services/armStore';

export interface BrokerPropertyCardItem {
  id: string;
  address: string;
  cityStateZip: string;
  price: number;
  status: string;
  statusCategory: 'active' | 'pending';
  mlsId?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  agentId: string;
  dealId?: string;
  clientName?: string;
  sourceLabel: 'New Era' | 'Contrato' | 'Louisville';
}

interface ArmBrokerPropertiesViewProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  allAgents: Agent[];
  properties: Property[];
  armState: ArmState;
  onOpenDeal: (dealId: string) => void;
  onOpenCommissionForProperty: (draft: {
    address: string;
    price: number;
    agentId: string;
    mlsId?: string;
    clientName?: string;
  }) => void;
  onImpersonateAgent: (agentId: string) => void;
  onToast: (msg: string) => void;
}

const FALLBACK_HOUSE_IMG = '/assets/masterclass/house-louisville-clean.jpg';

export const ArmBrokerPropertiesView: React.FC<ArmBrokerPropertiesViewProps> = ({
  lang,
  palette,
  allAgents,
  properties,
  armState,
  onOpenDeal,
  onOpenCommissionForProperty,
  onImpersonateAgent,
  onToast,
}) => {
  const [selectedRealtorId, setSelectedRealtorId] = useState<string>('all');
  const [addressSearch, setAddressSearch] = useState('');
  const [realtorFilter, setRealtorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [includeAllCity, setIncludeAllCity] = useState(false);

  const portfolioItems = useMemo<BrokerPropertyCardItem[]>(() => {
    const items: BrokerPropertyCardItem[] = [];
    const seenAddresses = new Set<string>();

    for (const p of properties) {
      const isNewEra = Boolean(p.agentId || p.isNewEra || p.mls?.isNewEra);
      if (!isNewEra && !includeAllCity) continue;

      const addr = p.location?.address || p.title || 'Propiedad';
      const normAddr = addr.toLowerCase().split(',')[0].trim();
      seenAddresses.add(normAddr);

      const matchingDeal = armState.deals.find((d) =>
        d.propertyAddress.toLowerCase().includes(normAddr)
      );
      const isPending =
        p.status === 'Pending' || p.status === 'Sold' || Boolean(matchingDeal);

      items.push({
        id: p.id,
        address: addr,
        cityStateZip: `${p.location?.city || 'Louisville'}, ${p.location?.state || 'KY'} ${p.location?.zip || ''}`.trim(),
        price: Number(p.price) || 0,
        status: isPending ? 'En Cierre' : 'En Venta',
        statusCategory: isPending ? 'pending' : 'active',
        mlsId: p.mls?.mlsId,
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms || 0,
        sqft: p.sqft || 0,
        imageUrl: p.media?.[0]?.url || FALLBACK_HOUSE_IMG,
        agentId: p.agentId || 'yeilen-contreras',
        dealId: matchingDeal?.id,
        clientName: matchingDeal?.clientName,
        sourceLabel: isNewEra ? 'New Era' : 'Louisville',
      });
    }

    for (const d of armState.deals) {
      const normAddr = d.propertyAddress.toLowerCase().split(',')[0].trim();
      if (seenAddresses.has(normAddr)) continue;
      seenAddresses.add(normAddr);

      items.unshift({
        id: `deal-prop-${d.id}`,
        address: d.propertyAddress,
        cityStateZip: d.city || 'Louisville, KY',
        price: d.price,
        status: d.stage === 'listed' ? 'En Venta' : 'En Cierre',
        statusCategory: d.stage === 'listed' ? 'active' : 'pending',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2650,
        imageUrl: FALLBACK_HOUSE_IMG,
        agentId: d.agentId,
        dealId: d.id,
        clientName: d.clientName,
        sourceLabel: 'Contrato',
      });
    }

    return items;
  }, [properties, armState.deals, includeAllCity]);

  const countByAgent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of portfolioItems) {
      if (item.sourceLabel !== 'Louisville') {
        map[item.agentId] = (map[item.agentId] || 0) + 1;
      }
    }
    return map;
  }, [portfolioItems]);

  const sortedRealtors = useMemo(() => {
    const q = realtorFilter.toLowerCase().trim();
    return [...allAgents]
      .filter((a) => {
        if (!q) return true;
        return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
      })
      .sort((a, b) => (countByAgent[b.id] || 0) - (countByAgent[a.id] || 0));
  }, [allAgents, countByAgent, realtorFilter]);

  const trimmedSearch = addressSearch.trim().toLowerCase();

  const filteredProperties = useMemo(() => {
    return portfolioItems.filter((item) => {
      if (!trimmedSearch && selectedRealtorId !== 'all' && item.agentId !== selectedRealtorId) {
        return false;
      }
      if (statusFilter !== 'all' && item.statusCategory !== statusFilter) {
        return false;
      }
      if (trimmedSearch) {
        const agent = allAgents.find((a) => a.id === item.agentId);
        const matches =
          item.address.toLowerCase().includes(trimmedSearch) ||
          item.cityStateZip.toLowerCase().includes(trimmedSearch) ||
          (item.mlsId || '').toLowerCase().includes(trimmedSearch) ||
          (item.clientName || '').toLowerCase().includes(trimmedSearch) ||
          (agent?.name || '').toLowerCase().includes(trimmedSearch);
        if (!matches) return false;
      }
      return true;
    });
  }, [portfolioItems, selectedRealtorId, statusFilter, trimmedSearch, allAgents]);

  const selectedAgentObj =
    selectedRealtorId !== 'all' && !trimmedSearch
      ? allAgents.find((a) => a.id === selectedRealtorId) || null
      : null;

  const handleOpenOrCreateDeal = (item: BrokerPropertyCardItem) => {
    if (item.dealId) {
      onOpenDeal(item.dealId);
      return;
    }
    const { dealId } = createArmDeal({
      agentId: item.agentId,
      propertyAddress: item.address,
      city: item.cityStateZip,
      price: item.price || 350000,
      transactionType: 'Venta',
      clientName: item.clientName || 'Cliente New Era',
    });
    onToast(
      lang === 'es'
        ? `Contrato abierto para ${item.address}`
        : `Contract opened for ${item.address}`
    );
    onOpenDeal(dealId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Huge Direct Address Search Bar */}
      <div
        style={{
          backgroundColor: palette.bgPanel,
          borderRadius: '20px',
          border: `1.5px solid ${palette.stoneBorder}`,
          padding: '1.35rem 1.5rem',
          boxShadow: palette.shadow,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search
            size={22}
            color={palette.brand}
            style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            placeholder={
              lang === 'es'
                ? 'Escribe aquí la dirección o calle (ej. Palatka, Blue Wing, Grand Ridge)...'
                : 'Type street address or ZIP here...'
            }
            style={{
              width: '100%',
              height: '62px',
              padding: '0.85rem 3rem 0.85rem 3.3rem',
              borderRadius: '14px',
              border: `2px solid ${palette.borderStrong}`,
              backgroundColor: palette.bgSubtle,
              color: palette.text,
              fontSize: '1.15rem',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {addressSearch && (
            <button
              type="button"
              onClick={() => setAddressSearch('')}
              aria-label="Borrar búsqueda"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: palette.text,
                cursor: 'pointer',
                padding: '0.4rem',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(
              [
                { id: 'all', label: lang === 'es' ? 'Todas' : 'All' },
                { id: 'active', label: lang === 'es' ? 'En Venta' : 'For Sale' },
                { id: 'pending', label: lang === 'es' ? 'En Cierre' : 'Closing' },
              ] as const
            ).map((f) => {
              const active = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  style={{
                    height: '48px',
                    padding: '0 1.2rem',
                    borderRadius: '12px',
                    border: active ? `2px solid ${palette.brand}` : `1.5px solid ${palette.stoneBorder}`,
                    backgroundColor: active ? palette.brand : palette.bgSubtle,
                    color: active ? palette.brandTextOnPrimary : palette.text,
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIncludeAllCity((prev) => !prev)}
            style={{
              height: '48px',
              padding: '0 1.1rem',
              borderRadius: '12px',
              border: includeAllCity ? `2px solid ${palette.brand}` : `1.5px solid ${palette.stoneBorder}`,
              backgroundColor: includeAllCity ? palette.brandSoft : palette.bgPanel,
              color: palette.text,
              fontSize: '0.96rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {includeAllCity
              ? lang === 'es'
                ? 'Mostrando toda la ciudad (activo)'
                : 'Showing full city (on)'
              : lang === 'es'
              ? 'Buscar también en toda la ciudad'
              : 'Also search entire city'}
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Left Realtors, Right Big Property Cards */}
      <div className="arm-broker-props-grid">
        {/* Left Column */}
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '20px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.15rem',
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}
        >
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: palette.text }}>
            {lang === 'es' ? 'Toca un agente' : 'Tap an agent'}
          </div>

          <input
            type="text"
            value={realtorFilter}
            onChange={(e) => setRealtorFilter(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar nombre...' : 'Search name...'}
            style={{
              width: '100%',
              height: '48px',
              padding: '0.55rem 0.9rem',
              borderRadius: '11px',
              border: `1.5px solid ${palette.stoneBorder}`,
              backgroundColor: palette.bgSubtle,
              color: palette.text,
              fontSize: '0.96rem',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="button"
            onClick={() => {
              setSelectedRealtorId('all');
              setAddressSearch('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '54px',
              padding: '0 1rem',
              borderRadius: '12px',
              border:
                selectedRealtorId === 'all' && !trimmedSearch
                  ? `2px solid ${palette.brand}`
                  : `1.5px solid ${palette.stoneBorder}`,
              backgroundColor:
                selectedRealtorId === 'all' && !trimmedSearch ? palette.brand : palette.bgSubtle,
              color:
                selectedRealtorId === 'all' && !trimmedSearch
                  ? palette.brandTextOnPrimary
                  : palette.text,
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} />
              <span>{lang === 'es' ? 'Toda la oficina' : 'All office'}</span>
            </span>
            <span>{portfolioItems.filter((i) => i.sourceLabel !== 'Louisville').length}</span>
          </button>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '560px',
              overflowY: 'auto',
              paddingRight: '0.2rem',
            }}
          >
            {sortedRealtors.map((agent) => {
              const count = countByAgent[agent.id] || 0;
              const isSelected = selectedRealtorId === agent.id && !trimmedSearch;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    setSelectedRealtorId(agent.id);
                    setAddressSearch('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.7rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '12px',
                    border: isSelected
                      ? `2px solid ${palette.brand}`
                      : `1px solid ${palette.stoneBorder}`,
                    backgroundColor: isSelected ? palette.brand : palette.bgSubtle,
                    color: isSelected ? palette.brandTextOnPrimary : palette.text,
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <img
                      src={agent.photoUrl}
                      alt={agent.name}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {agent.name}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : palette.bgPanel,
                      color: isSelected ? '#FFFFFF' : palette.text,
                      border: isSelected ? 'none' : `1px solid ${palette.stoneBorder}`,
                      flexShrink: 0,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Property Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedAgentObj && (
            <div
              style={{
                backgroundColor: palette.bgPanel,
                borderRadius: '18px',
                border: `1.5px solid ${palette.stoneBorder}`,
                padding: '1.15rem 1.35rem',
                boxShadow: palette.shadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={selectedAgentObj.photoUrl}
                  alt={selectedAgentObj.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${palette.brand}`,
                  }}
                />
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: palette.text }}>
                    {selectedAgentObj.name}
                  </div>
                  <div style={{ fontSize: '1rem', color: palette.textSecondary, marginTop: '0.15rem' }}>
                    {selectedAgentObj.phone} - {filteredProperties.length} propiedades
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onImpersonateAgent(selectedAgentObj.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  height: '48px',
                  padding: '0 1.1rem',
                  borderRadius: '12px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Eye size={17} />
                <span>{lang === 'es' ? 'Ver su pantalla' : 'Preview agent'}</span>
              </button>
            </div>
          )}

          {filteredProperties.length === 0 ? (
            <div
              style={{
                backgroundColor: palette.bgPanel,
                borderRadius: '20px',
                border: `1.5px solid ${palette.stoneBorder}`,
                padding: '3rem 1.5rem',
                textAlign: 'center',
                color: palette.textSecondary,
              }}
            >
              <strong style={{ display: 'block', fontSize: '1.25rem', color: palette.text, marginBottom: '0.5rem' }}>
                {lang === 'es'
                  ? 'No hay casas con esa búsqueda aquí.'
                  : 'No properties match here.'}
              </strong>
              <button
                type="button"
                onClick={() => {
                  setIncludeAllCity(true);
                  setSelectedRealtorId('all');
                }}
                style={{
                  marginTop: '0.75rem',
                  height: '50px',
                  padding: '0 1.35rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: palette.brand,
                  color: palette.brandTextOnPrimary,
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {lang === 'es' ? 'Buscar en toda la ciudad' : 'Search entire city'}
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.1rem',
              }}
            >
              {filteredProperties.slice(0, 60).map((item) => {
                const ownerAgent = allAgents.find((a) => a.id === item.agentId);

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: palette.bgPanel,
                      borderRadius: '18px',
                      border: `1.5px solid ${palette.stoneBorder}`,
                      overflow: 'hidden',
                      boxShadow: palette.shadow,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ position: 'relative', height: '190px' }}>
                        <img
                          src={item.imageUrl}
                          alt={item.address}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_HOUSE_IMG;
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '12px',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            backgroundColor: '#FFFFFF',
                            color: '#121418',
                            border: '1px solid #D6CFC4',
                          }}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div style={{ padding: '1.1rem 1.15rem 0.75rem' }}>
                        <div style={{ fontSize: '1.55rem', fontWeight: 900, color: palette.text }}>
                          {formatUsd(item.price)}
                        </div>
                        <div
                          style={{
                            fontSize: '1.08rem',
                            fontWeight: 800,
                            color: palette.text,
                            marginTop: '0.2rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.address}
                        </div>
                        <div
                          style={{
                            fontSize: '0.88rem',
                            color: palette.textSecondary,
                            marginTop: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <MapPin size={14} />
                          <span>{item.cityStateZip}</span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            color: palette.textSecondary,
                            marginTop: '0.5rem',
                            fontWeight: 600,
                          }}
                        >
                          {item.bedrooms} hab - {item.bathrooms} baños -{' '}
                          {item.sqft > 0 ? `${item.sqft.toLocaleString('en-US')} sqft` : 'Lote'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '0 1.15rem 1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      {ownerAgent && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '12px',
                            backgroundColor: palette.bgSubtle,
                            border: `1px solid ${palette.border}`,
                          }}
                        >
                          <img
                            src={ownerAgent.photoUrl}
                            alt={ownerAgent.name}
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: palette.text }}>
                              {ownerAgent.name}
                            </div>
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: palette.textSecondary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              <Phone size={11} />
                              <span>{ownerAgent.phone}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenOrCreateDeal(item)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            height: '48px',
                            borderRadius: '11px',
                            border: `1.5px solid ${palette.stoneBorder}`,
                            backgroundColor: palette.bgPanel,
                            color: palette.text,
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <FileText size={15} />
                          <span>Contrato</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onOpenCommissionForProperty({
                              address: item.address,
                              price: item.price,
                              agentId: item.agentId,
                              mlsId: item.mlsId,
                              clientName: item.clientName,
                            })
                          }
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            height: '48px',
                            borderRadius: '11px',
                            border: 'none',
                            backgroundColor: palette.brand,
                            color: palette.brandTextOnPrimary,
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <Wallet size={15} />
                          <span>Pagar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .arm-broker-props-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .arm-broker-props-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
