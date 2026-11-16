import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Calculator,
  DollarSign,
  FileSpreadsheet,
  Plus,
  Printer,
  Receipt,
  Search,
  Users,
  X,
} from 'lucide-react';
import { Agent, Property } from '../../types/property';
import {
  ArmCommissionRecord,
  ArmOfficeExpense,
  ArmState,
  CommissionPaymentStatus,
  PaymentMethodType,
} from '../../types/arm';
import { ArmPalette, formatUsd } from './armTheme';
import {
  createCommissionRecord,
  createOfficeLedgerEntry,
  toggleOfficeLedgerStatus,
  updateCommissionStatus,
} from '../../services/armStore';

export interface CommissionDraftInput {
  address: string;
  price: number;
  agentId: string;
  mlsId?: string;
  clientName?: string;
}

interface ArmBrokerFinanceViewProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  allAgents: Agent[];
  properties: Property[];
  armState: ArmState;
  draftProperty?: CommissionDraftInput | null;
  onClearDraft?: () => void;
  onToast: (msg: string) => void;
}

type FinanceSubTab = 'commissions' | 'ledger' | 'summary1099';

export const ArmBrokerFinanceView: React.FC<ArmBrokerFinanceViewProps> = ({
  lang,
  palette,
  allAgents,
  properties,
  armState,
  draftProperty,
  onClearDraft,
  onToast,
}) => {
  const [subTab, setSubTab] = useState<FinanceSubTab>('commissions');
  const [statusFilter, setStatusFilter] = useState<'all' | CommissionPaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [calcOpen, setCalcOpen] = useState(false);
  const [calcAgentId, setCalcAgentId] = useState(allAgents[2]?.id || 'yazbel-diaz');
  const [calcAddress, setCalcAddress] = useState('');
  const [calcClient, setCalcClient] = useState('');
  const [calcSalePrice, setCalcSalePrice] = useState('350000');
  const [calcCommPct, setCalcCommPct] = useState('3');
  const [calcSplitPct, setCalcSplitPct] = useState('80');
  const [calcAdminFee, setCalcAdminFee] = useState('0');
  const [calcTitleCo, setCalcTitleCo] = useState('Bluegrass Title Co.');
  const [calcStatus, setCalcStatus] = useState<CommissionPaymentStatus>('ready_to_pay');

  const [payTarget, setPayTarget] = useState<ArmCommissionRecord | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethodType>('Zelle');
  const [receiptTarget, setReceiptTarget] = useState<ArmCommissionRecord | null>(null);

  const [expenseConcept, setExpenseConcept] = useState('');
  const [expenseCategory, setExpenseCategory] =
    useState<ArmOfficeExpense['category']>('Renta & Oficina');
  const [expenseType, setExpenseType] = useState<'expense' | 'income'>('expense');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    if (draftProperty) {
      setCalcAgentId(draftProperty.agentId || 'yeilen-contreras');
      setCalcAddress(draftProperty.address);
      setCalcSalePrice(String(draftProperty.price || 350000));
      setCalcClient(draftProperty.clientName || 'Cliente Cierre');
      setCalcStatus('ready_to_pay');
      setSubTab('commissions');
      setCalcOpen(true);
      onClearDraft?.();
    }
  }, [draftProperty, onClearDraft]);

  const commissions = armState.commissions || [];
  const ledger = armState.officeLedger || [];

  const totals = useMemo(() => {
    const companyCollected = commissions
      .filter((c) => c.status !== 'escrow')
      .reduce((s, c) => s + (c.brokerageNetAmount || 0), 0);
    const readyToPayList = commissions.filter((c) => c.status === 'ready_to_pay');
    const readyToPaySum = readyToPayList.reduce((s, c) => s + (c.agentNetPayout || 0), 0);
    const escrowSum = commissions
      .filter((c) => c.status === 'escrow')
      .reduce((s, c) => s + (c.grossCommission || 0), 0);

    const deskIncome = ledger
      .filter((l) => l.entryType === 'income')
      .reduce((s, l) => s + (l.amount || 0), 0);
    const officeExpenses = ledger
      .filter((l) => l.entryType === 'expense')
      .reduce((s, l) => s + (l.amount || 0), 0);
    const netOfficeProfit = companyCollected + deskIncome - officeExpenses;

    return {
      companyCollected,
      readyToPayCount: readyToPayList.length,
      readyToPaySum,
      escrowSum,
      deskIncome,
      officeExpenses,
      netOfficeProfit,
    };
  }, [commissions, ledger]);

  const filteredCommissions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return commissions.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!q) return true;
      const agent = allAgents.find((a) => a.id === c.agentId);
      return (
        c.propertyAddress.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        (agent?.name || '').toLowerCase().includes(q)
      );
    });
  }, [commissions, statusFilter, searchQuery, allAgents]);

  const realtor1099Rows = useMemo(() => {
    const map: Record<
      string,
      {
        agent: Agent;
        dealsCount: number;
        volume: number;
        totalPaidOrReady: number;
        contributedToBrokerage: number;
      }
    > = {};

    for (const c of commissions) {
      const agent = allAgents.find((a) => a.id === c.agentId);
      if (!agent) continue;
      if (!map[agent.id]) {
        map[agent.id] = {
          agent,
          dealsCount: 0,
          volume: 0,
          totalPaidOrReady: 0,
          contributedToBrokerage: 0,
        };
      }
      map[agent.id].dealsCount += 1;
      map[agent.id].volume += c.salePrice;
      if (c.status !== 'escrow') {
        map[agent.id].totalPaidOrReady += c.agentNetPayout;
      }
      map[agent.id].contributedToBrokerage += c.brokerageNetAmount;
    }

    return Object.values(map).sort((a, b) => b.totalPaidOrReady - a.totalPaidOrReady);
  }, [commissions, allAgents]);

  const calcPreview = useMemo(() => {
    const price = Math.max(0, Number(calcSalePrice) || 0);
    const pct = Math.max(0, Number(calcCommPct) || 0);
    const split = Math.min(100, Math.max(0, Number(calcSplitPct) || 0));
    const adminFee = Math.max(0, Number(calcAdminFee) || 0);

    const gross = Math.round(price * (pct / 100));
    const agentRaw = Math.round(gross * (split / 100));
    const agentNet = Math.max(0, agentRaw - adminFee);
    const brokerageNet = Math.max(0, gross - agentNet);

    return { price, pct, split, adminFee, gross, agentNet, brokerageNet };
  }, [calcSalePrice, calcCommPct, calcSplitPct, calcAdminFee]);

  const handleSaveNewCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcAddress.trim()) return;

    createCommissionRecord({
      propertyAddress: calcAddress.trim(),
      clientName: calcClient.trim() || 'Cliente Cierre',
      agentId: calcAgentId,
      salePrice: calcPreview.price,
      commissionPct: calcPreview.pct,
      grossCommission: calcPreview.gross,
      agentSplitPct: calcPreview.split,
      transactionFee: calcPreview.adminFee,
      agentNetPayout: calcPreview.agentNet,
      brokerageNetAmount: calcPreview.brokerageNet,
      titleCompany: calcTitleCo.trim() || 'Bluegrass Title Co.',
      closingDate: new Date().toLocaleDateString('es-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: calcStatus,
      paymentMethod: calcStatus === 'paid' ? 'ACH / Transferencia' : undefined,
      paidAt: calcStatus === 'paid' ? 'Hoy' : undefined,
    });

    setCalcOpen(false);
    setCalcAddress('');
    setCalcClient('');
    onToast(
      lang === 'es'
        ? `Pago guardado para ${calcAddress}`
        : `Payment recorded for ${calcAddress}`
    );
  };

  const handleConfirmPayout = () => {
    if (!payTarget) return;
    updateCommissionStatus(payTarget.id, 'paid', payMethod);
    const targetAgent = allAgents.find((a) => a.id === payTarget.agentId);
    onToast(
      lang === 'es'
        ? `Pago marcado como enviado a ${targetAgent?.name || 'Agente'}`
        : `Payment recorded for ${targetAgent?.name || 'Agent'}`
    );
    setPayTarget(null);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(expenseAmount);
    if (!expenseConcept.trim() || !numAmt || numAmt <= 0) return;

    createOfficeLedgerEntry({
      dateLabel: new Date().toLocaleDateString('es-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      concept: expenseConcept.trim(),
      category: expenseCategory,
      entryType: expenseType,
      amount: numAmt,
      status: 'paid',
    });

    setExpenseConcept('');
    setExpenseAmount('');
    onToast(lang === 'es' ? 'Movimiento guardado en caja' : 'Entry saved');
  };

  const handleExportExcelCsv = () => {
    const headers = [
      'Tipo',
      'Propiedad o Concepto',
      'Agente',
      'Cliente / Oficina',
      'Precio Venta',
      'Comision %',
      'Comision Total',
      'Porcentaje Agente',
      'Cargo Admin',
      'Pago al Agente',
      'Ganancia New Era',
      'Estado',
      'Fecha',
    ];

    const rows: string[][] = commissions.map((c) => {
      const ag = allAgents.find((a) => a.id === c.agentId)?.name || c.agentId;
      return [
        'Comision Cierre',
        c.propertyAddress,
        ag,
        `${c.clientName} (${c.titleCompany})`,
        String(c.salePrice),
        `${c.commissionPct}%`,
        String(c.grossCommission),
        `${c.agentSplitPct}%`,
        String(c.transactionFee),
        String(c.agentNetPayout),
        String(c.brokerageNetAmount),
        c.status === 'paid' ? 'PAGADO' : c.status === 'ready_to_pay' ? 'POR PAGAR' : 'PENDIENTE CIERRE',
        c.paidAt || c.closingDate,
      ];
    });

    for (const l of ledger) {
      rows.push([
        l.entryType === 'income' ? 'Ingreso Oficina' : 'Gasto Oficina',
        l.concept,
        l.category,
        'New Era Real Estate LLC',
        '',
        '',
        '',
        '',
        '',
        l.entryType === 'expense' ? `-${l.amount}` : '0',
        l.entryType === 'income' ? String(l.amount) : `-${l.amount}`,
        l.status === 'paid' ? 'PAGADO' : 'PENDIENTE',
        l.dateLabel,
      ]);
    }

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NewEra_Pagos_y_Caja_2026.csv';
    link.click();
    URL.revokeObjectURL(url);

    onToast(lang === 'es' ? 'Archivo Excel descargado' : 'Excel file downloaded');
  };

  const newEraMlsOptions = useMemo(
    () => properties.filter((p) => p.agentId || p.isNewEra || p.mls?.isNewEra).slice(0, 20),
    [properties]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
      {/* Action Buttons Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {(
            [
              { id: 'commissions', label: lang === 'es' ? 'Pagos a Agentes' : 'Agent Payouts', icon: Calculator },
              { id: 'ledger', label: lang === 'es' ? 'Gastos de Oficina' : 'Office Expenses', icon: Building2 },
              { id: 'summary1099', label: lang === 'es' ? 'Total del Año (1099)' : 'Annual 1099 Totals', icon: Users },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  height: '52px',
                  padding: '0 1.2rem',
                  borderRadius: '12px',
                  border: active ? `2px solid ${palette.brand}` : `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: active ? palette.brand : palette.bgPanel,
                  color: active ? palette.brandTextOnPrimary : palette.text,
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportExcelCsv}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              height: '52px',
              padding: '0 1.15rem',
              borderRadius: '12px',
              border: `1.5px solid ${palette.stoneBorder}`,
              backgroundColor: palette.bgPanel,
              color: palette.text,
              fontSize: '0.96rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={17} />
            <span>{lang === 'es' ? 'Descargar Excel' : 'Download Excel'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCalcOpen(true)}
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
            <Plus size={18} />
            <span>{lang === 'es' ? 'Nuevo Pago' : 'New Payment'}</span>
          </button>
        </div>
      </div>

      {/* 3 Big Summary Cards (ONLY Positive Money in Green) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.35rem 1.45rem',
            boxShadow: palette.shadow,
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: palette.textSecondary }}>
            {lang === 'es' ? 'Ganancia neta New Era' : 'New Era Net Profit'}
          </div>
          <div
            style={{
              fontSize: '2.25rem',
              fontWeight: 900,
              color: totals.netOfficeProfit >= 0 ? palette.positiveMoney : palette.negativeMoney,
              marginTop: '0.3rem',
              lineHeight: 1,
            }}
          >
            {totals.netOfficeProfit >= 0 ? '+' : ''}
            {formatUsd(totals.netOfficeProfit)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.35rem 1.45rem',
            boxShadow: palette.shadow,
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: palette.textSecondary }}>
            {lang === 'es' ? 'Por pagar hoy a agentes' : 'To pay agents today'}
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: palette.text, marginTop: '0.3rem', lineHeight: 1 }}>
            {formatUsd(totals.readyToPaySum)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.35rem 1.45rem',
            boxShadow: palette.shadow,
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: palette.textSecondary }}>
            {lang === 'es' ? 'Por cobrar en cierres' : 'Upcoming closings'}
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: palette.text, marginTop: '0.3rem', lineHeight: 1 }}>
            {formatUsd(totals.escrowSum)}
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Agent Payments */}
      {subTab === 'commissions' && (
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '20px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.35rem',
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
              <Search size={18} color={palette.textMuted} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'es' ? 'Buscar casa o agente...' : 'Search address or agent...'}
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '0.6rem 1rem 0.6rem 2.7rem',
                  borderRadius: '12px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'ready_to_pay', label: `Por Pagar (${totals.readyToPayCount})` },
                  { id: 'escrow', label: 'En Camino' },
                  { id: 'paid', label: 'Pagados' },
                ] as const
              ).map((f) => {
                const active = statusFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    style={{
                      height: '46px',
                      padding: '0 1rem',
                      borderRadius: '10px',
                      border: active ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                      backgroundColor: active ? palette.brand : palette.bgSubtle,
                      color: active ? palette.brandTextOnPrimary : palette.text,
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredCommissions.map((com) => {
              const agent = allAgents.find((a) => a.id === com.agentId);

              return (
                <div
                  key={com.id}
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderRadius: '16px',
                    backgroundColor: palette.bgSubtle,
                    border: `1.5px solid ${palette.stoneBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', minWidth: '240px', flex: '1 1 280px' }}>
                    {agent && (
                      <img
                        src={agent.photoUrl}
                        alt={agent.name}
                        style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: palette.text }}>
                        {com.propertyAddress}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: palette.textSecondary, marginTop: '0.15rem' }}>
                        {agent?.name || com.agentId} - Cierre {com.closingDate}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: palette.textSecondary }}>
                        Para el agente
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: palette.text }}>
                        {formatUsd(com.agentNetPayout)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: palette.textSecondary }}>
                        Para New Era
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: palette.positiveMoney }}>
                        +{formatUsd(com.brokerageNetAmount)}
                      </div>
                    </div>

                    {com.status === 'escrow' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateCommissionStatus(com.id, 'ready_to_pay');
                          onToast(`Dinero recibido para ${com.propertyAddress}`);
                        }}
                        style={{
                          height: '48px',
                          padding: '0 1.1rem',
                          borderRadius: '11px',
                          border: `1.5px solid ${palette.borderStrong}`,
                          backgroundColor: palette.bgPanel,
                          color: palette.text,
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Ya llegó el dinero
                      </button>
                    )}

                    {com.status === 'ready_to_pay' && (
                      <button
                        type="button"
                        onClick={() => {
                          setPayMethod('Zelle');
                          setPayTarget(com);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          height: '48px',
                          padding: '0 1.2rem',
                          borderRadius: '11px',
                          border: 'none',
                          backgroundColor: palette.brand,
                          color: palette.brandTextOnPrimary,
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        <DollarSign size={16} />
                        <span>Pagar al Agente</span>
                      </button>
                    )}

                    {com.status === 'paid' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <span
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '9px',
                            backgroundColor: palette.bgPanel,
                            color: palette.text,
                            border: `1px solid ${palette.stoneBorder}`,
                            fontSize: '0.88rem',
                            fontWeight: 700,
                          }}
                        >
                          Pagado ({com.paymentMethod || 'ACH'})
                        </span>
                        <button
                          type="button"
                          onClick={() => setReceiptTarget(com)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            height: '46px',
                            padding: '0 0.95rem',
                            borderRadius: '10px',
                            border: `1.5px solid ${palette.stoneBorder}`,
                            backgroundColor: palette.bgPanel,
                            color: palette.text,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <Receipt size={15} />
                          <span>Ver Recibo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Office Expenses & Cashflow */}
      {subTab === 'ledger' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem', alignItems: 'start' }}>
          <form
            onSubmit={handleAddExpense}
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.35rem',
              boxShadow: palette.shadow,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <strong style={{ fontSize: '1.15rem', color: palette.text }}>
              {lang === 'es' ? 'Anotar Gasto o Cuota' : 'Add Expense or Fee'}
            </strong>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setExpenseType('expense')}
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  border: expenseType === 'expense' ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                  backgroundColor: expenseType === 'expense' ? palette.brand : palette.bgSubtle,
                  color: expenseType === 'expense' ? palette.brandTextOnPrimary : palette.text,
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Gasto (Salida)
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpenseType('income');
                  setExpenseCategory('Cuota Agente (Ingreso)');
                }}
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  border: expenseType === 'income' ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                  backgroundColor: expenseType === 'income' ? palette.brand : palette.bgSubtle,
                  color: expenseType === 'income' ? palette.brandTextOnPrimary : palette.text,
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Ingreso (Entrada)
              </button>
            </div>

            <input
              required
              type="text"
              value={expenseConcept}
              onChange={(e) => setExpenseConcept(e.target.value)}
              placeholder="Concepto (ej. Letreros, Renta, Internet)"
              style={{
                height: '50px',
                padding: '0 0.9rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
              }}
            />

            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value as ArmOfficeExpense['category'])}
              style={{
                height: '50px',
                padding: '0 0.9rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '0.98rem',
              }}
            >
              <option value="Renta & Oficina">Renta y Oficina</option>
              <option value="MLS & Sistemas">MLS y Sistemas</option>
              <option value="Marketing & Letreros">Marketing y Letreros</option>
              <option value="Cuota Agente (Ingreso)">Cuota de Agente</option>
            </select>

            <input
              required
              type="number"
              min="1"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Cantidad en dólares (ej. 350)"
              style={{
                height: '50px',
                padding: '0 0.9rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
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
              Guardar en Caja
            </button>
          </form>

          <div
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.35rem',
              boxShadow: palette.shadow,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <strong style={{ fontSize: '1.15rem', color: palette.text }}>Lista de Gastos e Ingresos</strong>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {ledger.map((item) => {
                const isIncome = item.entryType === 'income';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.9rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: palette.bgSubtle,
                      border: `1px solid ${palette.stoneBorder}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: palette.text }}>{item.concept}</div>
                      <div style={{ fontSize: '0.85rem', color: palette.textSecondary }}>{item.dateLabel}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <strong
                        style={{
                          fontSize: '1.15rem',
                          color: isIncome ? palette.positiveMoney : palette.negativeMoney,
                        }}
                      >
                        {isIncome ? '+' : '-'}
                        {formatUsd(item.amount)}
                      </strong>
                      <button
                        type="button"
                        onClick={() => toggleOfficeLedgerStatus(item.id)}
                        style={{
                          height: '38px',
                          padding: '0 0.85rem',
                          borderRadius: '9px',
                          border: `1px solid ${palette.stoneBorder}`,
                          backgroundColor: palette.bgPanel,
                          color: palette.text,
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {item.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Annual Summary per Realtor */}
      {subTab === 'summary1099' && (
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
          <strong style={{ fontSize: '1.2rem', color: palette.text }}>
            Total del Año por Agente (Para Contador / 1099)
          </strong>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {realtor1099Rows.map((row) => (
              <div
                key={row.agent.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  backgroundColor: palette.bgSubtle,
                  border: `1px solid ${palette.stoneBorder}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={row.agent.photoUrl}
                    alt={row.agent.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '1.08rem', fontWeight: 800, color: palette.text }}>{row.agent.name}</div>
                    <div style={{ fontSize: '0.88rem', color: palette.textSecondary }}>
                      {row.dealsCount} cierre(s)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: palette.textSecondary, fontWeight: 700 }}>
                      Pagado al agente
                    </div>
                    <strong style={{ fontSize: '1.2rem', color: palette.text }}>
                      {formatUsd(row.totalPaidOrReady)}
                    </strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: palette.textSecondary, fontWeight: 700 }}>
                      Ganancia New Era
                    </div>
                    <strong style={{ fontSize: '1.2rem', color: palette.positiveMoney }}>
                      +{formatUsd(row.contributedToBrokerage)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: New Commission Split Calculator */}
      {calcOpen && (
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
          onClick={() => setCalcOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveNewCommission}
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.25rem', color: palette.text }}>Nuevo Pago de Comisión</strong>
              <button
                type="button"
                onClick={() => setCalcOpen(false)}
                style={{ background: 'none', border: 'none', color: palette.text, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {newEraMlsOptions.length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  const p = newEraMlsOptions.find((item) => item.id === e.target.value);
                  if (p) {
                    setCalcAddress(p.location.address);
                    setCalcSalePrice(String(p.price));
                    if (p.agentId) setCalcAgentId(p.agentId);
                  }
                }}
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.95rem',
                }}
              >
                <option value="">Elegir casa existente (opcional)...</option>
                {newEraMlsOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.location.address} - {formatUsd(p.price)}
                  </option>
                ))}
              </select>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <select
                value={calcAgentId}
                onChange={(e) => setCalcAgentId(e.target.value)}
                style={{
                  height: '48px',
                  padding: '0 0.8rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.95rem',
                }}
              >
                {allAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <select
                value={calcStatus}
                onChange={(e) => setCalcStatus(e.target.value as CommissionPaymentStatus)}
                style={{
                  height: '48px',
                  padding: '0 0.8rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.95rem',
                }}
              >
                <option value="ready_to_pay">Listo para Pagar</option>
                <option value="escrow">Por Cobrar</option>
                <option value="paid">Ya Pagado</option>
              </select>
            </div>

            <input
              required
              type="text"
              value={calcAddress}
              onChange={(e) => setCalcAddress(e.target.value)}
              placeholder="Dirección de la propiedad"
              style={{
                height: '48px',
                padding: '0 0.9rem',
                borderRadius: '10px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <input
                type="text"
                value={calcClient}
                onChange={(e) => setCalcClient(e.target.value)}
                placeholder="Nombre del cliente"
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.96rem',
                }}
              />
              <input
                type="text"
                value={calcTitleCo}
                onChange={(e) => setCalcTitleCo(e.target.value)}
                placeholder="Oficina de Título"
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.96rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.2rem' }}>
                  Precio Casa ($)
                </label>
                <input
                  type="number"
                  value={calcSalePrice}
                  onChange={(e) => setCalcSalePrice(e.target.value)}
                  style={{ width: '100%', height: '46px', padding: '0 0.7rem', borderRadius: '9px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.96rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.2rem' }}>
                  Comisión (%)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={calcCommPct}
                  onChange={(e) => setCalcCommPct(e.target.value)}
                  style={{ width: '100%', height: '46px', padding: '0 0.7rem', borderRadius: '9px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.96rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.2rem' }}>
                  Cargo Admin ($)
                </label>
                <input
                  type="number"
                  value={calcAdminFee}
                  onChange={(e) => setCalcAdminFee(e.target.value)}
                  style={{ width: '100%', height: '46px', padding: '0 0.7rem', borderRadius: '9px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '0.96rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: palette.textSecondary, marginBottom: '0.35rem' }}>
                División: {calcSplitPct}% Agente / {100 - Number(calcSplitPct)}% New Era
              </label>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { label: '70 / 30', val: '70' },
                  { label: '80 / 20', val: '80' },
                  { label: '85 / 15', val: '85' },
                  { label: '90 / 10', val: '90' },
                  { label: '100% + Cargo', val: '100' },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => {
                      setCalcSplitPct(s.val);
                      if (s.val === '100' && calcAdminFee === '0') setCalcAdminFee('595');
                    }}
                    style={{
                      height: '42px',
                      padding: '0 0.85rem',
                      borderRadius: '9px',
                      border: calcSplitPct === s.val ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                      backgroundColor: calcSplitPct === s.val ? palette.brand : palette.bgSubtle,
                      color: calcSplitPct === s.val ? palette.brandTextOnPrimary : palette.text,
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '14px',
                backgroundColor: palette.bgSubtle,
                border: `1.5px solid ${palette.stoneBorder}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: palette.textSecondary, fontWeight: 700 }}>Total</div>
                <strong style={{ fontSize: '1.1rem', color: palette.text }}>{formatUsd(calcPreview.gross)}</strong>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: palette.textSecondary, fontWeight: 700 }}>Para Agente</div>
                <strong style={{ fontSize: '1.1rem', color: palette.text }}>{formatUsd(calcPreview.agentNet)}</strong>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: palette.textSecondary, fontWeight: 700 }}>Para New Era</div>
                <strong style={{ fontSize: '1.1rem', color: palette.positiveMoney }}>+{formatUsd(calcPreview.brokerageNet)}</strong>
              </div>
            </div>

            <button
              type="submit"
              style={{
                height: '52px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: palette.brand,
                color: palette.brandTextOnPrimary,
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Guardar Pago
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: Confirm Payout */}
      {payTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 3100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setPayTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.6rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <strong style={{ fontSize: '1.25rem', color: palette.text }}>Confirmar Pago</strong>
            <div style={{ fontSize: '1rem', color: palette.textSecondary, lineHeight: 1.5 }}>
              Casa: <strong style={{ color: palette.text }}>{payTarget.propertyAddress}</strong>
              <br />
              Monto para el agente:{' '}
              <strong style={{ color: palette.text, fontSize: '1.25rem' }}>
                {formatUsd(payTarget.agentNetPayout)}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['Zelle', 'ACH / Transferencia', 'Cheque'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayMethod(m)}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: '10px',
                    border: payMethod === m ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                    backgroundColor: payMethod === m ? palette.brand : palette.bgSubtle,
                    color: payMethod === m ? palette.brandTextOnPrimary : palette.text,
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setPayTarget(null)}
                style={{
                  height: '48px',
                  padding: '0 1.1rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgPanel,
                  color: palette.text,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPayout}
                style={{
                  height: '48px',
                  padding: '0 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: palette.brand,
                  color: palette.brandTextOnPrimary,
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Receipt */}
      {receiptTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 3100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setReceiptTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              color: '#121418',
              borderRadius: '18px',
              border: '2px solid #660E1A',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #660E1A', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#660E1A', letterSpacing: '0.08em' }}>
                  NEW ERA REAL ESTATE LLC
                </div>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.35rem', fontWeight: 800 }}>
                  Recibo de Pago de Comisión
                </h3>
              </div>
              <button type="button" onClick={() => setReceiptTarget(null)} style={{ background: 'none', border: 'none', color: '#121418', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.98rem', lineHeight: 1.65 }}>
              <div><strong>Propiedad:</strong> {receiptTarget.propertyAddress}</div>
              <div>
                <strong>Agente:</strong>{' '}
                {allAgents.find((a) => a.id === receiptTarget.agentId)?.name || receiptTarget.agentId}
              </div>
              <div><strong>Método y Fecha:</strong> {receiptTarget.paymentMethod || 'ACH'} - {receiptTarget.paidAt || receiptTarget.closingDate}</div>
            </div>

            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '1rem', border: '1px solid #E5DDD0', fontSize: '0.96rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Precio de Venta:</span>
                <strong>{formatUsd(receiptTarget.salePrice)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Comisión Total:</span>
                <strong>{formatUsd(receiptTarget.grossCommission)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Para New Era:</span>
                <strong style={{ color: '#15803D' }}>+{formatUsd(receiptTarget.brokerageNetAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #C9BFA9', paddingTop: '0.5rem', marginTop: '0.25rem', fontSize: '1.15rem' }}>
                <strong>Total Pagado al Agente:</strong>
                <strong>{formatUsd(receiptTarget.agentNetPayout)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#4B505B' }}>
                Aprobado por Yeilen Contreras
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  height: '46px',
                  padding: '0 1.1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#660E1A',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Printer size={15} />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
