import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardHat,
  Truck,
  Factory,
  Coffee,
  FileSpreadsheet,
  QrCode,
  Check,
} from 'lucide-react';
import { MC_COLORS, MC_FONTS, MC_SPRINGS } from './masterclassTokens';

interface SlideProps {
  subStep: number;
}

/* ==========================================================================
   SLIDE 7: ¿QUIÉN TIENE EL DOWN PAYMENT HOY EN LOUISVILLE? (2 SubSteps)
   ========================================================================== */
export const Slide7DownPayment: React.FC<SlideProps> = ({ subStep }) => {
  const profiles = [
    {
      num: '01',
      icon: <HardHat size={22} color={MC_COLORS.goldAccent} />,
      title: 'El Subcontratista (1099 / ITIN)',
      savings: '$20,000 – $35,000 en liquidez',
      rubros: 'Cuadrillas de Roofing, Siding, Framing, Concreto y Drywall.',
      dolor:
        'Gana excelente dinero pero cree que por declarar con 1099 o ITIN el banco no lo califica.',
    },
    {
      num: '02',
      icon: <Truck size={22} color={MC_COLORS.goldAccent} />,
      title: 'El Dueño de su Propia Troca / Negocio',
      savings: '$18,000 – $30,000 en banco',
      rubros:
        'Landscaping, pintura, taller mecánico, lonchera (food truck) y transporte.',
      dolor:
        'Necesita terreno, driveway amplio o garaje para sus equipos sin restricciones de asociación (HOA).',
    },
    {
      num: '03',
      icon: <Factory size={22} color={MC_COLORS.goldAccent} />,
      title: 'El Matrimonio de Fábrica / Logística',
      savings: '$15,000 – $25,000 + W2',
      rubros:
        '50–60 horas semanales y overtime en Ford, UPS, GE Appliance Park o almacenes.',
      dolor:
        'Cansados de perder $1,600 – $1,800 al mes en apartamentos donde la renta sube cada año.',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: subStep === 1 ? 'center' : 'space-between',
        padding: '48px 88px 80px 88px',
        boxSizing: 'border-box',
      }}
    >
      {/* SUBSTEP 1: WORKSHOP QUESTION */}
      <motion.div
        layout
        transition={MC_SPRINGS.snappyReveal}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: subStep === 1 ? 'center' : 'flex-start',
          textAlign: subStep === 1 ? 'center' : 'left',
          marginBottom: subStep >= 2 ? '28px' : '0px',
          borderBottom:
            subStep >= 2 ? `1px solid ${MC_COLORS.borderDefault}` : 'none',
          paddingBottom: subStep >= 2 ? '20px' : '0px',
        }}
      >
        <div
          style={{
            fontFamily: MC_FONTS.mono,
            fontSize: '12px',
            fontWeight: 600,
            color: MC_COLORS.goldAccent,
            letterSpacing: '0.18em',
            marginBottom: '12px',
          }}
        >
          INTELIGENCIA DE MERCADO LOCAL // LOUISVILLE, KY
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: MC_FONTS.display,
            fontSize: subStep === 1 ? '62px' : '38px',
            fontWeight: 800,
            color: MC_COLORS.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            transition: 'font-size 0.35s ease',
          }}
        >
          Olvídense de Instagram por 5 minutos.
        </h1>

        <p
          style={{
            margin: subStep === 1 ? '28px 0 0 0' : '8px 0 0 0',
            fontFamily: MC_FONTS.sans,
            fontSize: subStep === 1 ? '32px' : '20px',
            fontWeight: 400,
            color: MC_COLORS.metallicGray,
            maxWidth: '1100px',
            lineHeight: 1.4,
          }}
        >
          “¿Quién es el latino que{' '}
          <span
            style={{
              color: MC_COLORS.white,
              fontWeight: 600,
              fontFamily: MC_FONTS.mono,
            }}
          >
            HOY tiene $15,000 a $25,000
          </span>{' '}
          guardados en Louisville y quiere comprar casa?”
        </p>

        {subStep === 1 && (
          <div
            style={{
              marginTop: '48px',
              padding: '10px 20px',
              borderRadius: '6px',
              border: `1px solid ${MC_COLORS.borderDefault}`,
              backgroundColor: MC_COLORS.surface,
              fontFamily: MC_FONTS.mono,
              fontSize: '12px',
              color: MC_COLORS.mutedGray,
              letterSpacing: '0.16em',
            }}
          >
            PREGUNTA ABIERTA A LA SALA — PRESIONA ESPACIO PARA REVELAR PERFILES
          </div>
        )}
      </motion.div>

      {/* SUBSTEP 2: 3 BUYER DOSSIER CARDS */}
      <AnimatePresence>
        {subStep >= 2 && (
          <motion.div
            key="target-cards-grid"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '28px',
              alignItems: 'stretch',
            }}
          >
            {profiles.map((p, idx) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...MC_SPRINGS.snappyReveal,
                  delay: idx * 0.12,
                }}
                style={{
                  borderRadius: '12px',
                  backgroundColor: MC_COLORS.surface,
                  border: `1px solid ${MC_COLORS.borderDefault}`,
                  borderTop: `3px solid ${MC_COLORS.goldAccent}`,
                  padding: '30px',
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
                      marginBottom: '20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: MC_COLORS.goldAccent,
                        letterSpacing: '0.14em',
                      }}
                    >
                      PERFIL {p.num}
                    </span>
                    <span
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: MC_COLORS.greenText,
                      }}
                    >
                      {p.savings}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${MC_COLORS.borderSubtle}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {p.icon}
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: MC_FONTS.display,
                        fontSize: '22px',
                        fontWeight: 700,
                        color: MC_COLORS.white,
                        lineHeight: 1.25,
                      }}
                    >
                      {p.title}
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${MC_COLORS.borderSubtle}`,
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: MC_COLORS.mutedGray,
                        letterSpacing: '0.12em',
                        marginBottom: '6px',
                      }}
                    >
                      SECTORES Y OCUPACIÓN
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.sans,
                        fontSize: '17px',
                        fontWeight: 500,
                        color: MC_COLORS.offWhite,
                        lineHeight: 1.45,
                      }}
                    >
                      {p.rubros}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '18px 20px',
                    borderRadius: '8px',
                    backgroundColor: MC_COLORS.surfaceElevated,
                    borderLeft: `3px solid ${MC_COLORS.greenMoney}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: MC_COLORS.greenText,
                      letterSpacing: '0.12em',
                      marginBottom: '6px',
                    }}
                  >
                    NECESIDAD PRINCIPAL (EL DOLOR)
                  </div>
                  <div
                    style={{
                      fontFamily: MC_FONTS.sans,
                      fontSize: '17px',
                      fontWeight: 500,
                      color: MC_COLORS.white,
                      lineHeight: 1.45,
                    }}
                  >
                    {p.dolor}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================================
   SLIDE 8: EL MAPA DE CAZA DE 6:30 AM A 7:00 PM (4 SubSteps)
   ========================================================================== */
export const Slide8HuntingMap: React.FC<SlideProps> = ({ subStep }) => {
  const nodes = [
    {
      step: 1,
      time: '06:30 AM',
      subtitle: 'El Despertar Productivo',
      clientLocation:
        'Comprando materiales en Home Depot Pro / ABC Supply / Sherwin-Williams, o tomando café y pan dulce en panaderías y gasolineras de Preston Hwy, Dixie Hwy u Okolona.',
      realtorAvg: 'Durmiendo.',
    },
    {
      step: 2,
      time: '12:30 PM',
      subtitle: 'La Hora del Almuerzo',
      clientLocation:
        'Comiendo en las mismas 10 taquerías, loncheras y buffets hispanos de la ciudad.',
      realtorAvg:
        'Subiendo una historia de “Happy Friday” con café de Starbucks.',
    },
    {
      step: 3,
      time: 'VIERNES 5:00 PM',
      subtitle: 'El Flujo de Efectivo',
      clientLocation:
        'Cambiando cheques, enviando remesas, en la aseguradora hispana, en el taller o haciendo compra grande en el supermercado latino.',
      realtorAvg: 'Revisando cuántos likes tuvo su último Reel.',
    },
    {
      step: 4,
      time: 'DOMINGOS',
      subtitle: 'Comunidad y Familia',
      clientLocation:
        'En las ligas de fútbol y béisbol locales, en la iglesia o en reuniones familiares.',
      realtorAvg: 'Esperando que entren prospectos por arte de magia.',
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
        padding: '48px 88px 80px 88px',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${MC_COLORS.borderDefault}`,
          paddingBottom: '18px',
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
            CRONOGRAMA DE ATENCIÓN FÍSICA // RUTA DIARIA EN LOUISVILLE
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: MC_FONTS.display,
              fontSize: '44px',
              fontWeight: 800,
              color: MC_COLORS.white,
              letterSpacing: '-0.03em',
            }}
          >
            El Mapa de Caza: 6:30 AM a 7:00 PM
          </h1>
        </div>
        <div
          style={{
            fontFamily: MC_FONTS.mono,
            fontSize: '12px',
            color: MC_COLORS.metallicGray,
            letterSpacing: '0.12em',
          }}
        >
          PRESTON HWY • DIXIE HWY • OKOLONA
        </div>
      </div>

      {/* TIMELINE TRACK + 4 COLUMNS */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {/* Minimalist Progress Line */}
        <div
          style={{
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ width: `${(subStep / 4) * 100}%` }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              height: '100%',
              backgroundColor: MC_COLORS.goldAccent,
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '22px',
            alignItems: 'stretch',
          }}
        >
          {nodes.map((node) => {
            const isActive = subStep >= node.step;
            const isCurrent = subStep === node.step;
            return (
              <motion.div
                key={node.time}
                animate={{
                  opacity: isActive ? 1 : 0.25,
                  y: isActive ? 0 : 8,
                }}
                transition={MC_SPRINGS.snappyReveal}
                style={{
                  borderRadius: '12px',
                  backgroundColor: isActive
                    ? MC_COLORS.surface
                    : 'rgba(255,255,255,0.015)',
                  border: `1px solid ${
                    isCurrent
                      ? MC_COLORS.goldAccent
                      : isActive
                      ? MC_COLORS.borderDefault
                      : MC_COLORS.borderSubtle
                  }`,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '18px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '20px',
                      fontWeight: 700,
                      color: isActive ? MC_COLORS.goldAccent : MC_COLORS.mutedGray,
                      marginBottom: '6px',
                    }}
                  >
                    {node.time}
                  </div>
                  <div
                    style={{
                      fontFamily: MC_FONTS.display,
                      fontSize: '18px',
                      fontWeight: 700,
                      color: MC_COLORS.white,
                      marginBottom: '18px',
                    }}
                  >
                    {node.subtitle}
                  </div>

                  <div
                    style={{
                      paddingTop: '14px',
                      borderTop: `1px solid ${MC_COLORS.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '10px',
                        fontWeight: 600,
                        color: MC_COLORS.greenText,
                        letterSpacing: '0.12em',
                        marginBottom: '8px',
                      }}
                    >
                      ¿DÓNDE ESTÁ TU CLIENTE?
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.sans,
                        fontSize: '15px',
                        fontWeight: 400,
                        color: MC_COLORS.offWhite,
                        lineHeight: 1.48,
                      }}
                    >
                      {node.clientLocation}
                    </div>
                  </div>
                </div>

                {/* Average Realtor Bar */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#0C0C0F',
                    border: `1px solid ${MC_COLORS.borderSubtle}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '10px',
                      fontWeight: 600,
                      color: MC_COLORS.mutedGray,
                      letterSpacing: '0.1em',
                      marginBottom: '4px',
                    }}
                  >
                    REALTOR PROMEDIO:
                  </div>
                  <div
                    style={{
                      fontFamily: MC_FONTS.sans,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: MC_COLORS.metallicGray,
                      lineHeight: 1.35,
                    }}
                  >
                    {node.realtorAvg}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SUBSTEP 4: CONCLUSION BAR */}
      <AnimatePresence>
        {subStep >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              padding: '18px 32px',
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
                fontSize: '22px',
                fontWeight: 700,
                color: MC_COLORS.white,
              }}
            >
              Si no estás donde está su atención física, eres invisible.
            </span>
            <span
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                color: MC_COLORS.goldAccent,
                letterSpacing: '0.14em',
              }}
            >
              PRESENCIA DE CAMPO
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================================
   SLIDE 9: ATAQUES DE GUERRILLA + REGLA DE LAS 24 HORAS (4 SubSteps)
   ========================================================================== */
export const Slide9GuerrillaPact: React.FC<SlideProps> = ({ subStep }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = checkedItems[1] && checkedItems[2] && checkedItems[3];

  const checklist = [
    {
      id: 1,
      text: '1. Prohibido volver a meter el logo en ChatGPT.',
    },
    {
      id: 2,
      text: '2. Acceso directo al Drive Oficial puesto hoy en la pantalla de inicio del teléfono.',
    },
    {
      id: 3,
      text: '3. Mi próximo video hablará de un problema real de una familia en Louisville, no de mi ego.',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 88px 80px 88px',
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
            PLAN DE ACCIÓN COMERCIAL // EJECUCIÓN INMEDIATA
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
            Estrategias de Guerrilla y Regla de las 24 Horas
          </h1>
        </div>
      </div>

      {/* MAIN SPLIT: 60% LEFT PLAYBOOKS / 40% RIGHT INTERACTIVE PACT */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: '32px',
          alignItems: 'stretch',
        }}
      >
        {/* LEFT: 3 PLAYBOOKS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* TÁCTICA 1 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MC_SPRINGS.snappyReveal}
            style={{
              borderRadius: '12px',
              backgroundColor: MC_COLORS.surface,
              border: `1px solid ${MC_COLORS.borderDefault}`,
              padding: '22px 26px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start',
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
              }}
            >
              <Coffee size={20} color={MC_COLORS.goldAccent} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: MC_FONTS.mono,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: MC_COLORS.goldAccent,
                  letterSpacing: '0.14em',
                  marginBottom: '4px',
                }}
              >
                TÁCTICA 01 // PROSPECCIÓN DIRECTA
              </div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  fontFamily: MC_FONTS.display,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: MC_COLORS.white,
                }}
              >
                Operación Café y Pan Dulce (6:30 AM)
              </h3>
              <p
                style={{
                  margin: 0,
                  fontFamily: MC_FONTS.sans,
                  fontSize: '15.5px',
                  color: MC_COLORS.metallicGray,
                  lineHeight: 1.45,
                }}
              >
                En vez de dejar 100 tarjetas que terminan en la basura, párate
                un viernes a las 6:30 AM en la panadería donde paran 40
                camionetas de construcción:{' '}
                <span style={{ color: MC_COLORS.white, fontWeight: 500 }}>
                  “Si trabajas con 1099 o ITIN, hoy tu café corre por mi cuenta
                  y en 2 minutos te digo cuánto calificas para tu casa.”
                </span>
              </p>
            </div>
          </motion.div>

          {/* TÁCTICA 2 */}
          <div style={{ flex: 1, display: 'flex' }}>
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
                [ ESPACIO // TÁCTICA 02 ]
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={MC_SPRINGS.snappyReveal}
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  backgroundColor: MC_COLORS.surface,
                  border: `1px solid ${MC_COLORS.borderDefault}`,
                  padding: '22px 26px',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
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
                  }}
                >
                  <FileSpreadsheet size={20} color={MC_COLORS.goldAccent} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: MC_FONTS.mono,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: MC_COLORS.goldAccent,
                      letterSpacing: '0.14em',
                      marginBottom: '4px',
                    }}
                  >
                    TÁCTICA 02 // ALIANZAS ESTRATÉGICAS
                  </div>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontFamily: MC_FONTS.display,
                      fontSize: '20px',
                      fontWeight: 700,
                      color: MC_COLORS.white,
                    }}
                  >
                    Los Dueños del Secreto Financiero
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: MC_FONTS.sans,
                      fontSize: '15.5px',
                      color: MC_COLORS.metallicGray,
                      lineHeight: 1.45,
                    }}
                  >
                    ¿Quién es la única persona en Louisville que sabe al centavo
                    cuánto gana un latino antes que nadie? El preparador de{' '}
                    <strong style={{ color: MC_COLORS.white }}>Taxes</strong> y
                    el corredor de{' '}
                    <strong style={{ color: MC_COLORS.white }}>
                      Seguro Comercial
                    </strong>
                    . Una alianza formal con 3 oficinas de taxes supera a 200
                    Reels bailando.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* TÁCTICA 3 */}
          <div style={{ flex: 1.15, display: 'flex' }}>
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
                [ ESPACIO // TÁCTICA 03 ]
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={MC_SPRINGS.snappyReveal}
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  backgroundColor: MC_COLORS.surface,
                  border: `1px solid ${MC_COLORS.borderDefault}`,
                  padding: '22px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
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
                        marginBottom: '4px',
                      }}
                    >
                      TÁCTICA 03 // MENSAJE DE CONVERSIÓN EN IMANES Y QR
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: MC_FONTS.display,
                        fontSize: '20px',
                        fontWeight: 700,
                        color: MC_COLORS.white,
                      }}
                    >
                      Eliminar el Ego en Letreros y Vehículos
                    </h3>
                  </div>
                  <QrCode size={24} color={MC_COLORS.metallicGray} />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '42% 58%',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderLeft: `3px solid ${MC_COLORS.redEgo}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '10px',
                        fontWeight: 600,
                        color: MC_COLORS.redText,
                        letterSpacing: '0.1em',
                        marginBottom: '4px',
                      }}
                    >
                      ENFOQUE DE EGO (INEFECTIVO)
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.sans,
                        fontSize: '14px',
                        color: MC_COLORS.mutedGray,
                        lineHeight: 1.38,
                      }}
                    >
                      Foto gigante + “Juan Pérez - Top Producer - Llámame”.
                      (Nadie llama).
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: MC_COLORS.surfaceElevated,
                      borderLeft: `3px solid ${MC_COLORS.greenMoney}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MC_FONTS.mono,
                        fontSize: '10px',
                        fontWeight: 600,
                        color: MC_COLORS.greenText,
                        letterSpacing: '0.1em',
                        marginBottom: '4px',
                      }}
                    >
                      ENFOQUE DE SOLUCIÓN → WHATSAPP DIRECTO
                    </div>
                    <div
                      style={{
                        fontFamily: MC_FONTS.sans,
                        fontSize: '14px',
                        fontWeight: 500,
                        color: MC_COLORS.white,
                        lineHeight: 1.38,
                      }}
                    >
                      “¿Pagando más de $1,600 de renta en Louisville? Escanea
                      para ver 3 casas con patio propio por menos de eso al mes.”
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT: EL PACTO DE LAS 24 HORAS */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {subStep < 4 ? (
            <div
              style={{
                flex: 1,
                borderRadius: '12px',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                backgroundColor: MC_COLORS.surfaceSubtle,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: MC_FONTS.mono,
                  fontSize: '12px',
                  color: MC_COLORS.mutedGray,
                  letterSpacing: '0.16em',
                }}
              >
                PASO 04 // COMPROMISO EN VIVO
              </div>
              <div
                style={{
                  fontFamily: MC_FONTS.display,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: MC_COLORS.metallicGray,
                }}
              >
                El Pacto de las 24 Horas
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={MC_SPRINGS.snappyReveal}
              style={{
                flex: 1,
                borderRadius: '12px',
                backgroundColor: MC_COLORS.surfaceElevated,
                border: `1px solid ${
                  allChecked ? MC_COLORS.goldAccent : MC_COLORS.borderBright
                }`,
                padding: '32px',
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
                    letterSpacing: '0.16em',
                    marginBottom: '8px',
                  }}
                >
                  PROTOCOLO DE CIERRE // CHECKLIST EN VIVO
                </div>

                <h2
                  style={{
                    margin: '0 0 8px 0',
                    fontFamily: MC_FONTS.display,
                    fontSize: '28px',
                    fontWeight: 800,
                    color: MC_COLORS.white,
                    letterSpacing: '-0.02em',
                  }}
                >
                  El Pacto de las 24 Horas
                </h2>
                <p
                  style={{
                    margin: '0 0 24px 0',
                    fontFamily: MC_FONTS.sans,
                    fontSize: '14px',
                    color: MC_COLORS.mutedGray,
                  }}
                >
                  Selecciona cada acuerdo para confirmar la implementación:
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {checklist.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') toggleCheck(item.id);
                        }}
                        style={{
                          padding: '18px 20px',
                          borderRadius: '10px',
                          backgroundColor: isChecked
                            ? 'rgba(16, 185, 129, 0.08)'
                            : MC_COLORS.surface,
                          border: `1px solid ${
                            isChecked
                              ? MC_COLORS.greenBorder
                              : MC_COLORS.borderDefault
                          }`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition:
                            'background-color 180ms ease, border-color 180ms ease',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: isChecked
                              ? MC_COLORS.greenMoney
                              : 'transparent',
                            border: `1.5px solid ${
                              isChecked
                                ? MC_COLORS.greenMoney
                                : MC_COLORS.metallicGray
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          {isChecked && (
                            <Check size={18} color="#09090B" strokeWidth={3} />
                          )}
                        </div>

                        <div
                          style={{
                            fontFamily: MC_FONTS.sans,
                            fontSize: '16.5px',
                            fontWeight: 500,
                            color: isChecked
                              ? MC_COLORS.white
                              : MC_COLORS.offWhite,
                            lineHeight: 1.42,
                          }}
                        >
                          {item.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  backgroundColor: allChecked
                    ? 'rgba(212, 175, 55, 0.14)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    allChecked ? MC_COLORS.goldAccent : MC_COLORS.borderSubtle
                  }`,
                  color: allChecked
                    ? MC_COLORS.goldAccent
                    : MC_COLORS.mutedGray,
                  textAlign: 'center',
                  fontFamily: MC_FONTS.mono,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                }}
              >
                {allChecked
                  ? 'COMPROMISO CORPORATIVO CONFIRMADO (3 / 3)'
                  : `ACUERDOS VALIDADOS: ${
                      Object.values(checkedItems).filter(Boolean).length
                    } DE 3`}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
