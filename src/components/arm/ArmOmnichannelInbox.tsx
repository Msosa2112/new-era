import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  Home,
  Mail,
  Plus,
  QrCode,
  Search,
  Send,
  Smartphone,
  X,
} from 'lucide-react';
import { Property } from '../../types/property';
import {
  ArmSessionAgent,
  ArmState,
  EmbeddedPropertyCard,
  OmniChannel,
  OmniConversation,
} from '../../types/arm';
import {
  ArmPalette,
  formatUsd,
  generateDeterministicQrMatrix,
  getChannelBadgeStyle,
} from './armTheme';
import {
  connectAgentChannel,
  createNewConversation,
  markConversationRead,
  sendOmniMessage,
} from '../../services/armStore';

interface ArmOmnichannelInboxProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  activeAgent: ArmSessionAgent;
  isBrokerGlobalView: boolean;
  sessionToken: string;
  armState: ArmState;
  properties: Property[];
  selectedConversationId: string | null;
  onSelectConversation: (convId: string) => void;
  onToast: (msg: string) => void;
}

export const ArmOmnichannelInbox: React.FC<ArmOmnichannelInboxProps> = ({
  lang,
  palette,
  activeAgent,
  isBrokerGlobalView,
  sessionToken,
  armState,
  properties,
  selectedConversationId,
  onSelectConversation,
  onToast,
}) => {
  const [channelFilter, setChannelFilter] = useState<'all' | OmniChannel>('all');
  const [chatSearch, setChatSearch] = useState('');
  const [composerText, setComposerText] = useState('');
  const [mlsSearch, setMlsSearch] = useState('');
  const [showMlsDrawerMobile, setShowMlsDrawerMobile] = useState(false);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientChannel, setNewClientChannel] = useState<OmniChannel>('whatsapp');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientMessage, setNewClientMessage] = useState('');

  const [liveEmailModalOpen, setLiveEmailModalOpen] = useState(false);
  const [liveEmailTo, setLiveEmailTo] = useState('');
  const [liveEmailSubject, setLiveEmailSubject] = useState('');
  const [liveEmailBody, setLiveEmailBody] = useState('');
  const [sendingRealEmail, setSendingRealEmail] = useState(false);

  const agentChannels = armState.channelStatusByAgent[activeAgent.id] || {
    whatsappConnected: false,
    whatsappPhone: activeAgent.phone,
    instagramConnected: false,
    instagramHandle: '',
    facebookConnected: false,
    facebookPage: '',
    emailConnected: true,
  };

  const visibleConversations = useMemo(() => {
    const base = isBrokerGlobalView
      ? armState.conversations
      : armState.conversations.filter((c) => c.agentId === activeAgent.id);

    const list = base.length > 0 ? base : armState.conversations;
    return list.filter((c) => {
      if (channelFilter !== 'all' && c.channel !== channelFilter) return false;
      const q = chatSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.lastPreview.toLowerCase().includes(q)
      );
    });
  }, [armState.conversations, activeAgent.id, isBrokerGlobalView, channelFilter, chatSearch]);

  const activeConv: OmniConversation | null =
    visibleConversations.find((c) => c.id === selectedConversationId) ||
    visibleConversations[0] ||
    null;

  const filteredProperties = useMemo(() => {
    const q = mlsSearch.toLowerCase().trim();
    const list = properties.filter((p) => {
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.neighborhood.toLowerCase().includes(q)
      );
    });
    return list.slice(0, 12);
  }, [properties, mlsSearch]);

  const qrMatrix = useMemo(
    () => generateDeterministicQrMatrix(`newera-wa-${activeAgent.id}-${activeAgent.phone}`),
    [activeAgent.id, activeAgent.phone]
  );

  const handleSelectConv = (conv: OmniConversation) => {
    onSelectConversation(conv.id);
    if (conv.unreadCount > 0) {
      markConversationRead(conv.id);
    }
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConv || !composerText.trim()) return;
    sendOmniMessage(activeConv.id, composerText);
    setComposerText('');
    onToast(`Mensaje enviado a ${activeConv.clientName}`);
  };

  const handleApproveAiSuggestion = () => {
    if (!activeConv) return;
    const suggestion =
      lang === 'es' ? activeConv.aiSuggestedReplyEs : activeConv.aiSuggestedReplyEn;
    sendOmniMessage(activeConv.id, suggestion);
    onToast(`Respuesta enviada a ${activeConv.clientName}`);
  };

  const handleSendMlsProperty = (prop: Property) => {
    if (!activeConv) {
      onToast('Elige primero a un cliente en la lista.');
      return;
    }
    const primaryImg = prop.media?.[0]?.url || '/assets/masterclass/house-louisville-clean.jpg';
    const card: EmbeddedPropertyCard = {
      id: prop.id,
      slug: prop.slug,
      title: prop.title,
      address: prop.location.address,
      city: `${prop.location.city}, ${prop.location.state} ${prop.location.zip}`,
      price: prop.price,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      sqft: prop.sqft,
      imageUrl: primaryImg,
      mlsId: prop.mls?.mlsId,
    };
    sendOmniMessage(
      activeConv.id,
      `Te comparto esta casa disponible en ${prop.location.address} (${formatUsd(prop.price)}):`,
      card
    );
    setShowMlsDrawerMobile(false);
    onToast(`Casa enviada a ${activeConv.clientName}`);
  };

  const handleSimulateQrScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      connectAgentChannel(activeAgent.id, 'whatsapp', activeAgent.phone);
      setQrScanning(false);
      setQrModalOpen(false);
      onToast(`WhatsApp conectado para ${activeAgent.name}`);
    }, 800);
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    const { conversationId } = createNewConversation(
      activeAgent.id,
      newClientName,
      newClientChannel,
      newClientMessage || 'Hola, te escribo de New Era Real Estate.',
      newClientContact
    );
    onSelectConversation(conversationId);
    setNewChatModalOpen(false);
    setNewClientName('');
    setNewClientContact('');
    setNewClientMessage('');
    onToast('Conversación iniciada');
  };

  const handleSendRealEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveEmailTo.trim() || !liveEmailSubject.trim() || !liveEmailBody.trim()) return;
    setSendingRealEmail(true);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          action: 'send',
          targetAgentId: activeAgent.id,
          to: liveEmailTo.trim(),
          subject: liveEmailSubject.trim(),
          message: liveEmailBody.trim(),
        }),
      });
      const data = await resp.json().catch(() => null);
      if (resp.ok && data?.success) {
        onToast(`Correo enviado a ${liveEmailTo}`);
        setLiveEmailModalOpen(false);
        setLiveEmailTo('');
        setLiveEmailSubject('');
        setLiveEmailBody('');
      } else {
        onToast(data?.error || 'Usa el portal de correo para enviar con tu PIN.');
      }
    } catch {
      onToast('No se pudo enviar el correo en este momento.');
    } finally {
      setSendingRealEmail(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Clean Top Bar: 3 Large Plain Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              height: '48px',
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
            <QrCode size={17} color={palette.brand} />
            <span>
              {agentChannels.whatsappConnected
                ? `WhatsApp conectado (${activeAgent.phone})`
                : 'Conectar mi WhatsApp (QR)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLiveEmailModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              height: '48px',
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
            <Mail size={17} color={palette.brand} />
            <span>Enviar Correo</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setNewChatModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            height: '48px',
            padding: '0 1.2rem',
            borderRadius: '11px',
            border: 'none',
            backgroundColor: palette.brand,
            color: palette.brandTextOnPrimary,
            fontSize: '0.96rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <Plus size={17} />
          <span>Nuevo Mensaje</span>
        </button>
      </div>

      {/* 3-Pane Workspace */}
      <div className="arm-inbox-grid">
        {/* Pane 1: Clients */}
        <div
          className={`arm-inbox-pane-list ${activeConv ? 'has-selection' : ''}`}
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1rem', borderBottom: `1px solid ${palette.border}`, flexShrink: 0 }}>
            <div style={{ position: 'relative', marginBottom: '0.7rem' }}>
              <Search
                size={16}
                color={palette.textMuted}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Buscar persona..."
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 0.85rem 0 2.3rem',
                  borderRadius: '10px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.96rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'instagram', label: 'IG' },
                  { id: 'facebook', label: 'FB' },
                  { id: 'email', label: 'Correo' },
                ] as const
              ).map((tab) => {
                const active = channelFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setChannelFilter(tab.id)}
                    style={{
                      padding: '0.4rem 0.65rem',
                      borderRadius: '8px',
                      border: `1px solid ${active ? palette.brand : palette.stoneBorder}`,
                      backgroundColor: active ? palette.brand : palette.bgSubtle,
                      color: active ? palette.brandTextOnPrimary : palette.text,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {visibleConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              const badge = getChannelBadgeStyle(conv.channel, palette.mode);
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => handleSelectConv(conv)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                    backgroundColor: isSelected ? palette.brandSoft : palette.bgSubtle,
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#121418',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {conv.clientInitials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.35rem' }}>
                      <strong style={{ fontSize: '1rem', color: palette.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.clientName}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: palette.textMuted, whiteSpace: 'nowrap' }}>
                        {conv.updatedAt}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.25rem 0' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {badge.label}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.12rem 0.5rem',
                            borderRadius: '999px',
                            backgroundColor: palette.brand,
                            color: palette.brandTextOnPrimary,
                          }}
                        >
                          Nuevo
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        color: palette.textSecondary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {conv.lastPreview}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pane 2: Active Chat */}
        <div
          className={`arm-inbox-pane-chat ${activeConv ? 'has-selection' : ''}`}
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {activeConv ? (
            <>
              <div
                style={{
                  padding: '1rem 1.2rem',
                  borderBottom: `1px solid ${palette.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="arm-mobile-only-btn"
                    onClick={() => onSelectConversation('')}
                    style={{
                      padding: '0.45rem',
                      borderRadius: '9px',
                      border: `1px solid ${palette.stoneBorder}`,
                      backgroundColor: palette.bgSubtle,
                      color: palette.text,
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: palette.text }}>
                      {activeConv.clientName}
                    </div>
                    <div style={{ fontSize: '0.86rem', color: palette.textSecondary }}>
                      {getChannelBadgeStyle(activeConv.channel, palette.mode).label} -{' '}
                      {activeConv.clientPhone || activeConv.clientEmail || 'Directo'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="arm-mobile-mls-trigger"
                  onClick={() => setShowMlsDrawerMobile(!showMlsDrawerMobile)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    height: '42px',
                    padding: '0 0.9rem',
                    borderRadius: '9px',
                    border: `1px solid ${palette.stoneBorder}`,
                    backgroundColor: palette.bgSubtle,
                    color: palette.text,
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Home size={15} />
                  <span>Casas</span>
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  backgroundColor: palette.bgApp,
                }}
              >
                {activeConv.messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isAgent ? 'flex-end' : 'flex-start',
                        maxWidth: '84%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          padding: '0.85rem 1.05rem',
                          borderRadius: '14px',
                          backgroundColor: isAgent ? palette.brand : palette.bgPanel,
                          color: isAgent ? palette.brandTextOnPrimary : palette.text,
                          border: isAgent ? 'none' : `1px solid ${palette.stoneBorder}`,
                          fontSize: '1rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.text}
                      </div>

                      {msg.propertyCard && (
                        <div
                          style={{
                            borderRadius: '14px',
                            overflow: 'hidden',
                            backgroundColor: palette.bgPanel,
                            border: `1.5px solid ${palette.stoneBorder}`,
                            maxWidth: '300px',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={msg.propertyCard.imageUrl}
                            alt={msg.propertyCard.address}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                '/assets/masterclass/house-louisville-clean.jpg';
                            }}
                            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                          />
                          <div style={{ padding: '0.85rem' }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: palette.text }}>
                              {formatUsd(msg.propertyCard.price)}
                            </div>
                            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: palette.text, marginTop: '0.15rem' }}>
                              {msg.propertyCard.address}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: palette.textSecondary, marginTop: '0.2rem' }}>
                              {msg.propertyCard.bedrooms} hab - {msg.propertyCard.bathrooms} baños
                            </div>
                          </div>
                        </div>
                      )}

                      <span
                        style={{
                          fontSize: '0.76rem',
                          color: palette.textMuted,
                          alignSelf: isAgent ? 'flex-end' : 'flex-start',
                        }}
                      >
                        {msg.createdAt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Simple Suggested Reply Box */}
              <div
                style={{
                  margin: '0.75rem 1rem 0',
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  backgroundColor: palette.bgSubtle,
                  border: `1.5px solid ${palette.stoneBorder}`,
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: palette.textSecondary, marginBottom: '0.3rem' }}>
                  Respuesta rápida sugerida:
                </div>
                <p style={{ margin: '0 0 0.65rem', fontSize: '0.94rem', color: palette.text, lineHeight: 1.45 }}>
                  “{lang === 'es' ? activeConv.aiSuggestedReplyEs : activeConv.aiSuggestedReplyEn}”
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() =>
                      setComposerText(
                        lang === 'es' ? activeConv.aiSuggestedReplyEs : activeConv.aiSuggestedReplyEn
                      )
                    }
                    style={{
                      height: '42px',
                      padding: '0 0.9rem',
                      borderRadius: '9px',
                      border: `1px solid ${palette.stoneBorder}`,
                      backgroundColor: palette.bgPanel,
                      color: palette.text,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveAiSuggestion}
                    style={{
                      height: '42px',
                      padding: '0 1rem',
                      borderRadius: '9px',
                      border: 'none',
                      backgroundColor: palette.brand,
                      color: palette.brandTextOnPrimary,
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Enviar esta respuesta
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSendText}
                style={{
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderTop: `1px solid ${palette.border}`,
                  marginTop: '0.65rem',
                  flexShrink: 0,
                }}
              >
                <input
                  type="text"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder={`Escribir mensaje a ${activeConv.clientName}...`}
                  style={{
                    flex: 1,
                    height: '50px',
                    padding: '0 1rem',
                    borderRadius: '11px',
                    border: `1.5px solid ${palette.borderStrong}`,
                    backgroundColor: palette.bgSubtle,
                    color: palette.text,
                    fontSize: '0.98rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
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
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={16} />
                  <span>Enviar</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: palette.textMuted, fontSize: '1.1rem' }}>
              Toca a una persona en la lista para ver el chat.
            </div>
          )}
        </div>

        {/* Pane 3: Send a House */}
        <div
          className={`arm-inbox-pane-mls ${showMlsDrawerMobile ? 'open-mobile' : ''}`}
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '18px',
            border: `1.5px solid ${palette.stoneBorder}`,
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1rem', borderBottom: `1px solid ${palette.border}`, flexShrink: 0 }}>
            <strong style={{ display: 'block', fontSize: '1rem', color: palette.text, marginBottom: '0.65rem' }}>
              Enviar una Casa al Chat
            </strong>
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                color={palette.textMuted}
                style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={mlsSearch}
                onChange={(e) => setMlsSearch(e.target.value)}
                placeholder="Buscar dirección..."
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 0.8rem 0 2.2rem',
                  borderRadius: '10px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {filteredProperties.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem 0.75rem',
                  textAlign: 'center',
                  color: palette.textMuted,
                  fontSize: '0.95rem',
                }}
              >
                No se encontró esa dirección.
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const imgUrl = prop.media?.[0]?.url || '/assets/masterclass/house-louisville-clean.jpg';
                return (
                  <div
                    key={prop.id}
                    className="arm-mls-house-card"
                    style={{
                      borderRadius: '13px',
                      overflow: 'hidden',
                      backgroundColor: palette.bgSubtle,
                      border: `1px solid ${palette.stoneBorder}`,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={prop.location.address}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/assets/masterclass/house-louisville-clean.jpg';
                      }}
                      style={{
                        width: '100%',
                        height: '130px',
                        objectFit: 'cover',
                        display: 'block',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ padding: '0.85rem' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: palette.text }}>
                        {formatUsd(prop.price)}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: palette.text, marginTop: '0.2rem' }}>
                        {prop.location.address}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: palette.textSecondary, marginTop: '0.15rem', marginBottom: '0.65rem' }}>
                        {prop.bedrooms} hab - {prop.bathrooms} baños
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSendMlsProperty(prop)}
                        style={{
                          width: '100%',
                          height: '44px',
                          borderRadius: '9px',
                          border: 'none',
                          backgroundColor: palette.brand,
                          color: palette.brandTextOnPrimary,
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Enviar al chat
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp QR Modal */}
      {qrModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setQrModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.6rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '14px',
                background: 'none',
                border: 'none',
                color: palette.text,
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <Smartphone size={28} color={palette.brand} style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.3rem', fontWeight: 800, color: palette.text }}>
              Conectar WhatsApp ({activeAgent.name.split(' ')[0]})
            </h3>
            <p style={{ margin: '0 0 1.2rem', fontSize: '0.94rem', color: palette.textSecondary, lineHeight: 1.45 }}>
              Escanea con tu celular desde WhatsApp para responder desde aquí.
            </p>

            <div
              style={{
                width: '210px',
                height: '210px',
                margin: '0 auto 1.2rem',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: `1.5px solid ${palette.stoneBorder}`,
              }}
            >
              <svg width="100%" height="100%" viewBox={`0 0 ${qrMatrix.size} ${qrMatrix.size}`}>
                <rect width={qrMatrix.size} height={qrMatrix.size} fill="#FFFFFF" />
                {qrMatrix.cells.map((c, idx) => (
                  <rect key={idx} x={c.x} y={c.y} width={1} height={1} fill="#121418" />
                ))}
                {[
                  [2, 2],
                  [qrMatrix.size - 9, 2],
                  [2, qrMatrix.size - 9],
                ].map(([fx, fy], idx) => (
                  <g key={idx}>
                    <rect x={fx} y={fy} width={7} height={7} fill="#121418" />
                    <rect x={fx + 1} y={fy + 1} width={5} height={5} fill="#FFFFFF" />
                    <rect x={fx + 2} y={fy + 2} width={3} height={3} fill="#660E1A" />
                  </g>
                ))}
              </svg>
            </div>

            <button
              type="button"
              disabled={qrScanning}
              onClick={handleSimulateQrScan}
              style={{
                width: '100%',
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
              {qrScanning ? 'Conectando...' : 'Listo, ya lo escanee'}
            </button>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {newChatModalOpen && (
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
          onClick={() => setNewChatModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateNewChat}
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <strong style={{ fontSize: '1.2rem', color: palette.text }}>Nuevo Mensaje</strong>
            <input
              required
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Nombre del cliente"
              style={{ height: '48px', padding: '0 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem' }}
            />
            <select
              value={newClientChannel}
              onChange={(e) => setNewClientChannel(e.target.value as OmniChannel)}
              style={{ height: '48px', padding: '0 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem' }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="email">Correo</option>
            </select>
            <input
              type="text"
              value={newClientContact}
              onChange={(e) => setNewClientContact(e.target.value)}
              placeholder={newClientChannel === 'email' ? 'correo@cliente.com' : 'Teléfono'}
              style={{ height: '48px', padding: '0 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem' }}
            />
            <textarea
              rows={3}
              value={newClientMessage}
              onChange={(e) => setNewClientMessage(e.target.value)}
              placeholder="Escribe el mensaje..."
              style={{ padding: '0.75rem 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setNewChatModalOpen(false)} style={{ height: '48px', padding: '0 1.1rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgPanel, color: palette.text, fontWeight: 700, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="submit" style={{ height: '48px', padding: '0 1.25rem', borderRadius: '10px', border: 'none', backgroundColor: palette.brand, color: palette.brandTextOnPrimary, fontWeight: 800, cursor: 'pointer' }}>
                Crear Chat
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Email Modal */}
      {liveEmailModalOpen && (
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
          onClick={() => setLiveEmailModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSendRealEmail}
            style={{
              width: '100%',
              maxWidth: '480px',
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
              <strong style={{ fontSize: '1.15rem', color: palette.text }}>
                Enviar Correo ({activeAgent.corporateEmail})
              </strong>
              <button type="button" onClick={() => setLiveEmailModalOpen(false)} style={{ background: 'none', border: 'none', color: palette.text, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <input
              required
              type="email"
              value={liveEmailTo}
              onChange={(e) => setLiveEmailTo(e.target.value)}
              placeholder="Para: correo@ejemplo.com"
              style={{ height: '48px', padding: '0 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem' }}
            />
            <input
              required
              type="text"
              value={liveEmailSubject}
              onChange={(e) => setLiveEmailSubject(e.target.value)}
              placeholder="Asunto"
              style={{ height: '48px', padding: '0 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem' }}
            />
            <textarea
              required
              rows={4}
              value={liveEmailBody}
              onChange={(e) => setLiveEmailBody(e.target.value)}
              placeholder="Escribe tu mensaje..."
              style={{ padding: '0.75rem 0.9rem', borderRadius: '10px', border: `1px solid ${palette.stoneBorder}`, backgroundColor: palette.bgSubtle, color: palette.text, fontSize: '1rem', fontFamily: 'inherit' }}
            />
            <button
              type="submit"
              disabled={sendingRealEmail}
              style={{ height: '52px', borderRadius: '11px', border: 'none', backgroundColor: palette.brand, color: palette.brandTextOnPrimary, fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
            >
              {sendingRealEmail ? 'Enviando...' : 'Enviar Correo'}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .arm-inbox-grid {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr) 320px;
          grid-template-rows: minmax(0, 1fr);
          gap: 1.1rem;
          height: 700px;
        }
        .arm-mobile-only-btn, .arm-mobile-mls-trigger {
          display: none !important;
        }
        @media (max-width: 1180px) {
          .arm-inbox-grid {
            grid-template-columns: 280px minmax(0, 1fr);
            grid-template-rows: auto;
            height: auto;
            min-height: 600px;
          }
          .arm-inbox-pane-list, .arm-inbox-pane-chat {
            max-height: 680px;
          }
          .arm-inbox-pane-mls {
            grid-column: 1 / -1;
            max-height: 480px;
          }
        }
        @media (max-width: 820px) {
          .arm-inbox-grid {
            grid-template-columns: 1fr;
            height: auto;
          }
          .arm-inbox-pane-list.has-selection {
            display: none !important;
          }
          .arm-inbox-pane-chat:not(.has-selection) {
            display: none !important;
          }
          .arm-inbox-pane-chat {
            min-height: 540px;
          }
          .arm-mobile-only-btn, .arm-mobile-mls-trigger {
            display: inline-flex !important;
          }
          .arm-inbox-pane-mls:not(.open-mobile) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
