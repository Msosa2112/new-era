export const MC_COLORS = {
  // Architectural Monochrome Foundation (90% of visual surface)
  obsidian: '#09090B',
  surface: '#111114',
  surfaceElevated: '#16161A',
  surfaceSubtle: 'rgba(255, 255, 255, 0.025)',
  white: '#FAFAFA',
  offWhite: '#E4E4E7',
  metallicGray: '#A1A1AA',
  mutedGray: '#71717A',
  darkZinc: '#3F3F46',

  // Hairline Architectural Borders
  borderSubtle: 'rgba(255, 255, 255, 0.07)',
  borderDefault: 'rgba(255, 255, 255, 0.11)',
  borderBright: 'rgba(255, 255, 255, 0.18)',

  // Surgical Semantic Accents (Restrained & Executive)
  redEgo: '#E11D48', // Refined editorial crimson
  redText: '#FB7185',
  redEgoGlow: 'rgba(225, 29, 72, 0.14)',
  redEgoSubtle: 'rgba(225, 29, 72, 0.07)',
  redBorder: 'rgba(225, 29, 72, 0.32)',

  greenMoney: '#10B981', // Executive emerald
  greenText: '#34D399',
  greenMoneyGlow: 'rgba(16, 185, 129, 0.14)',
  greenMoneySubtle: 'rgba(16, 185, 129, 0.07)',
  greenBorder: 'rgba(16, 185, 129, 0.32)',

  amberTactical: '#D97706', // Deep architectural amber / gold
  goldAccent: '#D4AF37', // New Era Champagne Gold
  amberText: '#FBBF24',
  amberTacticalGlow: 'rgba(217, 119, 6, 0.12)',
  amberTacticalSubtle: 'rgba(217, 119, 6, 0.07)',
  amberBorder: 'rgba(217, 119, 6, 0.30)',

  burgundyBrand: '#660E1A',
} as const;

export const MC_FONTS = {
  // Clean, authoritative Swiss-Editorial typography (No quirky display fonts)
  display: "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  grotesk: "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  sans: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const MC_SPRINGS = {
  slideTransition: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 28,
  },
  impactSlam: {
    type: 'spring' as const,
    stiffness: 320,
    damping: 26,
  },
  snappyReveal: {
    type: 'spring' as const,
    stiffness: 280,
    damping: 28,
  },
  softFloat: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 24,
  },
};

export interface SlideDefinition {
  id: number;
  code: string;
  title: string;
  sectionTag: string;
  maxSubSteps: number;
}

export const SLIDES_CONFIG: SlideDefinition[] = [
  {
    id: 1,
    code: '01',
    title: 'El Gancho de Apertura',
    sectionTag: '01 // REALIDAD FINANCIERA VS. VANIDAD',
    maxSubSteps: 3,
  },
  {
    id: 2,
    code: '02',
    title: 'Auditoría de Audiencia',
    sectionTag: '02 // AUTOPSIA DE COMENTARIOS EN REDES',
    maxSubSteps: 3,
  },
  {
    id: 3,
    code: '03',
    title: 'El Problema del Video Vacío',
    sectionTag: '03 // PSICOLOGÍA COMERCIAL EN LOUISVILLE',
    maxSubSteps: 2,
  },
  {
    id: 4,
    code: '04',
    title: 'La Psicología de los 2 Segundos',
    sectionTag: '04 // AUDITORÍA DE CONFIANZA Y MARCA',
    maxSubSteps: 2,
  },
  {
    id: 5,
    code: '05',
    title: 'Errores Críticos de Imagen',
    sectionTag: '05 // ESTÁNDARES DE IDENTIDAD CORPORATIVA',
    maxSubSteps: 4,
  },
  {
    id: 6,
    code: '06',
    title: 'Sistema Cero Excusas',
    sectionTag: '06 // PROTOCOLO Y HERRAMIENTAS OFICIALES',
    maxSubSteps: 3,
  },
  {
    id: 7,
    code: '07',
    title: 'Perfil del Comprador Real',
    sectionTag: '07 // LIQUIDEZ Y DEMANDA EN LOUISVILLE',
    maxSubSteps: 2,
  },
  {
    id: 8,
    code: '08',
    title: 'El Mapa de Atención Física',
    sectionTag: '08 // CRONOGRAMA TÁCTICO: 6:30 AM – 7:00 PM',
    maxSubSteps: 4,
  },
  {
    id: 9,
    code: '09',
    title: 'Estrategia de Campo y Compromiso',
    sectionTag: '09 // EJECUCIÓN Y REGLA DE LAS 24 HORAS',
    maxSubSteps: 4,
  },
];
