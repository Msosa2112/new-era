import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  FolderOpen,
  Eye,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { MC_COLORS, MC_FONTS, MC_SPRINGS } from './masterclassTokens';

interface SlideProps {
  subStep: number;
}

/* ==========================================================================
   SLIDE 4: LA PSICOLOGÍA DEL MIEDO Y LOS 2 SEGUNDOS (2 SubSteps)
   ========================================================================== */
export const Slide4Psychology: React.FC<SlideProps> = ({ subStep }) => {
  const pills = [
    'Ahorros de 5 años en juego',
    'Miedo a contratos en inglés que no entienden',
    'Terror a perder su depósito por un mal asesor',
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 96px 84px 96px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* SUBSTEP 1: MONUMENTAL EDITORIAL QUOTE */}
      <motion.div
        layout
        transition={MC_SPRINGS.snappyReveal}
        style={{
          width: '82%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: subStep >= 2 ? '36px' : '0px',
        }}
      >
        <div
          style={{
            fontFamily: MC_FONTS.mono,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: MC_COLORS.goldAccent,
            marginBottom: '24px',
            textTransform: 'uppercase',
          }}
        >
          PSICOLOGÍA DEL COMPRADOR // AUDITORÍA DE CONFIANZA
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MC_SPRINGS.snappyReveal}
          style={{
            margin: 0,
            fontFamily: MC_FONTS.display,
            fontSize: subStep >= 2 ? '46px' : '62px',
            fontWeight: 800,
            lineHeight: 1.16,
            letterSpacing: '-0.03em',
            color: MC_COLORS.white,
            transition: 'font-size 0.35s ease',
          }}
        >
          “Comprar una casa es la decisión financiera que más{' '}
          <span
            style={{
              color: MC_COLORS.redText,
              borderBottom: `3px solid ${MC_COLORS.redEgo}`,
              paddingBottom: '2px',
            }}
          >
            miedo
          </span>{' '}
          da en la vida de un inmigrante.”
        </motion.h1>

        {/* 3 Context Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginTop: subStep >= 2 ? '26px' : '42px',
          }}
        >
          {pills.map((pill, idx) => (
            <motion.div
              key={pill}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.12, duration: 0.4 }}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                fontFamily: MC_FONTS.sans,
                fontSize: '18px',
                fontWeight: 500,
                color: MC_COLORS.offWhite,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: MC_COLORS.goldAccent,
                }}
              />
              {pill}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* SUBSTEP 2: EL TERMÓMETRO DE LA AUDITORÍA VISUAL */}
      <AnimatePresence>
        {subStep >= 2 && (
          <motion.div
            key="visual-audit-thermometer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              width: '92%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* 2.0 SECONDS TIMELINE BAR */}
            <div
              style={{
                padding: '20px 28px',
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: MC_FONTS.mono,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: MC_COLORS.metallicGray,
                    letterSpacing: '0.14em',
                  }}
                >
                  <Eye size={16} color={MC_COLORS.goldAccent} /> EL TERMÓMETRO
                  DE LA AUDITORÍA VISUAL
                </div>
                <div
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: MC_COLORS.white,
                    letterSpacing: '0.04em',
                  }}
                >
                  2.0 SEGUNDOS
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    backgroundColor: MC_COLORS.goldAccent,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: MC_FONTS.mono,
                  fontSize: '12px',
                  color: MC_COLORS.mutedGray,
                }}
              >
                <span>0.0s — Primer contacto con tu perfil o cartel</span>
                <span>1.0s — Evaluación subconsciente de orden y marca</span>
                <span>2.0s — Decisión: Confianza o Descarte</span>
              </div>
            </div>

            {/* COMPARISON CARDS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '28px',
              }}
            >
              <div
                style={{
                  borderRadius: '12px',
                  backgroundColor: MC_COLORS.surface,
                  border: `1px solid ${MC_COLORS.borderDefault}`,
                  borderLeft: `4px solid ${MC_COLORS.redEgo}`,
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: MC_FONTS.mono,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: MC_COLORS.redText,
                    letterSpacing: '0.14em',
                  }}
                >
                  <ShieldAlert size={16} /> IMAGEN DESCUIDADA / IMPROVISADA
                </div>
                <div
                  style={{
                    fontFamily: MC_FONTS.sans,
                    fontSize: '23px',
                    fontWeight: 600,
                    color: MC_COLORS.white,
                    lineHeight: 1.38,
                  }}
                >
                  “Si no cuida ni el logo de su empresa,{' '}
                  <span style={{ color: MC_COLORS.redText }}>
                    va a hacer un desastre con mis $280,000.
                  </span>
                  ”
                </div>
              </div>

              <div
                style={{
                  borderRadius: '12px',
                  backgroundColor: MC_COLORS.surfaceElevated,
                  border: `1px solid ${MC_COLORS.borderBright}`,
                  borderLeft: `4px solid ${MC_COLORS.greenMoney}`,
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: MC_FONTS.mono,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: MC_COLORS.greenText,
                    letterSpacing: '0.14em',
                  }}
                >
                  <ShieldCheck size={16} /> IMAGEN LIMPIA / CORPORATIVA
                </div>
                <div
                  style={{
                    fontFamily: MC_FONTS.sans,
                    fontSize: '23px',
                    fontWeight: 600,
                    color: MC_COLORS.white,
                    lineHeight: 1.38,
                  }}
                >
                  “Esta persona tiene un{' '}
                  <span style={{ color: MC_COLORS.greenText }}>
                    sistema serio detrás.
                  </span>{' '}
                  Aquí mi familia está segura.”
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================================
   SLIDE 5: EL MUSEO DEL TERROR VISUAL (4 SubSteps) — WITH REAL GENERATED IMAGES
   ========================================================================== */
export const Slide5HorrorMuseum: React.FC<SlideProps> = ({ subStep }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '44px 88px 78px 88px',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '22px',
          borderBottom: `1px solid ${MC_COLORS.borderDefault}`,
          paddingBottom: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MC_FONTS.mono,
              fontSize: '12px',
              fontWeight: 600,
              color: MC_COLORS.metallicGray,
              letterSpacing: '0.18em',
              marginBottom: '6px',
            }}
          >
            AUDITORÍA DE IDENTIDAD VISUAL // LOS 3 CRÍMENES CAPITALES
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: MC_FONTS.display,
              fontSize: '42px',
              fontWeight: 800,
              color: MC_COLORS.white,
              letterSpacing: '-0.03em',
            }}
          >
            El Museo del Terror Visual
          </h1>
        </div>
        <div
          style={{
            fontFamily: MC_FONTS.mono,
            fontSize: '12px',
            color: MC_COLORS.mutedGray,
            letterSpacing: '0.12em',
          }}
        >
          EVIDENCIA GRÁFICA DE ERRORES COMUNES
        </div>
      </div>

      {/* 3-COLUMN CLINICAL GRID WITH REAL GENERATED IMAGES */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '28px',
          alignItems: 'stretch',
        }}
      >
        {/* COLUMNA 1: EL CRIMEN DE CHATGPT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MC_SPRINGS.snappyReveal}
          style={{
            borderRadius: '12px',
            backgroundColor: MC_COLORS.surface,
            border: `1px solid ${MC_COLORS.borderDefault}`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
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
              CASO 01 // ALUCINACIÓN GENERATIVA
            </div>
            <h3
              style={{
                margin: '0 0 14px 0',
                fontFamily: MC_FONTS.display,
                fontSize: '20px',
                fontWeight: 700,
                color: MC_COLORS.white,
                lineHeight: 1.25,
              }}
            >
              1. Usar ChatGPT al Berro como Diseñador
            </h3>

            {/* Real Generated Image of AI Hallucinated Flyer */}
            <div
              style={{
                height: '295px',
                borderRadius: '8px',
                backgroundColor: '#09090B',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src="/assets/masterclass/crime-chatgpt-flyer.jpg"
                alt="Flyer deformado generado con ChatGPT con mano de 6 dedos y texto alienígena"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(9, 9, 11, 0.88)',
                  backdropFilter: 'blur(6px)',
                  border: `1px solid ${MC_COLORS.redBorder}`,
                  fontFamily: MC_FONTS.mono,
                  fontSize: '10.5px',
                  color: MC_COLORS.redText,
                  textAlign: 'center',
                }}
              >
                “HOUSSES FOR SAL3 IN LOUIVILE” • Mano de 6 dedos • Logo derretido
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '14px',
              padding: '14px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.025)',
              borderLeft: `3px solid ${MC_COLORS.redEgo}`,
              fontFamily: MC_FONTS.sans,
              fontSize: '14.5px',
              color: MC_COLORS.offWhite,
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: MC_COLORS.white }}>Regla:</strong> ChatGPT es
            un cerebro para textos e ideas. NO es diseñador gráfico. Prohibido
            meterle el logo.
          </div>
        </motion.div>

        {/* COLUMNA 2: EL FANTASMA MOCHO */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {subStep < 2 ? (
            <div
              style={{
                flex: 1,
                borderRadius: '12px',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                backgroundColor: MC_COLORS.surfaceSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.14em',
              }}
            >
              [ ESPACIO // CASO 02 ]
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                flex: 1,
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
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
                  CASO 02 // EL FANTASMA MOCHO
                </div>
                <h3
                  style={{
                    margin: '0 0 14px 0',
                    fontFamily: MC_FONTS.display,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: MC_COLORS.white,
                    lineHeight: 1.25,
                  }}
                >
                  2. El Síndrome del Cuerpo Flotante
                </h3>

                {/* Real Generated Image of Floating Amputated Realtor Torso */}
                <div
                  style={{
                    height: '295px',
                    borderRadius: '8px',
                    backgroundColor: '#09090B',
                    border: `1px solid ${MC_COLORS.borderSubtle}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/assets/masterclass/crime-floating-torso.jpg"
                    alt="Realtor cortado a la cintura flotando en el cielo sobre una casa"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(9, 9, 11, 0.88)',
                      backdropFilter: 'blur(6px)',
                      border: `1px solid ${MC_COLORS.redBorder}`,
                      fontFamily: MC_FONTS.mono,
                      fontSize: '10.5px',
                      color: MC_COLORS.redText,
                      textAlign: 'center',
                    }}
                  >
                    Torso cortado en la cintura flotando en el aire • Halo blanco
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  borderLeft: `3px solid ${MC_COLORS.redEgo}`,
                  fontFamily: MC_FONTS.sans,
                  fontSize: '14.5px',
                  color: MC_COLORS.offWhite,
                  lineHeight: 1.4,
                }}
              >
                <strong style={{ color: MC_COLORS.white }}>Regla:</strong> Si no
                tienes piernas en la foto, no puedes flotar en medio del flyer.
              </div>
            </motion.div>
          )}
        </div>

        {/* COLUMNA 3: ESQUIZOFRENIA DE MARCA */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {subStep < 3 ? (
            <div
              style={{
                flex: 1,
                borderRadius: '12px',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                backgroundColor: MC_COLORS.surfaceSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.14em',
              }}
            >
              [ ESPACIO // CASO 03 ]
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                flex: 1,
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
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
                  CASO 03 // LAS 20 AGENCIAS ENEMIGAS
                </div>
                <h3
                  style={{
                    margin: '0 0 14px 0',
                    fontFamily: MC_FONTS.display,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: MC_COLORS.white,
                    lineHeight: 1.25,
                  }}
                >
                  3. Esquizofrenia de Marca
                </h3>

                {/* Real Generated Image of 3 Mismatched Yard Signs & Car Magnets */}
                <div
                  style={{
                    height: '295px',
                    borderRadius: '8px',
                    backgroundColor: '#09090B',
                    border: `1px solid ${MC_COLORS.borderSubtle}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/assets/masterclass/crime-brand-schizo.jpg"
                    alt="3 Yard Signs y 3 imanes de carro completamente distintos"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(9, 9, 11, 0.88)',
                      backdropFilter: 'blur(6px)',
                      border: `1px solid ${MC_COLORS.redBorder}`,
                      fontFamily: MC_FONTS.mono,
                      fontSize: '10.5px',
                      color: MC_COLORS.redText,
                      textAlign: 'center',
                    }}
                  >
                    Dorado barroco vs. Azul chillón vs. Logo estirado como chicle
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  borderLeft: `3px solid ${MC_COLORS.redEgo}`,
                  fontFamily: MC_FONTS.sans,
                  fontSize: '14.5px',
                  color: MC_COLORS.offWhite,
                  lineHeight: 1.4,
                }}
              >
                <strong style={{ color: MC_COLORS.white }}>Regla:</strong> Si
                ponemos los 10 carros en el parqueo, parece que trabajan en 10
                chiringuitos rivales.
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* SUBSTEP 4: AUTHORITY BANNER */}
      <AnimatePresence>
        {subStep >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              marginTop: '20px',
              padding: '16px 32px',
              borderRadius: '10px',
              backgroundColor: MC_COLORS.surfaceElevated,
              border: `1px solid ${MC_COLORS.borderBright}`,
              borderLeft: `4px solid ${MC_COLORS.goldAccent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: MC_FONTS.display,
                fontSize: '21px',
                fontWeight: 700,
                color: MC_COLORS.white,
                letterSpacing: '-0.01em',
              }}
            >
              La gente confía en sistemas y franquicias, no en inventos caseros.
            </span>
            <span
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.goldAccent,
                letterSpacing: '0.16em',
              }}
            >
              DISCIPLINA DE MARCA
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================================
   SLIDE 6: SISTEMA CERO EXCUSAS (3 SubSteps) — WITH REAL BEFORE/AFTER PHOTOS
   ========================================================================== */
export const Slide6ZeroExcuses: React.FC<SlideProps> = ({ subStep }) => {
  const [houseCleaned, setHouseCleaned] = useState(false);

  useEffect(() => {
    if (subStep < 3) {
      setHouseCleaned(false);
      return;
    }
    const timer1 = setTimeout(() => setHouseCleaned(true), 1800);
    const interval = setInterval(() => {
      setHouseCleaned((prev) => !prev);
    }, 3600);
    return () => {
      clearTimeout(timer1);
      clearInterval(interval);
    };
  }, [subStep]);

  const driveFolders = [
    { name: '01_Logos_PNG', files: '12 archivos • Proporción Bloqueada 1:1' },
    { name: '02_Plantillas_Oficiales', files: 'Formatos editables autorizados' },
    { name: '03_Yard_Signs', files: 'Arte final para imprenta en Louisville' },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '44px 88px 78px 88px',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '24px',
          borderBottom: `1px solid ${MC_COLORS.borderDefault}`,
          paddingBottom: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MC_FONTS.mono,
              fontSize: '12px',
              fontWeight: 600,
              color: MC_COLORS.goldAccent,
              letterSpacing: '0.18em',
              marginBottom: '6px',
            }}
          >
            PROTOCOLO OPERATIVO // FLUJO DE TRABAJO EN 5 MINUTOS
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: MC_FONTS.display,
              fontSize: '42px',
              fontWeight: 800,
              color: MC_COLORS.white,
              letterSpacing: '-0.03em',
            }}
          >
            Sistema Cero Excusas
          </h1>
        </div>
        <BrandLogo variant="full-white" height={38} />
      </div>

      {/* 3 WORKSTATION MODULES */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '28px',
          alignItems: 'stretch',
        }}
      >
        {/* MODULE 1: LA CARPETA SAGRADA EN DRIVE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MC_SPRINGS.snappyReveal}
          style={{
            borderRadius: '12px',
            backgroundColor: MC_COLORS.surface,
            border: `1px solid ${MC_COLORS.borderDefault}`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '11px',
                fontWeight: 600,
                color: MC_COLORS.goldAccent,
                letterSpacing: '0.14em',
                marginBottom: '6px',
              }}
            >
              ESTACIÓN 01 // REPOSITORIO CENTRAL
            </div>
            <h3
              style={{
                margin: '0 0 16px 0',
                fontFamily: MC_FONTS.display,
                fontSize: '20px',
                fontWeight: 700,
                color: MC_COLORS.white,
              }}
            >
              La Carpeta Sagrada en Drive
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              {driveFolders.map((f) => (
                <div
                  key={f.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#0C0C0F',
                    border: `1px solid ${MC_COLORS.borderSubtle}`,
                  }}
                >
                  <FolderOpen size={20} color={MC_COLORS.goldAccent} />
                  <div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: MC_COLORS.white,
                      }}
                    >
                      {f.name}
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.sans,
                        fontSize: '12px',
                        color: MC_COLORS.mutedGray,
                      }}
                    >
                      {f.files}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Locked Logo */}
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '8px',
                backgroundColor: MC_COLORS.burgundyBrand,
                border: '1px solid rgba(255,255,255,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <BrandLogo variant="full-white" height={32} />
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: MC_FONTS.mono,
                  fontSize: '11px',
                  color: MC_COLORS.offWhite,
                }}
              >
                <Lock size={12} /> 1:1 LOCK
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '14px',
              padding: '14px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.025)',
              borderLeft: `3px solid ${MC_COLORS.goldAccent}`,
              fontFamily: MC_FONTS.sans,
              fontSize: '14.5px',
              color: MC_COLORS.offWhite,
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: MC_COLORS.white }}>
              Prohibido diseñar desde cero:
            </strong>{' '}
            Abre la plantilla oficial, cambia la foto y cambia el precio. El que
            estire el logo 1 milímetro, pierde.
          </div>
        </motion.div>

        {/* MODULE 2: PHOTOROOM + LEY DE GRAVEDAD */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {subStep < 2 ? (
            <div
              style={{
                flex: 1,
                borderRadius: '12px',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                backgroundColor: MC_COLORS.surfaceSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.14em',
              }}
            >
              [ ESPACIO // ESTACIÓN 02 ]
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                flex: 1,
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: MC_COLORS.greenText,
                    letterSpacing: '0.14em',
                    marginBottom: '6px',
                  }}
                >
                  ESTACIÓN 02 // PHOTOROOM & iOS
                </div>
                <h3
                  style={{
                    margin: '0 0 14px 0',
                    fontFamily: MC_FONTS.display,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: MC_COLORS.white,
                  }}
                >
                  Recorte en 1 Toque + Ley de Gravedad
                </h3>

                <div
                  style={{
                    height: '295px',
                    borderRadius: '8px',
                    backgroundColor: '#0C0C0F',
                    backgroundImage:
                      'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                    border: `1px solid ${MC_COLORS.borderSubtle}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{ top: ['8%', '88%', '8%'] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '1.5px',
                      backgroundColor: 'rgba(16, 185, 129, 0.65)',
                      zIndex: 4,
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(17, 17, 20, 0.9)',
                      border: `1px solid ${MC_COLORS.borderDefault}`,
                      fontFamily: MC_FONTS.mono,
                      fontSize: '10px',
                      color: MC_COLORS.greenText,
                    }}
                  >
                    ANCLADO AL PISO Y BORDE IZQUIERDO
                  </div>

                  <motion.div
                    initial={{ y: -24, opacity: 0.7 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      repeatDelay: 1.5,
                    }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '210px',
                      height: '255px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <img
                      src="/assets/agents/yeilen-contreras-nobg.png"
                      alt="Recorte Oficial New Era"
                      style={{
                        height: '250px',
                        width: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'bottom left',
                      }}
                    />
                  </motion.div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: MC_COLORS.greenMoney,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: '3px',
                      backgroundColor: MC_COLORS.greenMoney,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  borderLeft: `3px solid ${MC_COLORS.greenMoney}`,
                  fontFamily: MC_FONTS.sans,
                  fontSize: '14.5px',
                  color: MC_COLORS.offWhite,
                  lineHeight: 1.4,
                }}
              >
                <strong style={{ color: MC_COLORS.white }}>Ley de Gravedad:</strong>{' '}
                Tu cuerpo SIEMPRE va pegado al piso o al borde lateral del
                diseño.
              </div>
            </motion.div>
          )}
        </div>

        {/* MODULE 3: EL BORRADOR MÁGICO PARA CASAS (REAL LOUISVILLE PHOTOS) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {subStep < 3 ? (
            <div
              style={{
                flex: 1,
                borderRadius: '12px',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                backgroundColor: MC_COLORS.surfaceSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.14em',
              }}
            >
              [ ESPACIO // ESTACIÓN 03 ]
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                flex: 1,
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: MC_COLORS.metallicGray,
                      letterSpacing: '0.14em',
                    }}
                  >
                    ESTACIÓN 03 // MAGIC ERASER
                  </span>
                  <button
                    type="button"
                    onClick={() => setHouseCleaned((prev) => !prev)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${MC_COLORS.borderDefault}`,
                      color: houseCleaned
                        ? MC_COLORS.greenText
                        : MC_COLORS.redText,
                      fontFamily: MC_FONTS.mono,
                      fontSize: '10px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {houseCleaned
                      ? 'DESPUÉS // FACHADA LIMPIA'
                      : 'ANTES // BASURA + MANGUERA + CABLES'}
                  </button>
                </div>

                <h3
                  style={{
                    margin: '0 0 14px 0',
                    fontFamily: MC_FONTS.display,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: MC_COLORS.white,
                  }}
                >
                  El Borrador Mágico para Casas
                </h3>

                {/* Real Pixel-Aligned Before/After Louisville House Comparison */}
                <div
                  onClick={() => setHouseCleaned((prev) => !prev)}
                  style={{
                    height: '295px',
                    borderRadius: '8px',
                    backgroundColor: '#09090B',
                    border: `1px solid ${
                      houseCleaned ? MC_COLORS.greenBorder : MC_COLORS.redBorder
                    }`,
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {/* Base Layer: Dirty House (Trash can, hose, utility lines) */}
                  <img
                    src="/assets/masterclass/house-louisville-dirty.jpg"
                    alt="Fachada en Louisville con bote de basura azul, manguera y cables"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />

                  {/* Top Layer: Clean Retouched House with Animated Clip-Path Wipe */}
                  <motion.div
                    initial={false}
                    animate={{
                      clipPath: houseCleaned
                        ? 'inset(0 0% 0 0)'
                        : 'inset(0 100% 0 0)',
                    }}
                    transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <img
                      src="/assets/masterclass/house-louisville-clean.jpg"
                      alt="Fachada en Louisville limpia sin bote de basura, manguera ni cables"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
                    />
                  </motion.div>

                  {/* Animated Scanner Line Synced with Clip-Path Wipe */}
                  <motion.div
                    initial={false}
                    animate={{ left: houseCleaned ? '100%' : '0%' }}
                    transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: MC_COLORS.goldAccent,
                      boxShadow: '0 0 18px rgba(212, 175, 55, 0.9)',
                      pointerEvents: 'none',
                      zIndex: 5,
                    }}
                  />

                  {/* Bottom Status Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(9, 9, 11, 0.88)',
                      backdropFilter: 'blur(6px)',
                      border: `1px solid ${
                        houseCleaned ? MC_COLORS.greenBorder : MC_COLORS.redBorder
                      }`,
                      fontFamily: MC_FONTS.mono,
                      fontSize: '10.5px',
                      color: houseCleaned
                        ? MC_COLORS.greenText
                        : MC_COLORS.redText,
                      textAlign: 'center',
                      zIndex: 6,
                    }}
                  >
                    {houseCleaned
                      ? 'DESPUÉS: Sin tanque azul, sin manguera y sin cables (5 seg)'
                      : 'ANTES: Tanque de basura azul + Manguera tirada + Cables cruzados'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  borderLeft: `3px solid ${MC_COLORS.greenMoney}`,
                  fontFamily: MC_FONTS.sans,
                  fontSize: '14.5px',
                  color: MC_COLORS.offWhite,
                  lineHeight: 1.4,
                }}
              >
                <strong style={{ color: MC_COLORS.white }}>En 5 segundos:</strong>{' '}
                Pasa el pincel mágico para borrar el tanque azul, la manguera y
                los cables antes de publicar.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
