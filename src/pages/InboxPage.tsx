import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Search,
  ChevronLeft,
  Users,
  Lock,
  ArrowRight,
  Paperclip,
  Download,
  FileText,
  Trash2,
  X
} from 'lucide-react';
import { AGENTS_DATA } from '../data/agentsData';
import { Agent } from '../types/property';
import { HexPattern } from '../components/common/HexPattern';

interface InboxPageProps {
  lang: 'en' | 'es';
}

interface EmailSummary {
  id: string;
  direction: 'inbound' | 'outbound';
  folder: 'received' | 'sent';
  from: string;
  to: string[];
  subject: string;
  createdAt: string;
  lastEvent?: string;
  hasAttachments?: boolean;
}

interface ComposeAttachmentItem {
  id: string;
  filename: string;
  content: string;
  contentType: string;
  size: number;
}

const STORAGE_KEY = 'newera_inbox_session_v1';

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const InboxPage: React.FC<InboxPageProps> = ({ lang }) => {
  const [token, setToken] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loggedAgent, setLoggedAgent] = useState<any | null>(null);

  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS_DATA[0]?.id || 'yeilen-contreras');
  const [agentSearch, setAgentSearch] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');

  const [resetMode, setResetMode] = useState<'none' | 'verify'>('none');
  const [resetToken, setResetToken] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [resetNewPin, setResetNewPin] = useState<string>('');
  const [maskedEmailHint, setMaskedEmailHint] = useState<string>('');

  const [activeFolder, setActiveFolder] = useState<'received' | 'sent'>('received');
  const [targetAgentId, setTargetAgentId] = useState<string>('');
  const [viewAllMailboxes, setViewAllMailboxes] = useState<boolean>(false);
  const [receivedList, setReceivedList] = useState<EmailSummary[]>([]);
  const [sentList, setSentList] = useState<EmailSummary[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);

  const [selectedEmail, setSelectedEmail] = useState<EmailSummary | null>(null);
  const [emailDetail, setEmailDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeCc, setComposeCc] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeMessage, setComposeMessage] = useState<string>('');
  const [composeAttachments, setComposeAttachments] = useState<ComposeAttachmentItem[]>([]);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [newPinValue, setNewPinValue] = useState<string>('');
  const [pinStatusMsg, setPinStatusMsg] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

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

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setIsAdmin(false);
    setLoggedAgent(null);
    setSelectedEmail(null);
    setEmailDetail(null);
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
    [targetAgentId, viewAllMailboxes, handleLogout]
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
    setComposeAttachments([]);
    setSendStatus(null);
    setComposeOpen(true);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ComposeAttachmentItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        setSendStatus({
          type: 'err',
          text: `El archivo "${file.name}" supera el límite de 10 MB por adjunto.`
        });
        continue;
      }

      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || '');
          const clean = result.includes('base64,') ? result.split('base64,')[1] : result;
          resolve(clean);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      newItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${i}`,
        filename: file.name,
        content: base64Content,
        contentType: file.type || 'application/octet-stream',
        size: file.size
      });
    }

    setComposeAttachments((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setComposeAttachments((prev) => prev.filter((item) => item.id !== id));
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
          message: composeMessage,
          attachments: composeAttachments.map((a) => ({
            filename: a.filename,
            content: a.content,
            contentType: a.contentType
          }))
        })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setSendStatus({ type: 'err', text: data.error || 'No se pudo enviar el correo.' });
      } else {
        setSendStatus({
          type: 'ok',
          text:
            '¡Correo enviado exitosamente desde ' +
            loggedAgent?.corporateEmail +
            (composeAttachments.length > 0 ? ` con ${composeAttachments.length} adjunto(s)!` : '!')
        });
        setTimeout(() => {
          setComposeOpen(false);
          setComposeTo('');
          setComposeCc('');
          setComposeSubject('');
          setComposeMessage('');
          setComposeAttachments([]);
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

  const activeList = activeFolder === 'received' ? receivedList : sentList;
  const detailAttachments: any[] = Array.isArray(emailDetail?.signedAttachments)
    ? emailDetail.signedAttachments
    : Array.isArray(emailDetail?.attachments)
    ? emailDetail.attachments
    : [];

  // ==================== LOGIN SCREEN ====================
  if (!token || !loggedAgent) {
    return (
      <main
        style={{
          paddingTop: 'calc(var(--header-height, 84px) + 2.5rem)',
          paddingBottom: '5rem',
          minHeight: '100vh',
          backgroundColor: '#FAF7F2',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <HexPattern variant="burgundy" opacity={0.05} maskFade="radial-top-right" />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1120px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(102, 14, 26, 0.08)',
                border: '1px solid rgba(102, 14, 26, 0.2)',
                color: '#660E1A',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginBottom: '0.85rem'
              }}
            >
              <ShieldCheck size={14} />
              <span>{lang === 'es' ? 'PORTAL DE CORREO CORPORATIVO' : 'CORPORATE EMAIL PORTAL'}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)',
                fontWeight: 700,
                color: '#121418',
                margin: '0 0 0.6rem 0',
                letterSpacing: '-0.01em'
              }}
            >
              New Era Mail <span style={{ color: '#660E1A' }}>@neweraky.com</span>
            </h1>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#5A606D',
                maxWidth: '580px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              {lang === 'es'
                ? 'Selecciona tu perfil de agente e ingresa tu PIN para abrir tu bandeja de entrada y enviar correos con archivos adjuntos desde tu cuenta @neweraky.com.'
                : 'Select your agent profile and enter your PIN to access your inbox and send emails with attachments from your @neweraky.com address.'}
            </p>
          </div>

          {/* Main 2-Column Responsive Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'start'
            }}
          >
            {/* Left Card: Agent Selector */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E6DFD5',
                boxShadow: '0 10px 30px rgba(18, 20, 24, 0.05)',
                padding: '1.5rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#660E1A'
                  }}
                >
                  1. Selecciona tu Buzón (@neweraky.com)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#78736B', fontWeight: 600 }}>
                  {AGENTS_DATA.length} Cuentas
                </span>
              </div>

              {/* Search Input */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search
                  size={16}
                  color="#847C74"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Buscar agente por nombre o correo..."
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.5rem',
                    borderRadius: '12px',
                    border: '1px solid #E2DBD0',
                    backgroundColor: '#FAF8F5',
                    fontSize: '0.88rem',
                    color: '#121418',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Scrollable Grid of Agents */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '0.6rem',
                  maxHeight: '420px',
                  overflowY: 'auto',
                  paddingRight: '0.25rem'
                }}
              >
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
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '12px',
                        border: isSelected ? '1px solid #660E1A' : '1px solid #EAE4DC',
                        backgroundColor: isSelected ? '#660E1A' : '#FAF8F5',
                        color: isSelected ? '#FFFFFF' : '#121418',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img
                        src={agent.photoUrl}
                        alt={agent.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          minWidth: '44px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          backgroundColor: '#EDEAE4',
                          border: isSelected ? '1px solid rgba(255,255,255,0.35)' : '1px solid #E2DBD0'
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <div
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: isSelected ? '#FFFFFF' : '#121418',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {agent.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.74rem',
                            fontFamily: 'monospace',
                            color: isSelected ? '#F6D8A8' : '#660E1A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px'
                          }}
                        >
                          {agent.email}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Card: Selected Agent Login / PIN Reset */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E6DFD5',
                boxShadow: '0 14px 36px rgba(18, 20, 24, 0.07)',
                padding: '1.75rem'
              }}
            >
              {/* Selected Agent Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid #EFEAE2'
                }}
              >
                <img
                  src={currentAgentObj.photoUrl}
                  alt={currentAgentObj.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    minWidth: '68px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '1px solid #E2DBD0',
                    backgroundColor: '#F3EFE8'
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#660E1A'
                    }}
                  >
                    {currentAgentObj.title}
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#121418',
                      marginTop: '2px'
                    }}
                  >
                    {currentAgentObj.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#5A606D',
                      marginTop: '2px'
                    }}
                  >
                    {currentAgentObj.email}
                  </div>
                </div>
              </div>

              {authError && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#B91C1C',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    lineHeight: 1.5
                  }}
                >
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    lineHeight: 1.5
                  }}
                >
                  {authSuccess}
                </div>
              )}

              {resetMode === 'none' ? (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#121418',
                        marginBottom: '0.5rem'
                      }}
                    >
                      2. PIN de Acceso
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={16}
                        color="#847C74"
                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <input
                        type="password"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="Ingresa tu PIN (ej. últimos 4 dígitos de tu tel)"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem 0.85rem 2.5rem',
                          borderRadius: '12px',
                          border: '1px solid #D8D0C5',
                          backgroundColor: '#FAF8F5',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: '#121418',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: '0.76rem',
                        color: '#6E7480',
                        marginTop: '0.55rem',
                        lineHeight: 1.5
                      }}
                    >
                      💡 <strong>¿Primera vez entrando?</strong> Tu PIN inicial son los{' '}
                      <strong>últimos 4 dígitos de tu teléfono</strong> ({currentAgentObj.phone}).
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#660E1A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>{authLoading ? 'Verificando...' : 'Entrar a mi Bandeja'}</span>
                    <ArrowRight size={15} />
                  </button>

                  <div
                    style={{
                      marginTop: '1.1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #EFEAE2',
                      textAlign: 'center'
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleRequestPinReset}
                      disabled={authLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#660E1A',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <KeyRound size={13} />
                      <span>¿Olvidaste o quieres cambiar tu PIN? Recibir código en mi Gmail</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmPinReset}>
                  <p style={{ fontSize: '0.82rem', color: '#5A606D', lineHeight: 1.5, marginBottom: '1rem' }}>
                    Ingresa el código de 6 dígitos enviado a <strong>{maskedEmailHint}</strong> y escribe tu nuevo PIN:
                  </p>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#121418',
                        marginBottom: '0.35rem'
                      }}
                    >
                      Código de 6 dígitos
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid #D8D0C5',
                        backgroundColor: '#FAF8F5',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        letterSpacing: '0.3em',
                        color: '#660E1A'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#121418',
                        marginBottom: '0.35rem'
                      }}
                    >
                      Tu Nuevo PIN / Contraseña (mín. 4 caracteres)
                    </label>
                    <input
                      type="password"
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value)}
                      placeholder="Nuevo PIN"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid #D8D0C5',
                        backgroundColor: '#FAF8F5',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={() => setResetMode('none')}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #D8D0C5',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#5A606D',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={authLoading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#660E1A',
                        color: '#FFFFFF',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      {authLoading ? 'Guardando...' : 'Guardar y Entrar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==================== AUTHENTICATED WEBMAIL DASHBOARD ====================
  return (
    <main
      style={{
        paddingTop: 'calc(var(--header-height, 84px) + 1.5rem)',
        paddingBottom: '4rem',
        minHeight: '100vh',
        backgroundColor: '#F4F1EA'
      }}
    >
      <div className="container" style={{ maxWidth: '1280px' }}>
        {/* Top Header Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E5DFD5',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <img
              src={loggedAgent.photoUrl}
              alt={loggedAgent.name}
              style={{
                width: '52px',
                height: '52px',
                minWidth: '52px',
                borderRadius: '12px',
                objectFit: 'cover',
                objectPosition: 'top center',
                border: '1px solid #E2DBD0'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#121418' }}>
                  {loggedAgent.name}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.18rem 0.55rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(102, 14, 26, 0.09)',
                    color: '#660E1A'
                  }}
                >
                  {loggedAgent.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.84rem', fontFamily: 'monospace', fontWeight: 700, color: '#660E1A' }}>
                  {loggedAgent.corporateEmail}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(loggedAgent.corporateEmail);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 1800);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #E2DBD0',
                    backgroundColor: '#FAF8F5',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#5A606D',
                    cursor: 'pointer'
                  }}
                >
                  {copiedEmail ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                </button>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#065F46',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    padding: '0.12rem 0.5rem',
                    borderRadius: '6px'
                  }}
                >
                  ✓ Copia activa a {loggedAgent.maskedPersonalEmail || loggedAgent.personalEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Admin Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {isAdmin && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#FAF7F2',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #E2DBD0'
                }}
              >
                <Users size={14} color="#660E1A" />
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
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#121418',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
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
                setComposeAttachments([]);
                setSendStatus(null);
                setComposeOpen(true);
              }}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                backgroundColor: '#660E1A',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>Redactar Correo</span>
            </button>

            <button
              type="button"
              onClick={() => fetchMailbox(token, targetAgentId, viewAllMailboxes)}
              style={{
                padding: '0.6rem',
                borderRadius: '10px',
                border: '1px solid #E2DBD0',
                backgroundColor: '#FAF7F2',
                color: '#121418',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              title="Actualizar bandeja"
            >
              <RefreshCw size={15} />
            </button>

            <button
              type="button"
              onClick={() => setPinModalOpen(true)}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #E2DBD0',
                backgroundColor: '#FAF7F2',
                color: '#121418',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <KeyRound size={14} color="#660E1A" />
              <span>Cambiar PIN</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Mailbox Body Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start'
          }}
        >
          {/* Left Folders Panel */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5DFD5',
              padding: '1rem',
              maxWidth: '100%'
            }}
          >
            {[
              { id: 'received' as const, label: 'Recibidos (@neweraky.com)', icon: Inbox, count: receivedList.length },
              { id: 'sent' as const, label: 'Enviados', icon: Send, count: sentList.length }
            ].map((f) => {
              const IconComp = f.icon;
              const isAct = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFolder(f.id);
                    setSelectedEmail(null);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    marginBottom: '0.35rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isAct ? '#660E1A' : 'transparent',
                    color: isAct ? '#FFFFFF' : '#121418',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                    <IconComp size={16} />
                    <span>{f.label}</span>
                  </span>
                  <span
                    style={{
                      padding: '0.12rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      backgroundColor: isAct ? 'rgba(255,255,255,0.2)' : '#FAF7F2',
                      color: isAct ? '#FFFFFF' : '#660E1A'
                    }}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #EFEAE2',
                fontSize: '0.74rem',
                color: '#6E7480',
                lineHeight: 1.6
              }}
            >
              <div style={{ fontWeight: 800, color: '#121418', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Estado de la Cuenta
              </div>
              <div>• Dominio: <strong>neweraky.com</strong> (Verificado)</div>
              <div>• Archivos Adjuntos: <strong>Habilitados</strong></div>
              <div>• Firma con Logo: <strong>Activa</strong></div>
              <div>• Reenvío a Gmail: <strong>Activo</strong></div>
            </div>
          </div>

          {/* Right Email List / Reader Panel */}
          <div
            style={{
              gridColumn: 'span 2',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5DFD5',
              minHeight: '520px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {!selectedEmail ? (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    padding: '0.9rem 1.25rem',
                    backgroundColor: '#FAF8F5',
                    borderBottom: '1px solid #EFEAE2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#660E1A'
                    }}
                  >
                    {activeFolder === 'received' && 'Bandeja de Entrada (@neweraky.com)'}
                    {activeFolder === 'sent' && 'Correos Enviados'}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#6E7480', fontWeight: 600 }}>
                    {activeList.length} mensajes
                  </span>
                </div>

                {loadingList ? (
                  <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#6E7480', fontSize: '0.9rem' }}>
                    Cargando mensajes...
                  </div>
                ) : activeList.length === 0 ? (
                  <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <Mail size={38} color="#C4BCB0" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#121418' }}>
                      No hay mensajes en esta carpeta todavía
                    </div>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: '#6E7480',
                        maxWidth: '420px',
                        margin: '0.4rem auto 0 auto',
                        lineHeight: 1.5
                      }}
                    >
                      Cualquier correo enviado a <strong>{loggedAgent.corporateEmail}</strong> aparecerá aquí al instante y también te llegará en copia a tu correo personal.
                    </p>
                  </div>
                ) : (
                  <div>
                    {activeList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectEmailItem(item)}
                        style={{
                          width: '100%',
                          padding: '1rem 1.25rem',
                          border: 'none',
                          borderBottom: '1px solid #EFEAE2',
                          backgroundColor: '#FFFFFF',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: '#660E1A',
                              marginBottom: '0.2rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.direction === 'inbound' ? `De: ${item.from}` : `Para: ${item.to.join(', ')}`}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              color: '#121418',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subject}</span>
                            {item.hasAttachments && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '999px',
                                  backgroundColor: '#FAF7F2',
                                  border: '1px solid #E2DBD0',
                                  color: '#660E1A',
                                  flexShrink: 0
                                }}
                              >
                                <Paperclip size={11} />
                                <span>Adjunto</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#847C74', whiteSpace: 'nowrap' }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    backgroundColor: '#FAF8F5',
                    borderBottom: '1px solid #EFEAE2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmail(null);
                      setEmailDetail(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#660E1A',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Volver a la lista</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenReply}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#660E1A',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Reply size={14} />
                    <span>Responder</span>
                  </button>
                </div>

                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EFEAE2' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#121418', margin: '0 0 0.5rem 0' }}>
                    {selectedEmail.subject}
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#5A606D', lineHeight: 1.6 }}>
                    <div>
                      <strong>De:</strong> {emailDetail?.from || selectedEmail.from}
                    </div>
                    <div>
                      <strong>Para:</strong>{' '}
                      {Array.isArray(emailDetail?.to) ? emailDetail.to.join(', ') : selectedEmail.to.join(', ')}
                    </div>
                    <div>
                      <strong>Fecha:</strong>{' '}
                      {selectedEmail.createdAt ? new Date(selectedEmail.createdAt).toLocaleString() : ''}
                    </div>
                  </div>

                  {/* Attachments bar on received / sent email */}
                  {detailAttachments.length > 0 && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid #E5DFD5'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#660E1A',
                          marginBottom: '0.55rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Paperclip size={13} />
                        <span>Archivos Adjuntos ({detailAttachments.length})</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {detailAttachments.map((att: any, idx: number) => (
                          <a
                            key={att.id || idx}
                            href={att.download_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={att.filename || 'adjunto'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D8D0C5',
                              color: '#121418',
                              textDecoration: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 700
                            }}
                          >
                            <FileText size={14} color="#660E1A" />
                            <span>{att.filename || `Adjunto ${idx + 1}`}</span>
                            {att.size ? (
                              <span style={{ fontSize: '0.7rem', color: '#78736B', fontWeight: 600 }}>
                                ({formatBytes(att.size)})
                              </span>
                            ) : null}
                            <Download size={13} color="#660E1A" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                  {loadingDetail ? (
                    <div style={{ fontSize: '0.88rem', color: '#6E7480' }}>Cargando contenido del mensaje...</div>
                  ) : emailDetail?.html ? (
                    <div dangerouslySetInnerHTML={{ __html: emailDetail.html }} />
                  ) : (
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', fontSize: '0.9rem', color: '#121418' }}>
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(18, 20, 24, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E5DFD5',
              width: '100%',
              maxWidth: '660px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
            }}
          >
            <div
              style={{
                backgroundColor: '#660E1A',
                color: '#FFFFFF',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F6D8A8', fontWeight: 700 }}>
                  NUEVO MENSAJE CORPORATIVO
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
                  De: {loggedAgent.name} &lt;{loggedAgent.corporateEmail}&gt;
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendEmail} style={{ padding: '1.5rem', maxHeight: '82vh', overflowY: 'auto' }}>
              {sendStatus && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: sendStatus.type === 'ok' ? '#ECFDF5' : '#FEF2F2',
                    color: sendStatus.type === 'ok' ? '#065F46' : '#B91C1C',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  {sendStatus.text}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Para (Destinatario)
                  </label>
                  <input
                    type="text"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #D8D0C5', fontSize: '0.86rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    CC (Opcional)
                  </label>
                  <input
                    type="text"
                    value={composeCc}
                    onChange={(e) => setComposeCc(e.target.value)}
                    placeholder="copia@ejemplo.com"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #D8D0C5', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Asunto
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Asunto del correo..."
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #D8D0C5', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Mensaje
                </label>
                <textarea
                  rows={5}
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #D8D0C5', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* File Attachments Section */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#121418' }}>
                    Archivos Adjuntos ({composeAttachments.length})
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFilesSelected}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #660E1A',
                      backgroundColor: '#FAF7F2',
                      color: '#660E1A',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <Paperclip size={14} />
                    <span>Adjuntar Archivos (PDF, Imágenes, Contratos...)</span>
                  </button>
                </div>

                {composeAttachments.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '0.65rem',
                      borderRadius: '10px',
                      backgroundColor: '#FAF8F5',
                      border: '1px solid #E5DFD5'
                    }}
                  >
                    {composeAttachments.map((att) => (
                      <div
                        key={att.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EAE3D8',
                          fontSize: '0.78rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: 1 }}>
                          <FileText size={14} color="#660E1A" style={{ flexShrink: 0 }} />
                          <span
                            style={{
                              fontWeight: 700,
                              color: '#121418',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {att.filename}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#78736B', flexShrink: 0 }}>
                            ({formatBytes(att.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          title="Quitar archivo"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#B91C1C',
                            cursor: 'pointer',
                            padding: '0.15rem',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Official Signature & Logo Preview */}
              <div
                style={{
                  backgroundColor: '#FAF8F5',
                  borderRadius: '12px',
                  padding: '0.95rem 1rem',
                  border: '1px solid #E5DFD5',
                  borderTop: '2px solid #660E1A',
                  marginBottom: '1.25rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.85rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={loggedAgent.photoUrl}
                      alt={loggedAgent.name}
                      style={{
                        width: '52px',
                        height: '66px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        border: '1px solid #E2DBD0'
                      }}
                    />
                    <div style={{ fontSize: '0.76rem', lineHeight: 1.45 }}>
                      <div style={{ fontWeight: 800, color: '#121418', fontSize: '0.84rem' }}>{loggedAgent.name}</div>
                      <div style={{ fontWeight: 700, color: '#660E1A', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {loggedAgent.title} · New Era Real Estate LLC
                      </div>
                      <div style={{ color: '#5A606D', marginTop: '2px' }}>
                        📞 {loggedAgent.phone} · ✉️ {loggedAgent.corporateEmail}
                      </div>
                      <div style={{ color: '#78736B', fontSize: '0.7rem' }}>
                        📍 6501 Shepherdsville Rd, Suite 119, Louisville, KY 40219
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingLeft: '0.75rem', borderLeft: '1px solid #E5DFD5' }}>
                    <img
                      src="/assets/logo-burgundy.png"
                      alt="New Era Real Estate"
                      style={{ width: '105px', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  style={{
                    padding: '0.65rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid #D8D0C5',
                    background: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#660E1A',
                    color: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={14} />
                  <span>{sendingEmail ? 'Enviando...' : 'Enviar Correo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CHANGE PIN MODAL ==================== */}
      {pinModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(18, 20, 24, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5DFD5',
              width: '100%',
              maxWidth: '420px',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#121418', margin: 0 }}>
                Cambiar PIN de {loggedAgent.corporateEmail}
              </h3>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#847C74', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveNewPinInside}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Nuevo PIN o Contraseña (mín. 4 caracteres)
                </label>
                <input
                  type="password"
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="Ingresa el nuevo PIN"
                  required
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1px solid #D8D0C5', fontSize: '0.88rem' }}
                />
              </div>
              {pinStatusMsg && (
                <div style={{ marginBottom: '0.85rem', fontSize: '0.8rem', fontWeight: 700, color: '#660E1A' }}>
                  {pinStatusMsg}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #D8D0C5',
                    background: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#660E1A',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Guardar PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
