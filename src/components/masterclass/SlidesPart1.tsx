import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  TrendingUp,
  Volume2,
  Truck,
  Moon,
  Home,
  VideoOff,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  Heart,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { MC_COLORS, MC_FONTS, MC_SPRINGS } from './masterclassTokens';

interface SlideProps {
  subStep: number;
}

/* ==========================================================================
   SLIDE 1: EL GANCHO DE APERTURA (3 SubSteps) — EXECUTIVE EDITORIAL
   ========================================================================== */
export const Slide1Hook: React.FC<SlideProps> = ({ subStep }) => {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (subStep < 2) {
      setViewCount(0);
      return;
    }
    let startTime: number | null = null;
    const duration = 1100;
    const target = 50000;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setViewCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setViewCount(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [subStep]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '58% 42%',
        position: 'relative',
        padding: '64px 88px 84px 88px',
        boxSizing: 'border-box',
      }}
    >
      {/* LEFT 58%: ARCHITECTURAL HEADLINE */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: '64px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            alignSelf: 'flex-start',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: MC_COLORS.goldAccent,
            }}
          />
          <span
            style={{
              fontFamily: MC_FONTS.mono,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: MC_COLORS.metallicGray,
              textTransform: 'uppercase',
            }}
          >
             CÁTEDRA DE MARKETING INMOBILIARIO // LOUISVILLE, KY
          </span>
        </motion.div>

        {/* Clean, High-Authority Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { text: '¿ERES REALTOR', tone: 'white' },
            { text: 'O ERES', tone: 'muted' },
            { text: 'INFLUENCER?', tone: 'accent' },
          ].map((line, idx) => (
            <div key={idx} style={{ overflow: 'hidden' }}>
              <motion.h1
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  ...MC_SPRINGS.snappyReveal,
                  delay: idx * 0.1,
                }}
                style={{
                  margin: 0,
                  fontFamily: MC_FONTS.display,
                  fontSize: '86px',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.035em',
                  color:
                    line.tone === 'white'
                      ? MC_COLORS.white
                      : line.tone === 'muted'
                      ? '#52525B'
                      : MC_COLORS.offWhite,
                }}
              >
                {line.text}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Hairline Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            width: '120px',
            height: '2px',
            backgroundColor: MC_COLORS.goldAccent,
            transformOrigin: 'left center',
            marginTop: '38px',
            marginBottom: '28px',
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          style={{
            margin: 0,
            fontFamily: MC_FONTS.sans,
            fontSize: '30px',
            fontWeight: 400,
            lineHeight: 1.4,
            color: MC_COLORS.metallicGray,
            maxWidth: '820px',
            letterSpacing: '-0.01em',
          }}
        >
          “¿Quieres vistas para tu{' '}
          <span style={{ color: MC_COLORS.white, fontWeight: 600 }}>ego</span> o
          quieres ventas para tu{' '}
          <span style={{ color: MC_COLORS.white, fontWeight: 600 }}>banco</span>?”
        </motion.p>
      </div>

      {/* SUBTLE VERTICAL ARCHITECTURAL DIVIDER */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          left: '58%',
          top: '64px',
          bottom: '84px',
          width: '1px',
          transformOrigin: 'top center',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.16) 20%, rgba(255,255,255,0.16) 80%, transparent 100%)',
        }}
      />

      {/* RIGHT 42%: ANALYTICS CARDS */}
      <div
        style={{
          paddingLeft: '56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {subStep === 1 && (
          <div
            style={{
              height: '380px',
              borderRadius: '12px',
              border: `1px solid ${MC_COLORS.borderSubtle}`,
              backgroundColor: MC_COLORS.surfaceSubtle,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                letterSpacing: '0.18em',
                color: MC_COLORS.mutedGray,
              }}
            >
              PASO 02 // ANÁLISIS DE RETORNO
            </span>
            <span
              style={{
                fontFamily: MC_FONTS.sans,
                fontSize: '18px',
                color: MC_COLORS.metallicGray,
                fontWeight: 500,
              }}
            >
              Presiona Espacio para auditar métricas
            </span>
          </div>
        )}

        {/* SUBSTEP 2: LA ILUSIÓN DEL INFLUENCER */}
        <AnimatePresence>
          {subStep >= 2 && (
            <motion.div
              key="substep-2-influencer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                borderLeft: `4px solid ${MC_COLORS.redEgo}`,
                padding: '28px 32px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: MC_COLORS.redText,
                    textTransform: 'uppercase',
                  }}
                >
                   ESCENARIO A // LA ILUSIÓN DEL INFLUENCER
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: MC_COLORS.mutedGray,
                    fontFamily: MC_FONTS.mono,
                    fontSize: '12px',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={14} color={MC_COLORS.redText} /> 1.4k
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={14} /> 3.2k
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '14px',
                  marginBottom: '18px',
                }}
              >
                <span
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '54px',
                    fontWeight: 700,
                    color: MC_COLORS.white,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {viewCount.toLocaleString('en-US')}
                </span>
                <span
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: MC_COLORS.metallicGray,
                    letterSpacing: '0.08em',
                  }}
                >
                  VISTAS VIRALES
                </span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${MC_COLORS.borderSubtle}`,
                  fontFamily: MC_FONTS.mono,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: MC_COLORS.metallicGray,
                }}
              >
                <Clock size={15} color={MC_COLORS.redText} />
                TIEMPO INVERTIDO: 14 HORAS / SEMANA
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUBSTEP 3: EL GOLPE DE REALIDAD */}
        <AnimatePresence>
          {subStep >= 3 && (
            <motion.div
              key="substep-3-reality"
              initial={{ opacity: 0, scale: 1.06, y: 16 }}
              animate={{ opacity: 1, scale: 1.0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={MC_SPRINGS.impactSlam}
              style={{
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surfaceElevated,
                border: `1px solid ${MC_COLORS.greenBorder}`,
                borderLeft: `4px solid ${MC_COLORS.greenMoney}`,
                padding: '28px 32px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                style={{
                  fontFamily: MC_FONTS.mono,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: MC_COLORS.greenText,
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                }}
              >
                ESCENARIO B // 1 CIERRE EN LOUISVILLE
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Row 1 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                    borderBottom: `1px solid ${MC_COLORS.borderSubtle}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MC_FONTS.sans,
                      fontSize: '17px',
                      color: MC_COLORS.metallicGray,
                      fontWeight: 500,
                    }}
                  >
                    50,000 Vistas Virales
                  </span>
                  <span
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '28px',
                      fontWeight: 700,
                      color: MC_COLORS.redText,
                    }}
                  >
                    $0.00{' '}
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: MC_COLORS.mutedGray,
                      }}
                    >
                      en el banco
                    </span>
                  </span>
                </div>

                {/* Row 2 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingTop: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: MC_FONTS.sans,
                      fontSize: '18px',
                      color: MC_COLORS.white,
                      fontWeight: 600,
                    }}
                  >
                    200 Vistas Locales Correctas
                  </span>
                  <span
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '34px',
                      fontWeight: 700,
                      color: MC_COLORS.greenText,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    $9,500+{' '}
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: MC_COLORS.metallicGray,
                      }}
                    >
                      comisión
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ==========================================================================
   SLIDE 2: EL CEMENTERIO DEL "SIGUE ASÍ, MIMA" (3 SubSteps) — EXECUTIVE AUDIT
   ========================================================================== */
export const Slide2Cemetery: React.FC<SlideProps> = ({ subStep }) => {
  const comments = [
    {
      id: '01',
      user: 'Familiar fuera del estado',
      text: '“¡Qué bella mima, Dios te bendiga siempre!”',
      origin: 'Tía en Miami — A 1,000 millas de Kentucky',
      commission: '$0.00',
    },
    {
      id: '02',
      user: 'Colega del sector',
      text: '“¡¡Duro mi hermano, rompiendo!!”',
      origin: 'Otro Realtor de tu misma oficina',
      commission: '$0.00',
    },
    {
      id: '03',
      user: 'Interacción pasiva',
      text: '“Excelente video crack, sigue así”',
      origin: 'Cuenta Bot / Amigo que no califica',
      commission: '$0.00',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '52px 88px 80px 88px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${MC_COLORS.borderDefault}`,
          paddingBottom: '20px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MC_FONTS.mono,
              fontSize: '12px',
              color: MC_COLORS.metallicGray,
              fontWeight: 600,
              letterSpacing: '0.18em',
              marginBottom: '8px',
            }}
          >
            AUDITORÍA DE AUDIENCIA // EL CEMENTERIO DEL “SIGUE ASÍ, MIMA”
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: MC_FONTS.display,
              fontSize: '46px',
              fontWeight: 800,
              color: MC_COLORS.white,
              letterSpacing: '-0.03em',
            }}
          >
            El Club de Fans que No Compra Casas
          </h1>
        </div>

        <div
          style={{
            fontFamily: MC_FONTS.mono,
            fontSize: '13px',
            color: MC_COLORS.mutedGray,
            letterSpacing: '0.08em',
          }}
        >
          ANÁLISIS DE CONVERSIÓN COMERCIAL
        </div>
      </div>

      {/* MAIN SPLIT: 40% MINIMAL DEVICE FRAME / 60% AUDIT TABLE */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '38% 62%',
          gap: '48px',
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {/* LEFT: ARCHITECTURAL PHONE WIREFRAME */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '340px',
              height: '620px',
              borderRadius: '36px',
              border: `2px solid ${MC_COLORS.borderBright}`,
              backgroundColor: MC_COLORS.surface,
              padding: '22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${MC_COLORS.borderSubtle}`,
                paddingBottom: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: MC_FONTS.mono,
                  fontSize: '11px',
                  color: MC_COLORS.metallicGray,
                  letterSpacing: '0.1em',
                }}
              >
                REEL // 0.5x SLOW-MOTION
              </span>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: MC_COLORS.redEgo,
                }}
              />
            </div>

            {/* Realistic Generated Video Frame inside Smartphone */}
            <div
              style={{
                flex: 1,
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                margin: '12px 0',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
              }}
            >
              <img
                src="/assets/masterclass/reel-influencer-slowmo.jpg"
                alt="Realtor en cámara lenta señalando cartelitos en el aire"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />

              {/* Subtle Floating Air-Pointing Captions over the Realtor's finger */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '16px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(9, 9, 11, 0.82)',
                  backdropFilter: 'blur(6px)',
                  border: `1px solid ${MC_COLORS.borderBright}`,
                  fontFamily: MC_FONTS.mono,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: MC_COLORS.white,
                }}
              >
                ☝️ “3 TIPS MILLONARIOS”
              </motion.div>

              {/* Bottom Gradient Caption Overlay */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '28px 14px 12px 14px',
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(9,9,11,0.92) 70%)',
                  fontFamily: MC_FONTS.sans,
                  fontSize: '12.5px',
                  color: MC_COLORS.offWhite,
                  lineHeight: 1.35,
                  textAlign: 'center',
                }}
              >
                “Bajándose del carro en cámara lenta con música épica y
                señalando cartelitos en el aire”
              </div>
            </div>

            {/* Audio Footer */}
            <div
              style={{
                paddingTop: '14px',
                borderTop: `1px solid ${MC_COLORS.borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: MC_FONTS.mono,
                fontSize: '11px',
                color: MC_COLORS.mutedGray,
              }}
            >
              <Volume2 size={14} /> Audio: Tendencia Viral Sin Contexto Local
            </div>
          </div>
        </div>

        {/* RIGHT: AUTOPSIA FINANCIERA DE COMENTARIOS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: `1px solid ${MC_COLORS.borderSubtle}`,
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.12em',
              }}
            >
              <span>COMENTARIO RECIBIDO</span>
              <span>ORIGEN REAL / RETORNO</span>
            </div>

            {subStep === 1 ? (
              <div
                style={{
                  height: '360px',
                  borderRadius: '12px',
                  border: `1px solid ${MC_COLORS.borderSubtle}`,
                  backgroundColor: MC_COLORS.surfaceSubtle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: MC_FONTS.mono,
                  fontSize: '13px',
                  color: MC_COLORS.mutedGray,
                  letterSpacing: '0.14em',
                }}
              >
                [ PRESIONA ESPACIO PARA DESGLOSAR COMENTARIOS ]
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {comments.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...MC_SPRINGS.snappyReveal,
                      delay: idx * 0.14,
                    }}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: MC_COLORS.surface,
                      border: `1px solid ${MC_COLORS.borderDefault}`,
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span
                        style={{
                          fontFamily: MC_FONTS.mono,
                          fontSize: '13px',
                          fontWeight: 600,
                          color: MC_COLORS.mutedGray,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${MC_COLORS.borderSubtle}`,
                        }}
                      >
                        {c.id}
                      </span>
                      <div>
                        <div
                          style={{
                            fontFamily: MC_FONTS.sans,
                            fontSize: '20px',
                            fontWeight: 600,
                            color: MC_COLORS.white,
                            marginBottom: '4px',
                          }}
                        >
                          {c.text}
                        </div>
                        <div
                          style={{
                            fontFamily: MC_FONTS.mono,
                            fontSize: '13px',
                            color: MC_COLORS.redText,
                          }}
                        >
                          [{c.origin}]
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: 'right',
                        flexShrink: 0,
                        fontFamily: MC_FONTS.mono,
                        fontSize: '20px',
                        fontWeight: 700,
                        color: MC_COLORS.mutedGray,
                      }}
                    >
                      {c.commission}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* SUBSTEP 3: VEREDICTO CONTABLE EJECUTIVO */}
          <AnimatePresence>
            {subStep >= 3 && (
              <motion.div
                key="executive-verdict"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={MC_SPRINGS.impactSlam}
                style={{
                  borderRadius: '12px',
                  backgroundColor: MC_COLORS.surfaceElevated,
                  border: `1px solid ${MC_COLORS.redBorder}`,
                  borderLeft: `4px solid ${MC_COLORS.redEgo}`,
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${MC_COLORS.borderSubtle}`,
                    paddingBottom: '14px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '11px',
                        color: MC_COLORS.redText,
                        letterSpacing: '0.16em',
                        marginBottom: '4px',
                      }}
                    >
                      RESULTADO COMERCIAL
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.display,
                        fontSize: '22px',
                        fontWeight: 700,
                        color: MC_COLORS.white,
                      }}
                    >
                      Clientes reales preguntando cómo comprar:{' '}
                      <span
                        style={{
                          fontFamily: MC_FONTS.mono,
                          color: MC_COLORS.redText,
                        }}
                      >
                        0
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '11px',
                        color: MC_COLORS.mutedGray,
                        letterSpacing: '0.14em',
                        marginBottom: '4px',
                      }}
                    >
                      COMISIÓN GENERADA
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '34px',
                        fontWeight: 700,
                        color: MC_COLORS.redText,
                        lineHeight: 1,
                      }}
                    >
                      $0.00
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: MC_FONTS.sans,
                    fontSize: '17px',
                    color: MC_COLORS.metallicGray,
                    fontWeight: 500,
                  }}
                >
                  “Los fueguitos de tus compañeros de oficina no pagan el
                  mortgage ni la gasolina.”
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   SLIDE 3: EL PROBLEMA DEL VIDEO "WOW" VACÍO (2 SubSteps) — EXECUTIVE BENTO
   ========================================================================== */
export const Slide3WowEmpty: React.FC<SlideProps> = ({ subStep }) => {
  const coldItems = [
    'Tomas de dron en 4K con música de película de acción.',
    'Zoom lento al mármol de la cocina vacía sin que nadie hable.',
    'Presumir “5 habitaciones / 3 baños” como si fuera un catálogo frío.',
  ];

  const warmItems = [
    {
      icon: <Truck size={22} color={MC_COLORS.goldAccent} />,
      num: '01',
      title: 'Paz en el Parqueo',
      desc: 'Tener dónde meter la camioneta de trabajo con escaleras y herramientas sin que la grúa del apartamento se la lleve a las 2 AM.',
    },
    {
      icon: <Moon size={22} color={MC_COLORS.goldAccent} />,
      num: '02',
      title: 'Silencio y Respeto',
      desc: 'Que nadie les zapatee el techo arriba después de trabajar 12 horas en construcción o en planta.',
    },
    {
      icon: <Home size={22} color={MC_COLORS.goldAccent} />,
      num: '03',
      title: 'Orgullo Familiar',
      desc: 'Un patio propio para hacer carne asada el domingo y que sus hijos tengan su propio cuarto.',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 88px 80px 88px',
        boxSizing: 'border-box',
      }}
    >
      {/* DUAL BENTO COMPARISON */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '46% 54%',
          gap: '36px',
          alignItems: 'stretch',
        }}
      >
        {/* LEFT CARD: HOLLYWOOD VACÍO */}
        <div
          style={{
            borderRadius: '14px',
            backgroundColor: MC_COLORS.surface,
            border: `1px solid ${MC_COLORS.borderDefault}`,
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                fontWeight: 600,
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.16em',
                marginBottom: '12px',
              }}
            >
              ENFOQUE INCORRECTO // CATÁLOGO FRÍO
            </div>

            <h2
              style={{
                margin: '0 0 28px 0',
                fontFamily: MC_FONTS.display,
                fontSize: '34px',
                fontWeight: 800,
                color: MC_COLORS.white,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}
            >
              El Video “Wow” de Hollywood{' '}
              <span style={{ color: MC_COLORS.mutedGray, fontWeight: 500 }}>
                (Vacío)
              </span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {coldItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    padding: '20px 22px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${MC_COLORS.borderSubtle}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MC_FONTS.sans,
                      fontSize: '19px',
                      fontWeight: 400,
                      color: MC_COLORS.mutedGray,
                      lineHeight: 1.4,
                      textDecoration: 'line-through',
                      textDecorationColor: MC_COLORS.redEgo,
                      textDecorationThickness: '2px',
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: '24px',
              padding: '20px 24px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              borderLeft: `3px solid ${MC_COLORS.redEgo}`,
            }}
          >
            <div
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '11px',
                fontWeight: 600,
                color: MC_COLORS.redText,
                letterSpacing: '0.14em',
                marginBottom: '6px',
              }}
            >
              DIAGNÓSTICO
            </div>
            <div
              style={{
                fontFamily: MC_FONTS.sans,
                fontSize: '18px',
                fontWeight: 500,
                color: MC_COLORS.offWhite,
                lineHeight: 1.4,
              }}
            >
              “La gente dice ‘qué bonita casa’ y sigue haciendo scroll.”
            </div>
          </div>
        </div>

        {/* RIGHT CARD: LO QUE EN VERDAD COMPRA UNA FAMILIA */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {subStep === 1 ? (
            <div
              style={{
                flex: 1,
                borderRadius: '14px',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                backgroundColor: MC_COLORS.surfaceSubtle,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: MC_FONTS.mono,
                  fontSize: '12px',
                  color: MC_COLORS.mutedGray,
                  letterSpacing: '0.16em',
                }}
              >
                PASO 02 // PSICOLOGÍA REAL DE COMPRA
              </span>
              <span
                style={{
                  fontFamily: MC_FONTS.sans,
                  fontSize: '20px',
                  fontWeight: 500,
                  color: MC_COLORS.metallicGray,
                }}
              >
                ¿Qué compra verdaderamente una familia en Louisville?
              </span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                flex: 1,
                borderRadius: '14px',
                backgroundColor: MC_COLORS.surfaceElevated,
                border: `1px solid ${MC_COLORS.borderBright}`,
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: MC_COLORS.goldAccent,
                    letterSpacing: '0.16em',
                    marginBottom: '12px',
                  }}
                >
                  ENFOQUE DE CONVERSIÓN // VALOR HUMANO Y PATRIMONIAL
                </div>

                <h2
                  style={{
                    margin: '0 0 24px 0',
                    fontFamily: MC_FONTS.display,
                    fontSize: '34px',
                    fontWeight: 800,
                    color: MC_COLORS.white,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                  }}
                >
                  Lo que en Verdad Compra una Familia
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {warmItems.map((block, idx) => (
                    <motion.div
                      key={block.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '18px',
                        padding: '18px 22px',
                        borderRadius: '10px',
                        backgroundColor: MC_COLORS.surface,
                        border: `1px solid ${MC_COLORS.borderDefault}`,
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${MC_COLORS.borderSubtle}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {block.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: MC_FONTS.mono,
                              fontSize: '12px',
                              color: MC_COLORS.goldAccent,
                              fontWeight: 600,
                            }}
                          >
                            {block.num}
                          </span>
                          <span
                            style={{
                              fontFamily: MC_FONTS.display,
                              fontSize: '20px',
                              fontWeight: 700,
                              color: MC_COLORS.white,
                            }}
                          >
                            {block.title}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: MC_FONTS.sans,
                            fontSize: '16px',
                            color: MC_COLORS.metallicGray,
                            lineHeight: 1.45,
                          }}
                        >
                          {block.desc}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* BOTTOM PUNCHLINE BAR */}
      <AnimatePresence>
        {subStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              marginTop: '24px',
              padding: '20px 32px',
              borderRadius: '10px',
              backgroundColor: MC_COLORS.surface,
              border: `1px solid ${MC_COLORS.borderBright}`,
              borderLeft: `4px solid ${MC_COLORS.greenMoney}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: MC_FONTS.display,
                fontSize: '24px',
                fontWeight: 700,
                color: MC_COLORS.white,
                letterSpacing: '-0.01em',
              }}
            >
              Deja de vender ladrillos.{' '}
              <span style={{ color: MC_COLORS.greenText }}>
                Vende estabilidad y familia.
              </span>
            </span>
            <span
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.14em',
              }}
            >
              PRINCIPIO DE NARRATIVA COMERCIAL
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
