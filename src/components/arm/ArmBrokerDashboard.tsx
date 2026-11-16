import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Calculator,
  Eye,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Wallet,
} from 'lucide-react';
import { Agent } from '../../types/property';
import { ArmSessionAgent, ArmState, ArmTabId } from '../../types/arm';
import { ArmPalette, formatUsd } from './armTheme';

interface ArmBrokerDashboardProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  activeAgent: ArmSessionAgent;
  isBrokerView: boolean;
  allAgents: Agent[];
  armState: ArmState;
  onImpersonateAgent: (agentId: string) => void;
  onNavigateTab: (tab: ArmTabId) => void;
}

export const ArmBrokerDashboard: React.FC<ArmBrokerDashboardProps> = ({
  lang,
  palette,
  activeAgent,
  isBrokerView,
  allAgents,
  armState,
  onImpersonateAgent,
  onNavigateTab,
}) => {
  const [previewAgentId, setPreviewAgentId] = useState<string>(
    allAgents.find((a) => a.id === 'yazbel-diaz')?.id || allAgents[2]?.id || ''
  );

  const commissions = armState.commissions || [];
  const ledger = armState.officeLedger || [];

  const readyToPayCount = commissions.filter(
    (c) => c.status === 'ready_to_pay'
  ).length;

  const companyCollected = commissions
    .filter((c) => c.status !== 'escrow')
    .reduce((sum, c) => sum + (c.brokerageNetAmount || 0), 0);
  const deskIncome = ledger
    .filter((l) => l.entryType === 'income')
    .reduce((sum, l) => sum + (l.amount || 0), 0);
  const officeExpenses = ledger
    .filter((l) => l.entryType === 'expense')
    .reduce((sum, l) => sum + (l.amount || 0), 0);
  const netOfficeProfit = companyCollected + deskIncome - officeExpenses;

  const firstName = activeAgent.name.split(' ')[0];

  const brokerTiles: Array<{
    tab: ArmTabId;
    titleEs: string;
    titleEn: string;
    subEs: string;
    subEn: string;
    icon: React.ComponentType<{ size?: number | string; color?: string }>;
  }> = [
    {
      tab: 'properties',
      titleEs: 'Propiedades',
      titleEn: 'Properties',
      subEs: 'Buscar dirección o tocar agente',
      subEn: 'Search address or tap agent',
      icon: Building2,
    },
    {
      tab: 'finance',
      titleEs: 'Pagos y Caja',
      titleEn: 'Payments & Cash',
      subEs: 'Comisiones, recibos y gastos',
      subEn: 'Commissions, receipts & expenses',
      icon: Wallet,
    },
    {
      tab: 'deals',
      titleEs: 'Contratos',
      titleEn: 'Contracts',
      subEs: 'Revisar papeles y fechas',
      subEn: 'Check files and dates',
      icon: FileText,
    },
    {
      tab: 'messages',
      titleEs: 'Mensajes',
      titleEn: 'Messages',
      subEs: 'WhatsApp, redes y correo',
      subEn: 'WhatsApp, social & email',
      icon: MessageSquare,
    },
    {
      tab: 'studio',
      titleEs: 'Crear Imagen',
      titleEn: 'Create Flyer',
      subEs: 'Flyers y calendario del mes',
      subEn: 'Flyers & monthly calendar',
      icon: ImageIcon,
    },
    {
      tab: 'cma',
      titleEs: 'Calcular Precio',
      titleEn: 'Home Value',
      subEs: 'Valor aproximado de una casa',
      subEn: 'Estimated property price',
      icon: Calculator,
    },
  ];

  const realtorTiles: Array<{
    tab: ArmTabId;
    titleEs: string;
    titleEn: string;
    subEs: string;
    subEn: string;
    icon: React.ComponentType<{ size?: number | string; color?: string }>;
  }> = [
    {
      tab: 'messages',
      titleEs: 'Mensajes',
      titleEn: 'Messages',
      subEs: 'Responder clientes y enviar casas',
      subEn: 'Reply to clients & send homes',
      icon: MessageSquare,
    },
    {
      tab: 'deals',
      titleEs: 'Mis Contratos',
      titleEn: 'My Contracts',
      subEs: 'Subir documentos y ver qué falta',
      subEn: 'Upload files & check status',
      icon: FileText,
    },
    {
      tab: 'studio',
      titleEs: 'Crear Imagen',
      titleEn: 'Create Flyer',
      subEs: 'Hacer flyer con mi foto',
      subEn: 'Create flyer with my photo',
      icon: ImageIcon,
    },
    {
      tab: 'cma',
      titleEs: 'Calcular Precio',
      titleEn: 'Home Value',
      subEs: 'Valor aproximado de una casa',
      subEn: 'Estimated property price',
      icon: Calculator,
    },
  ];

  const tiles = isBrokerView ? brokerTiles : realtorTiles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Big Clear Greeting */}
      <div style={{ paddingTop: '0.25rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            color: palette.text,
            margin: '0 0 0.35rem',
            lineHeight: 1.15,
          }}
        >
          {lang === 'es' ? `Hola, ${firstName}` : `Hello, ${firstName}`}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '1.18rem',
            fontWeight: 500,
            color: palette.textSecondary,
          }}
        >
          {lang === 'es'
            ? 'Toca una opción grande para empezar.'
            : 'Tap any large option below to begin.'}
        </p>
      </div>

      {/* 3 Giant Clean Numbers (Broker Only) */}
      {isBrokerView && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => onNavigateTab('finance')}
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '18px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.45rem 1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: palette.shadow,
            }}
          >
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: palette.textSecondary }}>
              {lang === 'es' ? 'Pagos pendientes' : 'Pending payouts'}
            </div>
            <div style={{ fontSize: '2.45rem', fontWeight: 900, color: palette.text, marginTop: '0.35rem', lineHeight: 1 }}>
              {readyToPayCount}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('deals')}
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '18px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.45rem 1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: palette.shadow,
            }}
          >
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: palette.textSecondary }}>
              {lang === 'es' ? 'Casas en cierre' : 'Active closings'}
            </div>
            <div style={{ fontSize: '2.45rem', fontWeight: 900, color: palette.text, marginTop: '0.35rem', lineHeight: 1 }}>
              {armState.deals.length}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('finance')}
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '18px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.45rem 1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: palette.shadow,
            }}
          >
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: palette.textSecondary }}>
              {lang === 'es' ? 'Ganancia neta oficina' : 'Office net profit'}
            </div>
            <div
              style={{
                fontSize: '2.45rem',
                fontWeight: 900,
                color: netOfficeProfit >= 0 ? palette.positiveMoney : palette.negativeMoney,
                marginTop: '0.35rem',
                lineHeight: 1,
              }}
            >
              {netOfficeProfit >= 0 ? '+' : ''}
              {formatUsd(netOfficeProfit)}
            </div>
          </button>
        </div>
      )}

      {/* Giant 2-Column Navigation Tiles */}
      <div className="arm-home-tiles-grid">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.tab}
              type="button"
              onClick={() => onNavigateTab(tile.tab)}
              className="arm-giant-home-tile"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.1rem',
                minHeight: '138px',
                padding: '1.5rem 1.65rem',
                borderRadius: '20px',
                border: `2px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgPanel,
                color: palette.text,
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: palette.shadow,
                transition: 'border-color 0.15s ease, transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    backgroundColor: palette.brandSoft,
                    border: `1px solid ${palette.brandBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={28} color={palette.brand} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: palette.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {lang === 'es' ? tile.titleEs : tile.titleEn}
                  </div>
                  <div
                    style={{
                      fontSize: '1.02rem',
                      fontWeight: 500,
                      color: palette.textSecondary,
                      marginTop: '0.3rem',
                      lineHeight: 1.35,
                    }}
                  >
                    {lang === 'es' ? tile.subEs : tile.subEn}
                  </div>
                </div>
              </div>

              <ArrowRight size={24} color={palette.brand} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      {/* Simple Bottom Helper: Preview Any Realtor (Broker Only) */}
      {isBrokerView && (
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.25rem 1.5rem',
            boxShadow: palette.shadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: palette.text }}>
              {lang === 'es'
                ? 'Probar la pantalla de un agente'
                : 'Preview an agent screen'}
            </div>
            <div style={{ fontSize: '0.96rem', color: palette.textSecondary }}>
              {lang === 'es'
                ? 'Elige un nombre para ver exactamente lo que ve ese agente.'
                : 'Pick a name to see the exact screen your agent sees.'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <select
              value={previewAgentId}
              onChange={(e) => setPreviewAgentId(e.target.value)}
              style={{
                height: '52px',
                padding: '0 1rem',
                borderRadius: '12px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {allAgents
                .filter((a) => a.id !== activeAgent.id)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>

            <button
              type="button"
              onClick={() => previewAgentId && onImpersonateAgent(previewAgentId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                height: '52px',
                padding: '0 1.25rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: palette.brand,
                color: palette.brandTextOnPrimary,
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <Eye size={18} />
              <span>{lang === 'es' ? 'Entrar a su vista' : 'Open agent view'}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .arm-home-tiles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.1rem;
        }
        .arm-giant-home-tile:hover {
          border-color: ${palette.brand} !important;
          transform: translateY(-2px);
        }
        @media (max-width: 820px) {
          .arm-home-tiles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
