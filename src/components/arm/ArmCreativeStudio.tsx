import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Copy,
  Download,
  Film,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import { Property } from '../../types/property';
import {
  ArmSessionAgent,
  ArmState,
  ScheduledSocialPost,
  SocialTemplateType,
} from '../../types/arm';
import {
  ArmPalette,
  formatUsd,
  generateDeterministicQrMatrix,
} from './armTheme';
import {
  deleteSocialPost,
  generateFullMonthSchedule,
  saveSocialPost,
  toggleAgentAutoPublish,
} from '../../services/armStore';

interface ArmCreativeStudioProps {
  lang: 'en' | 'es';
  palette: ArmPalette;
  activeAgent: ArmSessionAgent;
  armState: ArmState;
  properties: Property[];
  onToast: (msg: string) => void;
}

const FALLBACK_HOUSE_IMG = '/assets/masterclass/house-louisville-clean.jpg';

function loadImageSafe(src: string, useCrossOrigin: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (useCrossOrigin) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

export const ArmCreativeStudio: React.FC<ArmCreativeStudioProps> = ({
  lang,
  palette,
  activeAgent,
  armState,
  properties,
  onToast,
}) => {
  const prioritizedProperties = useMemo(() => {
    const newEraFirst = [...properties].sort((a, b) => {
      const aNe = a.isNewEra || a.mls?.isNewEra ? 1 : 0;
      const bNe = b.isNewEra || b.mls?.isNewEra ? 1 : 0;
      return bNe - aNe;
    });
    return newEraFirst.slice(0, 20);
  }, [properties]);

  const [selectedPropId, setSelectedPropId] = useState<string>(
    prioritizedProperties[0]?.id || ''
  );
  const selectedProp =
    prioritizedProperties.find((p) => p.id === selectedPropId) ||
    prioritizedProperties[0];

  const [templateType, setTemplateType] = useState<SocialTemplateType>('just_listed');
  const [customBadge, setCustomBadge] = useState('EN VENTA');
  const [captionText, setCaptionText] = useState('');
  const [scheduleDay, setScheduleDay] = useState<number>(12);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [selectedDayPost, setSelectedDayPost] = useState<ScheduledSocialPost | null>(null);

  const propAddress = selectedProp?.location?.address || '9402 Norton Commons Blvd';
  const propCity = selectedProp
    ? `${selectedProp.location.city}, ${selectedProp.location.state}`
    : 'Prospect, KY';
  const propPrice = selectedProp?.price || 465000;
  const propBeds = selectedProp?.bedrooms || 4;
  const propBaths = selectedProp?.bathrooms || 3;
  const propSqft = selectedProp?.sqft || 2940;
  const propImg = selectedProp?.media?.[0]?.url || FALLBACK_HOUSE_IMG;

  const generatedCaption =
    captionText.trim() ||
    `Nueva propiedad en ${propAddress}, ${propCity} (${formatUsd(propPrice)}).\n${propBeds} habitaciones - ${propBaths} baños - ${propSqft.toLocaleString('en-US')} sqft.\nLlámame al ${activeAgent.phone} para verla hoy.\n${activeAgent.name} - New Era Real Estate`;

  const generatedReelScript = `INICIO (0-3 seg): "¿Buscas casa en ${selectedProp?.location?.city || 'Louisville'} por ${formatUsd(propPrice)}? Mira esta casa en ${propAddress}."\nMEDIO (4-20 seg): "${propBeds} habitaciones, ${propBaths} baños y ${propSqft.toLocaleString('en-US')} pies cuadrados."\nFINAL (21-30 seg): "Escríbeme o llámame al ${activeAgent.phone} para agendar una visita."`;

  const agentPosts = useMemo(() => {
    const own = armState.socialPosts.filter((p) => p.agentId === activeAgent.id);
    return own.length > 0 ? own : armState.socialPosts;
  }, [armState.socialPosts, activeAgent.id]);

  const autoPublishEnabled = Boolean(armState.autoPublishByAgent[activeAgent.id] ?? true);
  const qrMatrix = useMemo(
    () => generateDeterministicQrMatrix(`https://www.neweraky.com/agents/${activeAgent.id}`),
    [activeAgent.id]
  );

  const handleTemplateSelect = (nextType: SocialTemplateType) => {
    setTemplateType(nextType);
    if (nextType === 'just_listed') setCustomBadge('EN VENTA');
    if (nextType === 'open_house') setCustomBadge('CASA ABIERTA DOMINGO');
    if (nextType === 'reel_script') setCustomBadge('GUION DE VIDEO');
    if (nextType === 'market_report') setCustomBadge('DATOS DEL MERCADO');
  };

  const handleDownloadArtworkPng = async () => {
    setDownloadingPng(true);
    try {
      const width = 1080;
      const height = 1350;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2D context');

      ctx.fillStyle = '#121418';
      ctx.fillRect(0, 0, width, height);

      let houseImg: HTMLImageElement;
      try {
        houseImg = await loadImageSafe(propImg, true);
      } catch {
        houseImg = await loadImageSafe(FALLBACK_HOUSE_IMG, false);
      }

      const drawCover = (img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number) => {
        const ir = img.width / img.height;
        const tr = dw / dh;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (ir > tr) {
          sw = img.height * tr;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / tr;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      };

      drawCover(houseImg, 0, 0, width, 900);

      const grad = ctx.createLinearGradient(0, 480, 0, 1020);
      grad.addColorStop(0, 'rgba(18, 20, 24, 0)');
      grad.addColorStop(0.55, 'rgba(18, 20, 24, 0.85)');
      grad.addColorStop(1, '#121418');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 480, width, 540);

      ctx.fillStyle = '#660E1A';
      ctx.fillRect(54, 54, 410, 56);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('NEW ERA REAL ESTATE LLC', 78, 91);

      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(54, 725, 360, 46);
      ctx.fillStyle = '#121418';
      ctx.font = '900 22px sans-serif';
      ctx.fillText(customBadge.slice(0, 26), 74, 756);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 76px sans-serif';
      ctx.fillText(formatUsd(propPrice), 54, 855);

      ctx.fillStyle = '#F3EFE8';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(`${propAddress} - ${propCity}`, 54, 912);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '600 26px sans-serif';
      ctx.fillText(
        `${propBeds} Hab  -  ${propBaths} Baños  -  ${propSqft.toLocaleString('en-US')} SqFt`,
        54,
        960
      );

      ctx.fillStyle = '#660E1A';
      ctx.fillRect(0, 1025, width, 325);

      try {
        const agentImg = await loadImageSafe(activeAgent.photoUrl, false);
        ctx.save();
        ctx.beginPath();
        ctx.arc(155, 1188, 92, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        drawCover(agentImg, 63, 1096, 184, 184);
        ctx.restore();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(155, 1188, 92, 0, Math.PI * 2);
        ctx.stroke();
      } catch {
        // skip
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 40px sans-serif';
      ctx.fillText(activeAgent.name, 280, 1148);

      ctx.fillStyle = '#F3EFE8';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(
        `${activeAgent.title}${activeAgent.licenseNumber ? ` - Lic. #${activeAgent.licenseNumber}` : ''}`,
        280,
        1190
      );

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(activeAgent.phone, 280, 1240);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(`${activeAgent.corporateEmail} - www.neweraky.com`, 280, 1280);

      const qrSize = 156;
      const qrX = width - qrSize - 56;
      const qrY = 1108;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      const cellPx = qrSize / qrMatrix.size;
      ctx.fillStyle = '#121418';
      qrMatrix.cells.forEach((c) => {
        ctx.fillRect(qrX + c.x * cellPx, qrY + c.y * cellPx, Math.ceil(cellPx), Math.ceil(cellPx));
      });

      let dataUrl = '';
      try {
        dataUrl = canvas.toDataURL('image/png');
      } catch {
        const localHouse = await loadImageSafe(FALLBACK_HOUSE_IMG, false);
        drawCover(localHouse, 0, 0, width, 900);
        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.download = `NewEra_${activeAgent.id}_${templateType}.png`;
      link.href = dataUrl;
      link.click();
      onToast(`Imagen descargada para ${activeAgent.name}`);
    } catch {
      onToast('No se pudo descargar la imagen.');
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleScheduleSinglePost = () => {
    saveSocialPost({
      agentId: activeAgent.id,
      day: scheduleDay,
      format: templateType === 'reel_script' ? 'REEL' : templateType === 'open_house' ? 'FLYER' : 'POST',
      templateType,
      title: `${customBadge} - ${propAddress.split(',')[0]}`,
      caption: generatedCaption,
      reelScript: templateType === 'reel_script' ? generatedReelScript : undefined,
      propertyAddress: propAddress,
      propertyPrice: propPrice,
      imageUrl: propImg,
      platforms: ['IG', 'FB'],
      scheduledTime: '10:00 AM',
      autoPublish: autoPublishEnabled,
    });
    onToast(`Guardado en el día ${scheduleDay}`);
  };

  const handleGenerateFullMonth = () => {
    generateFullMonthSchedule(activeAgent.id, activeAgent.name, prioritizedProperties, lang);
    onToast(`Se llenaron los 30 días del mes para ${activeAgent.name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="arm-studio-top-grid">
        {/* Preview Card */}
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '20px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.25rem',
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <strong style={{ fontSize: '1.1rem', color: palette.text }}>Vista previa de la imagen</strong>

          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: `1.5px solid ${palette.stoneBorder}`,
              backgroundColor: '#121418',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
              position: 'relative',
            }}
          >
            <img
              src={propImg}
              alt={propAddress}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_HOUSE_IMG;
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: templateType === 'market_report' ? 0.25 : 0.72,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(18,20,24,0.35) 0%, rgba(18,20,24,0.65) 55%, rgba(102,14,26,0.96) 100%)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '7px',
                  backgroundColor: '#660E1A',
                  color: '#FFFFFF',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                }}
              >
                NEW ERA REAL ESTATE
              </span>
              <span
                style={{
                  padding: '0.32rem 0.7rem',
                  borderRadius: '7px',
                  backgroundColor: '#FAF7F2',
                  color: '#121418',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                }}
              >
                {customBadge}
              </span>
            </div>

            <div style={{ position: 'relative', zIndex: 1, padding: '1.1rem' }}>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, lineHeight: 1.05 }}>{formatUsd(propPrice)}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem' }}>{propAddress}</div>
              <div style={{ fontSize: '0.84rem', color: '#E2E8F0', marginTop: '0.2rem', marginBottom: '0.9rem' }}>
                {propCity} - {propBeds} hab - {propBaths} baños
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.28)',
                }}
              >
                <img
                  src={activeAgent.photoUrl}
                  alt={activeAgent.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #FFFFFF',
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 800 }}>{activeAgent.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#F3EFE8' }}>{activeAgent.phone}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={downloadingPng}
            onClick={handleDownloadArtworkPng}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              height: '54px',
              borderRadius: '12px',
              border: `2px solid ${palette.stoneBorder}`,
              backgroundColor: palette.bgPanel,
              color: palette.text,
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Download size={18} />
            <span>{downloadingPng ? 'Preparando...' : 'Descargar Imagen'}</span>
          </button>
        </div>

        {/* 3 Clear Steps */}
        <div
          style={{
            backgroundColor: palette.bgPanel,
            borderRadius: '20px',
            border: `1.5px solid ${palette.stoneBorder}`,
            padding: '1.35rem',
            boxShadow: palette.shadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1.12rem', fontWeight: 800, color: palette.text, marginBottom: '0.45rem' }}>
              Paso 1: Elige la casa
            </div>
            <select
              value={selectedProp?.id || ''}
              onChange={(e) => setSelectedPropId(e.target.value)}
              style={{
                width: '100%',
                height: '52px',
                padding: '0 0.9rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {prioritizedProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.location.address} - {formatUsd(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ fontSize: '1.12rem', fontWeight: 800, color: palette.text, marginBottom: '0.45rem' }}>
              Paso 2: Elige el tipo de imagen
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {(
                [
                  { id: 'just_listed', label: 'En Venta' },
                  { id: 'open_house', label: 'Casa Abierta' },
                  { id: 'reel_script', label: 'Guion Video' },
                  { id: 'market_report', label: 'Mercado' },
                ] as const
              ).map((t) => {
                const active = templateType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateSelect(t.id)}
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      border: active ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
                      backgroundColor: active ? palette.brand : palette.bgSubtle,
                      color: active ? palette.brandTextOnPrimary : palette.text,
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.12rem', fontWeight: 800, color: palette.text }}>
                Paso 3: Texto para publicar
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    templateType === 'reel_script' ? generatedReelScript : generatedCaption
                  );
                  onToast('Texto copiado');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  height: '38px',
                  padding: '0 0.8rem',
                  borderRadius: '8px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Copy size={14} />
                <span>Copiar texto</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={templateType === 'reel_script' ? generatedReelScript : captionText || generatedCaption}
              onChange={(e) => setCaptionText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '0.95rem',
                lineHeight: 1.5,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.6rem', alignItems: 'center' }}>
            <input
              type="number"
              min={1}
              max={30}
              value={scheduleDay}
              onChange={(e) => setScheduleDay(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
              aria-label="Día del mes"
              style={{
                height: '52px',
                padding: '0 0.8rem',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '1rem',
                fontWeight: 700,
                boxSizing: 'border-box',
              }}
            />

            <button
              type="button"
              onClick={handleScheduleSinglePost}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                height: '52px',
                borderRadius: '11px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgPanel,
                color: palette.text,
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <Calendar size={16} />
              <span>Guardar Día {scheduleDay}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateFullMonth}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                height: '52px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: palette.brand,
                color: palette.brandTextOnPrimary,
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <Wand2 size={16} />
              <span>Llenar 30 Días</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simple 30-Day Calendar */}
      <div
        style={{
          backgroundColor: palette.bgPanel,
          borderRadius: '20px',
          border: `1.5px solid ${palette.stoneBorder}`,
          padding: '1.35rem',
          boxShadow: palette.shadow,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
          <div>
            <strong style={{ fontSize: '1.2rem', color: palette.text }}>
              Calendario del Mes ({agentPosts.length} publicaciones)
            </strong>
          </div>

          <button
            type="button"
            onClick={() => {
              toggleAgentAutoPublish(activeAgent.id, !autoPublishEnabled);
              onToast(!autoPublishEnabled ? 'Publicación automática activada' : 'Publicación automática pausada');
            }}
            style={{
              height: '46px',
              padding: '0 1.1rem',
              borderRadius: '10px',
              border: autoPublishEnabled ? `2px solid ${palette.brand}` : `1px solid ${palette.stoneBorder}`,
              backgroundColor: autoPublishEnabled ? palette.brand : palette.bgSubtle,
              color: autoPublishEnabled ? palette.brandTextOnPrimary : palette.text,
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {autoPublishEnabled ? 'Auto-publicación: Activada' : 'Auto-publicación: Pausada'}
          </button>
        </div>

        <div className="arm-calendar-grid">
          {Array.from({ length: 30 }, (_, idx) => idx + 1).map((day) => {
            const post = agentPosts.find((p) => p.day === day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  if (post) {
                    setSelectedDayPost(post);
                  } else {
                    setScheduleDay(day);
                    onToast(`Día ${day} seleccionado`);
                  }
                }}
                style={{
                  padding: '0.65rem',
                  borderRadius: '12px',
                  border: post ? `1.5px solid ${palette.brandBorder}` : `1px dashed ${palette.stoneBorder}`,
                  backgroundColor: post ? palette.bgSubtle : palette.bgApp,
                  textAlign: 'left',
                  cursor: 'pointer',
                  minHeight: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: palette.text }}>Día {day}</span>
                  {post && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.42rem',
                        borderRadius: '5px',
                        backgroundColor: palette.bgPanel,
                        color: palette.brand,
                        border: `1px solid ${palette.stoneBorder}`,
                      }}
                    >
                      {post.format}
                    </span>
                  )}
                </div>

                {post ? (
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: palette.textSecondary, lineHeight: 1.25 }}>
                    {post.title}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: palette.textMuted }}>Vacío</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDayPost && (
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
          onClick={() => setSelectedDayPost(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
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
              <strong style={{ fontSize: '1.15rem', color: palette.text }}>
                Día {selectedDayPost.day} - {selectedDayPost.format}
              </strong>
              <button type="button" onClick={() => setSelectedDayPost(null)} style={{ background: 'none', border: 'none', color: palette.text, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: palette.brand }}>{selectedDayPost.title}</div>
            <div style={{ padding: '0.9rem', borderRadius: '12px', backgroundColor: palette.bgSubtle, fontSize: '0.94rem', color: palette.text, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {selectedDayPost.caption}
            </div>
            {selectedDayPost.reelScript && (
              <div style={{ padding: '0.9rem', borderRadius: '12px', backgroundColor: palette.bgSubtle, border: `1px solid ${palette.stoneBorder}`, fontSize: '0.9rem', color: palette.text, lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  <Film size={15} />
                  <span>Guion de Video</span>
                </div>
                {selectedDayPost.reelScript}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  deleteSocialPost(selectedDayPost.id);
                  setSelectedDayPost(null);
                  onToast('Publicación quitada');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  height: '44px',
                  padding: '0 1rem',
                  borderRadius: '10px',
                  border: `1px solid ${palette.stoneBorder}`,
                  backgroundColor: palette.bgSubtle,
                  color: palette.text,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={15} />
                <span>Quitar del día</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .arm-studio-top-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        .arm-calendar-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.6rem;
        }
        @media (max-width: 1080px) {
          .arm-studio-top-grid {
            grid-template-columns: 1fr;
          }
          .arm-calendar-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        @media (max-width: 720px) {
          .arm-calendar-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
