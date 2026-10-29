import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Send,
  Inbox,
  KeyRound,
  RefreshCw,
  LogOut,
  Plus,
  Reply,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Search,
  ChevronLeft,
  Users,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';
import { AGENTS_DATA } from '../data/agentsData';
import { Agent } from '../types/property';

interface InboxPageProps {
  lang: 'en' | 'es';
}

interface EmailSummary {
  id: string;
  direction: 'inbound' | 'outbound';
  folder: 'received' | 'leads' | 'sent';
  from: string;
  to: string[];
  subject: string;
  createdAt: string;
  lastEvent?: string;
}

const STORAGE_KEY = 'newera_inbox_session_v1';

export const InboxPage: React.FC<InboxPageProps> = ({ lang }) => {
  // Auth state
  const [token, setToken] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loggedAgent, setLoggedAgent] = useState<any | null>(null);

  // Login screen state
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS_DATA[0]?.id || 'yeilen-contreras');
  const [agentSearch, setAgentSearch] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');

  // Forgot / Reset PIN flow state
  const [resetMode, setResetMode] = useState<'none' | 'request' | 'verify'>('none');
  const [resetToken, setResetToken] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [resetNewPin, setResetNewPin] = useState<string>('');
  const [maskedEmailHint, setMaskedEmailHint] = useState<string>('');

  // Mailbox state
  const [activeFolder, setActiveFolder] = useState<'received' | 'leads' | 'sent'>('received');
  const [targetAgentId, setTargetAgentId] = useState<string>('');
  const [viewAllMailboxes, setViewAllMailboxes] = useState<boolean>(false);
  const [receivedList, setReceivedList] = useState<EmailSummary[]>([]);
  const [leadsList, setLeadsList] = useState<EmailSummary[]>([]);
  const [sentList, setSentList] = useState<EmailSummary[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);

  // Selected email detail state
  const [selectedEmail, setSelectedEmail] = useState<EmailSummary | null>(null);
  const [emailDetail, setEmailDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Compose modal state
  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeCc, setComposeCc] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeMessage, setComposeMessage] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Change PIN modal state (inside mailbox)
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [newPinValue, setNewPinValue] = useState<string>('');
  const [pinStatusMsg, setPinStatusMsg] = useState<string>('');

  // Copy email helper
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Restore saved session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && parsed?.agent) {
          setToken(parsed.token);
          setIsAdmin(Boolean(parsed.isAdmin));
          setLoggedAgent(parsed.agent);
          setTargetAgentId(parsed.agent.id);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchMailbox = useCallback(
    async (sessionToken: string, agentIdOverride?: string, allOverride?: boolean) => {
      if (!sessionToken) return;
      setLoadingList(true);
      try {
        const resp = await fetch('/api/inbox', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`
          },
          body: JSON.stringify({
            action: 'list',
            targetAgentId: agentIdOverride || targetAgentId,
            viewAll: allOverride !== undefined ? allOverride : viewAllMailboxes
          })
        });
        const data = await resp.json();
        if (resp.status === 401) {
          handleLogout();
          return;
        }
        if (data.success) {
          setReceivedList(data.received || []);
          setLeadsList(data.leads || []);
          setSentList(data.sent || []);
          if (data.activeAgent) {
            setLoggedAgent(data.activeAgent);
          }
        }
      } catch (err) {
        console.warn('Error fetching mailbox:', err);
      } finally {
        setLoadingList(false);
      }
    },
    [targetAgentId, viewAllMailboxes]
  );

  useEffect(() => {
    if (token) {
      fetchMailbox(token, targetAgentId, viewAllMailboxes);
    }
  }, [token, targetAgentId, viewAllMailboxes, fetchMailbox]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          emailOrId: selectedAgentId,
          pin: pinInput
        })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setAuthError(data.error || 'No se pudo iniciar sesión.');
      } else {
        setToken(data.token);
        setIsAdmin(Boolean(data.isAdmin));
        setLoggedAgent(data.agent);
        setTargetAgentId(data.agent.id);
        setPinInput('');
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            token: data.token,
            isAdmin: Boolean(data.isAdmin),
            agent: data.agent
          })
        );
      }
    } catch {
      setAuthError('Error de conexión con el servidor.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRequestPinReset = async () => {
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_pin_reset',
          emailOrId: selectedAgentId
        })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setAuthError(data.error || 'No se pudo enviar el código.');
      } else {
        setResetToken(data.resetToken);
        setMaskedEmailHint(data.maskedPersonalEmail || 'tu correo personal');
        setResetMode('verify');
        setAuthSuccess(`Enviamos un código de 6 dígitos a ${data.maskedPersonalEmail}.`);
      }
    } catch {
      setAuthError('Error al solicitar el código de recuperación.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmPinReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm_pin_reset',
          resetToken,
          code: resetCode,
          newPin: resetNewPin
        })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setAuthError(data.error || 'Código inválido.');
      } else {
        setToken(data.token);
        setIsAdmin(Boolean(data.isAdmin));
        setLoggedAgent(data.agent);
        setTargetAgentId(data.agent.id);
        setResetMode('none');
        setResetCode('');
        setResetNewPin('');
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            token: data.token,
            isAdmin: Boolean(data.isAdmin),
            agent: data.agent
          })
        );
      }
    } catch {
      setAuthError('Error verificando el código.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setIsAdmin(false);
    setLoggedAgent(null);
    setSelectedEmail(null);
    setEmailDetail(null);
  };

  const handleSelectEmailItem = async (item: EmailSummary) => {
    setSelectedEmail(item);
    setEmailDetail(null);
    setLoadingDetail(true);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'read',
          emailId: item.id,
          direction: item.direction
        })
      });
      const data = await resp.json();
      if (data.success) {
        setEmailDetail(data.email);
      }
    } catch (err) {
      console.warn('Error reading email detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenReply = () => {
    if (!selectedEmail) return;
    const rawFrom = emailDetail?.reply_to || emailDetail?.from || selectedEmail.from || '';
    const match = String(rawFrom).match(/<([^>]+)>/);
    const cleanReplyTo = match ? match[1] : String(rawFrom).trim();
    const subj = selectedEmail.subject || '';
    setComposeTo(cleanReplyTo);
    setComposeCc('');
    setComposeSubject(subj.toLowerCase().startsWith('re:') ? subj : `Re: ${subj}`);
    setComposeMessage('\n\n');
    setSendStatus(null);
    setComposeOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    setSendStatus(null);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'send',
          targetAgentId,
          to: composeTo,
          cc: composeCc,
          subject: composeSubject,
          message: composeMessage
        })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setSendStatus({ type: 'err', text: data.error || 'No se pudo enviar el correo.' });
      } else {
        setSendStatus({ type: 'ok', text: '¡Correo enviado exitosamente desde ' + loggedAgent?.corporateEmail + '!' });
        setTimeout(() => {
          setComposeOpen(false);
          setComposeTo('');
          setComposeCc('');
          setComposeSubject('');
          setComposeMessage('');
          setSendStatus(null);
          fetchMailbox(token, targetAgentId, viewAllMailboxes);
        }, 1200);
      }
    } catch {
      setSendStatus({ type: 'err', text: 'Error de red al enviar el correo.' });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSaveNewPinInside = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinStatusMsg('');
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'change_pin',
          targetAgentId,
          newPin: newPinValue
        })
      });
      const data = await resp.json();
      if (data.success) {
        setPinStatusMsg('✅ ' + data.message);
        setNewPinValue('');
        setTimeout(() => {
          setPinModalOpen(false);
          setPinStatusMsg('');
        }, 1400);
      } else {
        setPinStatusMsg('❌ ' + (data.error || 'Error al guardar el PIN.'));
      }
    } catch {
      setPinStatusMsg('❌ Error de conexión.');
    }
  };

  const currentAgentObj: Agent =
    AGENTS_DATA.find((a) => a.id === selectedAgentId) || AGENTS_DATA[0];

  const filteredAgents = AGENTS_DATA.filter((a) => {
    const q = agentSearch.toLowerCase().trim();
    if (!q) return true;
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });

  const activeList =
    activeFolder === 'received'
      ? receivedList
      : activeFolder === 'leads'
      ? leadsList
      : sentList;

  // ==================== LOGIN SCREEN ====================
  if (!token || !loggedAgent) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase bg-[#660E1A]/10 text-[#660E1A] border border-[#660E1A]/20 mb-3">
              <ShieldCheck size={14} />
              {lang === 'es' ? 'PORTAL DE CORREO CORPORATIVO' : 'CORPORATE EMAIL PORTAL'}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#121418]">
              New Era Mail <span className="text-[#660E1A]">@neweraky.com</span>
            </h1>
            <p className="text-sm text-[#5A606D] mt-2 max-w-xl mx-auto">
              {lang === 'es'
                ? 'Selecciona tu perfil de agente e ingresa tu PIN para acceder a tu bandeja de entrada, responder como @neweraky.com y gestionar tus leads.'
                : 'Select your agent profile and enter your PIN to access your inbox, reply as @neweraky.com, and manage your leads.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Agent Selector Grid */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#660E1A]">
                  1. Selecciona tu Buzón (@neweraky.com)
                </h2>
                <span className="text-xs text-[#6E7480] font-medium">{AGENTS_DATA.length} Cuentas Activas</span>
              </div>

              {/* Search bar */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847C74]" />
                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Buscar agente por nombre o correo..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-sm text-[#121418] focus:outline-none focus:border-[#660E1A]"
                />
              </div>

              {/* Scrollable Agent List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredAgents.map((agent) => {
                  const isSelected = agent.id === selectedAgentId;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        setResetMode('none');
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#660E1A] text-white border-[#660E1A] shadow-md'
                          : 'bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#121418] border-[#E8E2D9]'
                      }`}
                    >
                      <img
                        src={agent.photoUrl}
                        alt={agent.name}
                        className="w-11 h-11 rounded-lg object-cover object-top bg-[#EDEAE4] shrink-0 border border-white/20"
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-[#121418]'}`}>
                          {agent.name}
                        </div>
                        <div className={`text-xs truncate font-mono ${isSelected ? 'text-[#F6D8A8]' : 'text-[#660E1A]'}`}>
                          {agent.email}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: PIN Login or Reset Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E2D9] shadow-md p-6">
              <div className="flex items-center gap-4 pb-5 mb-5 border-b border-[#EFEAE2]">
                <img
                  src={currentAgentObj.photoUrl}
                  alt={currentAgentObj.name}
                  className="w-16 h-16 rounded-xl object-cover object-top border border-[#E4DDD3]"
                />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#660E1A]">
                    {currentAgentObj.title}
                  </span>
                  <h3 className="text-lg font-bold text-[#121418]">{currentAgentObj.name}</h3>
                  <div className="text-xs font-mono font-semibold text-[#5A606D]">{currentAgentObj.email}</div>
                </div>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  {authSuccess}
                </div>
              )}

              {resetMode === 'none' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121418] mb-1.5">
                      2. PIN de Acceso
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#847C74]" />
                      <input
                        type="password"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="Ingresa tu PIN (ej. últimos 4 dígitos de tu tel)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8D0C5] bg-[#FAF8F5] text-sm font-semibold text-[#121418] focus:outline-none focus:border-[#660E1A]"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-[#6E7480] mt-1.5 leading-relaxed">
                      💡 <strong>¿Primera vez entrando?</strong> Tu PIN inicial son los{' '}
                      <strong>últimos 4 dígitos de tu teléfono</strong> ({currentAgentObj.phone}).
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#660E1A] hover:bg-[#4D0913] text-white font-bold text-xs uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {authLoading ? 'Verificando...' : 'Entrar a mi Bandeja'}
                    <ArrowRight size={15} />
                  </button>

                  <div className="pt-3 border-t border-[#EFEAE2] text-center">
                    <button
                      type="button"
                      onClick={handleRequestPinReset}
                      disabled={authLoading}
                      className="text-xs font-semibold text-[#660E1A] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound size={13} />
                      ¿Olvidaste o quieres cambiar tu PIN? Recibir código en mi Gmail
                    </button>
                  </div>
                </form>
              )}

              {resetMode === 'verify' && (
                <form onSubmit={handleConfirmPinReset} className="space-y-4">
                  <p className="text-xs text-[#5A606D] leading-relaxed">
                    Ingresa el código de 6 dígitos que acabamos de enviar a <strong>{maskedEmailHint}</strong> y elige tu nuevo PIN:
                  </p>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121418] mb-1">
                      Código de 6 dígitos
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D0C5] bg-[#FAF8F5] text-center font-mono text-lg font-bold tracking-[0.3em] text-[#660E1A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121418] mb-1">
                      Tu Nuevo PIN / Contraseña (mín. 4 dígitos)
                    </label>
                    <input
                      type="password"
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value)}
                      placeholder="Nuevo PIN"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D0C5] bg-[#FAF8F5] text-sm font-semibold"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setResetMode('none')}
                      className="flex-1 py-2.5 rounded-xl border border-[#D8D0C5] text-xs font-bold uppercase text-[#5A606D]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="flex-1 py-2.5 rounded-xl bg-[#660E1A] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      {authLoading ? 'Guardando...' : 'Guardar y Entrar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATED WEBMAIL DASHBOARD ====================
  return (
    <div className="min-h-screen bg-[#F5F2EB] pt-24 pb-12 px-3 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={loggedAgent.photoUrl}
              alt={loggedAgent.name}
              className="w-12 h-12 rounded-xl object-cover object-top border border-[#E5DFD5]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base md:text-lg font-bold text-[#121418]">{loggedAgent.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#660E1A]/10 text-[#660E1A]">
                  {loggedAgent.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs md:text-sm font-mono font-bold text-[#660E1A]">
                  {loggedAgent.corporateEmail}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(loggedAgent.corporateEmail);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 1800);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#EFEAE2] border border-[#E5DFD5] text-[11px] font-semibold text-[#5A606D] cursor-pointer"
                >
                  {copiedEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  {copiedEmail ? 'Copiado' : 'Copiar correo'}
                </button>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                  ✓ Copia activa a {loggedAgent.maskedPersonalEmail || loggedAgent.personalEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls & Admin Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isAdmin && (
              <div className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E5DFD5]">
                <Users size={14} className="text-[#660E1A]" />
                <select
                  value={viewAllMailboxes ? '__ALL__' : targetAgentId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedEmail(null);
                    setEmailDetail(null);
                    if (val === '__ALL__') {
                      setViewAllMailboxes(true);
                    } else {
                      setViewAllMailboxes(false);
                      setTargetAgentId(val);
                    }
                  }}
                  className="bg-transparent text-xs font-bold text-[#121418] focus:outline-none cursor-pointer"
                >
                  <option value="__ALL__">👑 Vista Admin: Todos los Buzones (26)</option>
                  {AGENTS_DATA.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setComposeTo('');
                setComposeCc('');
                setComposeSubject('');
                setComposeMessage('');
                setSendStatus(null);
                setComposeOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#660E1A] hover:bg-[#4D0913] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              Redactar Correo
            </button>

            <button
              type="button"
              onClick={() => fetchMailbox(token, targetAgentId, viewAllMailboxes)}
              className="p-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-[#EFEAE2] text-[#121418] cursor-pointer"
              title="Actualizar bandeja"
            >
              <RefreshCw size={15} className={loadingList ? 'animate-spin text-[#660E1A]' : ''} />
            </button>

            <button
              type="button"
              onClick={() => setPinModalOpen(true)}
              className="px-3 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-[#EFEAE2] text-xs font-semibold text-[#121418] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound size={14} className="text-[#660E1A]" />
              Cambiar PIN
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl border border-[#E5DFD5] bg-white hover:bg-red-50 text-xs font-semibold text-red-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </div>

        {/* Main 3-Column / Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Folders Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5DFD5] p-3.5 space-y-1.5 h-fit">
            <button
              type="button"
              onClick={() => {
                setActiveFolder('received');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFolder === 'received'
                  ? 'bg-[#660E1A] text-white'
                  : 'text-[#121418] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="inline-flex items-center gap-2.5">
                <Inbox size={16} />
                Recibidos (@neweraky.com)
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  activeFolder === 'received' ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#660E1A]'
                }`}
              >
                {receivedList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFolder('leads');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFolder === 'leads'
                  ? 'bg-[#660E1A] text-white'
                  : 'text-[#121418] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="inline-flex items-center gap-2.5">
                <Sparkles size={16} />
                Leads de la Web
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  activeFolder === 'leads' ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#660E1A]'
                }`}
              >
                {leadsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFolder('sent');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFolder === 'sent'
                  ? 'bg-[#660E1A] text-white'
                  : 'text-[#121418] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="inline-flex items-center gap-2.5">
                <Send size={16} />
                Enviados
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  activeFolder === 'sent' ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#660E1A]'
                }`}
              >
                {sentList.length}
              </span>
            </button>

            <div className="pt-4 mt-4 border-t border-[#EFEAE2] px-2 text-[11px] text-[#6E7480] space-y-1.5">
              <div className="font-bold text-[#121418] uppercase tracking-wider">Estado del Buzón</div>
              <div>• Dominio: <strong>neweraky.com</strong> (Verificado)</div>
              <div>• Firma Corporativa: <strong>Activa</strong></div>
              <div>• Reenvío a Gmail: <strong>Activo</strong></div>
            </div>
          </div>

          {/* Email List & Detail Reader */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-[#E5DFD5] min-h-[540px] overflow-hidden flex flex-col">
            {!selectedEmail ? (
              <div className="flex-1 divide-y divide-[#EFEAE2]">
                <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#EFEAE2] flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#660E1A]">
                    {activeFolder === 'received' && 'Bandeja de Entrada (@neweraky.com)'}
                    {activeFolder === 'leads' && 'Leads & Solicitudes de Clientes'}
                    {activeFolder === 'sent' && 'Correos Enviados'}
                  </span>
                  <span className="text-xs text-[#6E7480]">{activeList.length} mensajes</span>
                </div>

                {loadingList ? (
                  <div className="p-12 text-center text-sm text-[#6E7480]">Cargando mensajes...</div>
                ) : activeList.length === 0 ? (
                  <div className="p-14 text-center">
                    <Mail size={36} className="mx-auto text-[#C4BCB0] mb-3" />
                    <div className="text-sm font-bold text-[#121418]">No hay mensajes en esta carpeta todavía</div>
                    <p className="text-xs text-[#6E7480] mt-1 max-w-md mx-auto">
                      Cualquier correo que envíen a <strong>{loggedAgent.corporateEmail}</strong> aparecerá aquí al instante y también te llegará en copia a tu correo personal.
                    </p>
                  </div>
                ) : (
                  activeList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectEmailItem(item)}
                      className="w-full px-5 py-4 text-left hover:bg-[#FAF7F2] transition-colors flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#660E1A] truncate">
                            {item.direction === 'inbound' ? `De: ${item.from}` : `Para: ${item.to.join(', ')}`}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#121418] truncate">{item.subject}</div>
                      </div>
                      <div className="text-[11px] text-[#847C74] whitespace-nowrap shrink-0">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              /* Email Reader View */
              <div className="flex-1 flex flex-col">
                <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#EFEAE2] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmail(null);
                      setEmailDetail(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#660E1A] hover:underline cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    Volver a la lista
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenReply}
                    className="px-4 py-2 rounded-xl bg-[#660E1A] hover:bg-[#4D0913] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Reply size={14} />
                    Responder como {loggedAgent.corporateEmail}
                  </button>
                </div>

                <div className="p-6 border-b border-[#EFEAE2] bg-white">
                  <h2 className="text-lg font-bold text-[#121418] mb-2">{selectedEmail.subject}</h2>
                  <div className="text-xs text-[#5A606D] space-y-1">
                    <div>
                      <strong>De:</strong> {emailDetail?.from || selectedEmail.from}
                    </div>
                    <div>
                      <strong>Para:</strong>{' '}
                      {Array.isArray(emailDetail?.to)
                        ? emailDetail.to.join(', ')
                        : selectedEmail.to.join(', ')}
                    </div>
                    <div>
                      <strong>Fecha:</strong>{' '}
                      {selectedEmail.createdAt ? new Date(selectedEmail.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto bg-white">
                  {loadingDetail ? (
                    <div className="text-sm text-[#6E7480]">Cargando contenido del mensaje...</div>
                  ) : emailDetail?.html ? (
                    <div
                      className="prose max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: emailDetail.html }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm text-[#121418]">
                      {emailDetail?.text || '(Sin contenido de texto)'}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== COMPOSE MODAL ==================== */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-[#660E1A] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#F6D8A8] font-bold">
                  NUEVO MENSAJE CORPORATIVO
                </div>
                <div className="text-sm font-bold">
                  De: {loggedAgent.name} &lt;{loggedAgent.corporateEmail}&gt;
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              {sendStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    sendStatus.type === 'ok'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {sendStatus.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#121418] mb-1">Para (Destinatario)</label>
                  <input
                    type="text"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D0C5] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#121418] mb-1">CC (Opcional)</label>
                  <input
                    type="text"
                    value={composeCc}
                    onChange={(e) => setComposeCc(e.target.value)}
                    placeholder="copia@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D0C5] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#121418] mb-1">Asunto</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Asunto del correo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D0C5] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#121418] mb-1">Mensaje</label>
                <textarea
                  rows={6}
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D0C5] text-sm"
                  required
                />
              </div>

              {/* Automatic Corporate Signature Preview */}
              <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-[#E5DFD5]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#847C74] mb-2">
                  Firma Oficial Incluida Automáticamente:
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={loggedAgent.photoUrl}
                    alt={loggedAgent.name}
                    className="w-11 h-14 rounded-lg object-cover object-top border border-[#E5DFD5]"
                  />
                  <div className="text-xs text-[#121418] leading-snug">
                    <div className="font-bold">{loggedAgent.name}</div>
                    <div className="text-[#660E1A] font-semibold text-[11px]">{loggedAgent.title} · New Era Real Estate LLC</div>
                    <div className="text-[#5A606D] text-[11px]">
                      {loggedAgent.phone} · {loggedAgent.corporateEmail}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D8D0C5] text-xs font-bold uppercase text-[#5A606D]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-6 py-2.5 rounded-xl bg-[#660E1A] hover:bg-[#4D0913] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  {sendingEmail ? 'Enviando...' : 'Enviar Correo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CHANGE PIN MODAL ==================== */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#121418]">
                Cambiar PIN de {loggedAgent.corporateEmail}
              </h3>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                className="text-[#847C74] hover:text-[#121418]"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveNewPinInside} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#121418] mb-1">
                  Nuevo PIN o Contraseña (mínimo 4 caracteres)
                </label>
                <input
                  type="password"
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="Ingresa el nuevo PIN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D0C5] text-sm"
                  required
                />
              </div>
              {pinStatusMsg && <div className="text-xs font-bold text-[#660E1A]">{pinStatusMsg}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8D0C5] text-xs font-bold uppercase text-[#5A606D]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#660E1A] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Guardar PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
