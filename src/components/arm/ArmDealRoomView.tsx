import React, { useMemo, useRef, useState } from 'react';
import {
  Bot,
  CalendarClock,
  FileCheck2,
  FileText,
  MessageCircle,
  Plus,
  Send,
  Upload,
  X,
} from 'lucide-react';
import { Property } from '../../types/property';
import { ArmDeal, ArmSessionAgent, ArmState, DealStage } from '../../types/arm';
import { ArmPalette, formatUsd } from './armTheme';
import {
  askDealCopilot,
  auditPdfForDeal,
  createArmDeal,
  toggleKyChecklistItem,
  triggerCopilotWhatsappRequest,
  updateDealStage,
} from '../../services/armStore';

interface ArmDealRoomViewProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  activeAgent: ArmSessionAgent;
  isBrokerGlobalView: boolean;
  armState: ArmState;
  properties: Property[];
  selectedDealId: string | null;
  onSelectDeal: (dealId: string) => void;
  onToast: (msg: string) => void;
}

const STAGES: Array<{ id: DealStage; labelEs: string; labelEn: string }> = [
  { id: 'listed', labelEs: '1. En Venta', labelEn: '1. For Sale' },
  { id: 'under_contract', labelEs: '2. Con Oferta', labelEn: '2. Offer' },
  { id: 'inspection', labelEs: '3. Inspección', labelEn: '3. Inspection' },
  { id: 'appraisal', labelEs: '4. Tasación', labelEn: '4. Appraisal' },
  { id: 'closing', labelEs: '5. Cierre', labelEn: '5. Closing' },
];

export const ArmDealRoomView: React.FC<ArmDealRoomViewProps> = ({
  lang,
  palette,
  activeAgent,
  isBrokerGlobalView,
  armState,
  properties,
  selectedDealId,
  onSelectDeal,
  onToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copilotInput, setCopilotInput] = useState('');
  const [scanningFile, setScanningFile] = useState<string | null>(null);
  const [lastAuditPreview, setLastAuditPreview] = useState<{
    fileName: string;
    price: string;
    earnest: string;
    closing: string;
    signatures: string;
    pageCount: number;
  } | null>(null);

  const [newDealModalOpen, setNewDealModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newPrice, setNewPrice] = useState('425000');
  const [newType, setNewType] = useState<'Compra' | 'Venta' | 'Renta'>('Compra');
  const [newClosing, setNewClosing] = useState('22 Dic 2026');

  const visibleDeals = useMemo(() => {
    if (isBrokerGlobalView) return armState.deals;
    const own = armState.deals.filter((d) => d.agentId === activeAgent.id);
    return own.length > 0 ? own : armState.deals;
  }, [armState.deals, activeAgent.id, isBrokerGlobalView]);

  const activeDeal: ArmDeal =
    visibleDeals.find((d) => d.id === selectedDealId) || visibleDeals[0];

  const currentStageIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.id === activeDeal?.stage)
  );

  const verifiedCount =
    activeDeal?.checklist.filter((c) => c.status === 'verified').length || 0;
  const totalChecklist = activeDeal?.checklist.length || 8;

  const runPdfAudit = (name: string, sizeBytes: number, rawBuffer?: ArrayBuffer) => {
    if (!activeDeal) return;
    setScanningFile(name);
    setTimeout(() => {
      const { record } = auditPdfForDeal(activeDeal.id, {
        name,
        sizeBytes,
        rawBuffer,
      });
      setLastAuditPreview({
        fileName: record.fileName,
        price: record.extractedPrice,
        earnest: record.extractedEarnest,
        closing: record.extractedClosing,
        signatures: record.extractedSignatures,
        pageCount: record.pageCount,
      });
      setScanningFile(null);
      onToast(
        lang === 'es'
          ? `Documento "${name}" revisado (${record.pageCount} págs.)`
          : `Document "${name}" reviewed`
      );
    }, 900);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer().catch(() => undefined);
    runPdfAudit(file.name, file.size, buf);
    e.target.value = '';
  };

  const handleAskCopilot = (questionText: string) => {
    const clean = questionText.trim();
    if (!clean || !activeDeal) return;
    askDealCopilot(activeDeal.id, clean, lang);
    setCopilotInput('');
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newClient.trim()) return;
    const { dealId } = createArmDeal({
      agentId: activeAgent.id,
      propertyAddress: newAddress.trim(),
      clientName: newClient.trim(),
      price: Number(newPrice) || 400000,
      transactionType: newType,
      closingDateLabel: newClosing,
    });
    onSelectDeal(dealId);
    setNewDealModalOpen(false);
    setNewAddress('');
    setNewClient('');
    onToast(
      lang === 'es'
        ? `Contrato creado para ${newAddress}`
        : `Contract created for ${newAddress}`
    );
  };

  if (!activeDeal) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Deal Selector & 5 Large Step Buttons */}
      <div
        style={{
          backgroundColor: palette.bgPanel,
          borderRadius: '20px',
          border: `1.5px solid ${palette.stoneBorder}`,
          padding: '1.3rem 1.45rem',
          boxShadow: palette.shadow,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.8rem',
          }}
        >
          <select
            value={activeDeal.id}
            onChange={(e) => onSelectDeal(e.target.value)}
            style={{
              height: '54px',
              padding: '0 1rem',
              borderRadius: '12px',
              border: `2px solid ${palette.stoneBorder}`,
              backgroundColor: palette.bgSubtle,
              color: palette.text,
              fontSize: '1.05rem',
              fontWeight: 800,
              maxWidth: '100%',
              flex: '1 1 300px',
            }}
          >
            {visibleDeals.map((d) => (
              <option key={d.id} value={d.id}>
                {d.propertyAddress} - {d.clientName} ({formatUsd(d.price)})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setNewDealModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              height: '54px',
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
            <Plus size={18} />
            <span>{lang === 'es' ? 'Nuevo Contrato' : 'New Contract'}</span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.55rem',
          }}
        >
          {STAGES.map((st, idx) => {
            const isCurrent = idx === currentStageIndex;
            const isPast = idx < currentStageIndex;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  updateDealStage(activeDeal.id, st.id);
                  onToast(
                    lang === 'es'
                      ? `Etapa cambiada a: ${st.labelEs}`
                      : `Stage changed to: ${st.labelEn}`
                  );
                }}
                style={{
                  height: '52px',
                  padding: '0 0.75rem',
                  borderRadius: '12px',
                  border: isCurrent
                    ? `2px solid ${palette.brand}`
                    : `1px solid ${palette.stoneBorder}`,
                  backgroundColor: isCurrent
                    ? palette.brand
                    : isPast
                    ? palette.stoneSoft
                    : palette.bgPanel,
                  color: isCurrent
                    ? palette.brandTextOnPrimary
                    : isPast
                    ? palette.text
                    : palette.textMuted,
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {lang === 'es' ? st.labelEs : st.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2 Columns */}
      <div className="arm-deal-grid">
        {/* Left: PDF Upload + Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.35rem',
              boxShadow: palette.shadow,
            }}
          >
            <strong
              style={{
                display: 'block',
                fontSize: '1.15rem',
                color: palette.text,
                marginBottom: '0.85rem',
              }}
            >
              {lang === 'es' ? 'Subir y Revisar PDF' : 'Upload & Check PDF'}
            </strong>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '1.5rem 1rem',
                borderRadius: '16px',
                border: `2px dashed ${palette.brand}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Upload size={26} color={palette.brand} />
              <strong style={{ fontSize: '1.08rem' }}>
                {scanningFile
                  ? `Revisando "${scanningFile}"...`
                  : lang === 'es'
                  ? 'Toca aquí para subir un documento PDF'
                  : 'Tap here to upload a PDF file'}
              </strong>
            </button>

            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginTop: '0.9rem' }}>
              {[
                { name: 'Contrato_Compra_KY.pdf', size: 1840000, label: 'Probar con Contrato' },
                { name: 'Reporte_Inspeccion.pdf', size: 2450000, label: 'Probar con Inspección' },
              ].map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  disabled={Boolean(scanningFile)}
                  onClick={() => runPdfAudit(sample.name, sample.size)}
                  style={{
                    height: '46px',
                    padding: '0 1rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${palette.stoneBorder}`,
                    backgroundColor: palette.bgPanel,
                    color: palette.text,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {lastAuditPreview && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: '14px',
                  backgroundColor: palette.bgSubtle,
                  border: `1.5px solid ${palette.brand}`,
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: palette.brand, marginBottom: '0.6rem' }}>
                  Revisado: {lastAuditPreview.fileName} ({lastAuditPreview.pageCount} págs.)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.6rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: palette.textSecondary }}>Precio</div>
                    <strong style={{ fontSize: '1rem', color: palette.text }}>{lastAuditPreview.price}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: palette.textSecondary }}>Depósito</div>
                    <strong style={{ fontSize: '1rem', color: palette.text }}>{lastAuditPreview.earnest}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: palette.textSecondary }}>Cierre</div>
                    <strong style={{ fontSize: '1rem', color: palette.text }}>{lastAuditPreview.closing}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: palette.textSecondary }}>Firmas</div>
                    <strong style={{ fontSize: '1rem', color: palette.text }}>{lastAuditPreview.signatures}</strong>
                  </div>
                </div>
              </div>
            )}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck2 size={20} color={palette.brand} />
                <strong style={{ fontSize: '1.15rem', color: palette.text }}>
                  {lang === 'es' ? 'Lista de Documentos' : 'Documents Checklist'}
                </strong>
              </div>
              <span
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9px',
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  border: `1px solid ${palette.stoneBorder}`,
                  fontSize: '0.92rem',
                  fontWeight: 800,
                }}
              >
                {verifiedCount} de {totalChecklist} listos
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeDeal.checklist.map((item) => {
                const isOk = item.status === 'verified';
                const isMissing = item.status === 'missing_urgent';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleKyChecklistItem(activeDeal.id, item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.9rem 1rem',
                      borderRadius: '14px',
                      border: isMissing
                        ? `1.5px solid ${palette.brand}`
                        : `1px solid ${palette.stoneBorder}`,
                      backgroundColor: palette.bgSubtle,
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                      <FileText size={19} color={isMissing ? palette.brand : palette.textSecondary} />
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: palette.text }}>
                          {lang === 'es' ? item.titleEs : item.titleEn}
                        </div>
                        <div style={{ fontSize: '0.86rem', color: palette.textSecondary }}>
                          {lang === 'es' ? item.subtitleEs : item.subtitleEn}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        backgroundColor: isMissing ? palette.brand : palette.bgPanel,
                        color: isMissing ? palette.brandTextOnPrimary : palette.text,
                        border: isMissing ? 'none' : `1px solid ${palette.stoneBorder}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isOk ? 'Listo' : isMissing ? 'Falta' : lang === 'es' ? item.badgeEs : item.badgeEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Ask About Contract + Important Dates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.35rem',
              boxShadow: palette.shadow,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.95rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} color={palette.brand} />
              <strong style={{ fontSize: '1.15rem', color: palette.text }}>
                {lang === 'es' ? 'Preguntar sobre este Contrato' : 'Ask About This Contract'}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                lang === 'es' ? '¿Qué falta para cerrar?' : 'What is missing to close?',
                lang === 'es' ? '¿Cuándo vence la próxima fecha?' : 'When is the next date?',
                lang === 'es' ? '¿Cuánto dinero hay en este trato?' : 'Price and deposit summary?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskCopilot(q)}
                  style={{
                    height: '44px',
                    padding: '0 0.95rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${palette.stoneBorder}`,
                    backgroundColor: palette.bgSubtle,
                    color: palette.text,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                maxHeight: '350px',
                overflowY: 'auto',
                padding: '0.9rem',
                borderRadius: '14px',
                backgroundColor: palette.bgApp,
                border: `1px solid ${palette.stoneBorder}`,
              }}
            >
              {activeDeal.copilotMessages.map((cp) => (
                <div
                  key={cp.id}
                  style={{
                    alignSelf: cp.role === 'user' ? 'flex-end' : 'stretch',
                    maxWidth: cp.role === 'user' ? '85%' : '100%',
                    padding: '0.95rem 1.05rem',
                    borderRadius: '14px',
                    backgroundColor: cp.role === 'user' ? palette.brand : palette.bgPanel,
                    color: cp.role === 'user' ? palette.brandTextOnPrimary : palette.text,
                    border: cp.role === 'assistant' ? `1px solid ${palette.stoneBorder}` : 'none',
                    fontSize: '0.98rem',
                    lineHeight: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <div>{cp.text}</div>

                  {cp.kpis && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.55rem',
                        marginTop: '0.75rem',
                      }}
                    >
                      {cp.kpis.map((k, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.65rem',
                            borderRadius: '10px',
                            backgroundColor: palette.bgSubtle,
                            border: `1px solid ${palette.stoneBorder}`,
                          }}
                        >
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: palette.text }}>
                            {k.value}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: palette.textSecondary, marginTop: '0.15rem' }}>
                            {k.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cp.whatsappAction && (
                    <button
                      type="button"
                      disabled={cp.whatsappAction.sent}
                      onClick={() => {
                        triggerCopilotWhatsappRequest(activeDeal.id, cp.id);
                        onToast(`Mensaje enviado a ${cp.whatsappAction?.targetClientName}`);
                      }}
                      style={{
                        marginTop: '0.8rem',
                        width: '100%',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        borderRadius: '10px',
                        border: cp.whatsappAction.sent ? `1px solid ${palette.stoneBorder}` : 'none',
                        backgroundColor: cp.whatsappAction.sent ? palette.bgSubtle : palette.brand,
                        color: cp.whatsappAction.sent ? palette.textSecondary : palette.brandTextOnPrimary,
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        cursor: cp.whatsappAction.sent ? 'default' : 'pointer',
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>
                        {cp.whatsappAction.sent
                          ? 'Solicitud enviada por WhatsApp'
                          : lang === 'es'
                          ? cp.whatsappAction.labelEs
                          : cp.whatsappAction.labelEn}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskCopilot(copilotInput);
              }}
              style={{ display: 'flex', gap: '0.55rem' }}
            >
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder={lang === 'es' ? 'Escribe tu pregunta aquí...' : 'Type your question...'}
                style={{
                  flex: 1,
                  height: '52px',
                  padding: '0 1rem',
                  borderRadius: '12px',
                  border: `1.5px solid ${palette.borderStrong}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '56px',
                  height: '52px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: palette.brand,
                  color: palette.brandTextOnPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Send size={18} />
              </button>
            </form>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <CalendarClock size={20} color={palette.brand} />
              <strong style={{ fontSize: '1.15rem', color: palette.text }}>
                {lang === 'es' ? 'Fechas Importantes' : 'Important Dates'}
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeDeal.deadlines.map((dl) => {
                const isUrgent = dl.status === 'urgent';
                return (
                  <div
                    key={dl.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: palette.bgSubtle,
                      border: isUrgent ? `1.5px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: palette.text }}>
                        {lang === 'es' ? dl.titleEs : dl.titleEn}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: palette.textSecondary }}>{dl.dateLabel}</div>
                    </div>
                    <span
                      style={{
                        padding: '0.32rem 0.7rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        backgroundColor: isUrgent ? palette.brand : palette.bgPanel,
                        color: isUrgent ? palette.brandTextOnPrimary : palette.text,
                        border: isUrgent ? 'none' : `1px solid ${palette.stoneBorder}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dl.badgeEs}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Contract Modal */}
      {newDealModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setNewDealModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateDeal}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.2rem', color: palette.text }}>Nuevo Contrato</strong>
              <button type="button" onClick={() => setNewDealModalOpen(false)} style={{ background: 'none', border: 'none', color: palette.text, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {properties.length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  const p = properties.find((item) => item.id === e.target.value);
                  if (p) {
                    setNewAddress(`${p.location.address}, ${p.location.city}`);
                    setNewPrice(String(p.price));
                  }
                }}
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.94rem',
                }}
              >
                <option value="">Elegir casa existente (opcional)...</option>
                {properties.slice(0, 15).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.location.address} - {formatUsd(p.price)}
                  </option>
                ))}
              </select>
            )}

            <input
              required
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Dirección de la casa"
              style={{
                height: '48px',
                padding: '0 0.9rem',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
              }}
            />
            <input
              required
              type="text"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              placeholder="Nombre del cliente"
              style={{
                height: '48px',
                padding: '0 0.9rem',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'Compra' | 'Venta' | 'Renta')}
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.96rem',
                }}
              >
                <option value="Compra">Compra</option>
                <option value="Venta">Venta</option>
                <option value="Renta">Renta</option>
              </select>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Precio"
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '1rem',
                }}
              />
            </div>
            <input
              type="text"
              value={newClosing}
              onChange={(e) => setNewClosing(e.target.value)}
              placeholder="Fecha de cierre"
              style={{
                height: '48px',
                padding: '0 0.9rem',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
              }}
            />
            <button
              type="submit"
              style={{
                height: '52px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: palette.brand,
                color: palette.brandTextOnPrimary,
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Crear Contrato
            </button>
          </form>
        </div>
      )}

      <style>{`
        .arm-deal-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 980px) {
          .arm-deal-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
