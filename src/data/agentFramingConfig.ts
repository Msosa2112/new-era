export interface AgentFraming {
  scale: number;
  offsetX: number;
  offsetY: number;
  heightPercent: number;
  avatarZoom: number;
  avatarX: number;
  avatarY: number;
}

export const DEFAULT_FRAMING: AgentFraming = {
  scale: 1.0,
  offsetX: 0,
  offsetY: -10,
  heightPercent: 100,
  avatarZoom: 1.45,
  avatarX: 50,
  avatarY: 12
};

const AGENT_IDS = [
  'yeilen-contreras',
  'rebeca-lopez-portuondo',
  'yenny-mendoza-molina',
  'dianelis-segrea-castellon',
  'marien-rodriguez-reyes',
  'claudia-aguilera-cuenca',
  'yazbel-diaz',
  'javier-ferrer-rodriguez',
  'leidys-herrera',
  'dahana-aguila',
  'walter-gotay',
  'karla-fernandez-soto',
  'geraldine-santiago-then',
  'lizandra-parra-rodriguez',
  'yisel-pupo',
  'solanch-rodriguez-curbeira',
  'albin-machado-campo',
  'ivonne-medina',
  'maria-mendez',
  'rosa-mustelier-jimenez',
  'dayani-chavez',
  'nina-gonzalez',
  'grisel-gonzalez',
  'yordanis-alba-elias',
  'stephanie-preciado',
  'alejandro-robles',
  'darien-hernandez',
  'esneider-ochoa'
] as const;

// ==========================================
// 1. CONFIGURACIÓN EXCLUSIVA PARA DESKTOP
// ==========================================
export const DESKTOP_AGENT_FRAMING: Record<string, AgentFraming> = Object.fromEntries(
  AGENT_IDS.map((id) => [
    id,
    {
      scale: 1,
      offsetX: 0,
      offsetY: -10,
      heightPercent: 100,
      avatarZoom: 1.45,
      avatarX: 50,
      avatarY: 12
    }
  ])
);

// ==========================================
// 2. CONFIGURACIÓN EXCLUSIVA PARA MOBILE
// ==========================================
export const MOBILE_AGENT_FRAMING: Record<string, AgentFraming> = Object.fromEntries(
  AGENT_IDS.map((id) => [
    id,
    {
      scale: 1,
      offsetX: 0,
      offsetY: 6,
      heightPercent: 100,
      avatarZoom: 1.45,
      avatarX: 50,
      avatarY: 12
    }
  ])
);

const STORAGE_KEY_DESKTOP = 'agent_framing_desktop_v9';
const STORAGE_KEY_MOBILE = 'agent_framing_mobile_v9';

export function loadSavedDesktopFraming(): Record<string, AgentFraming> {
  if (typeof window === 'undefined') return { ...DESKTOP_AGENT_FRAMING };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DESKTOP);
    if (!raw) return { ...DESKTOP_AGENT_FRAMING };
    const parsed = JSON.parse(raw);
    return { ...DESKTOP_AGENT_FRAMING, ...parsed };
  } catch {
    return { ...DESKTOP_AGENT_FRAMING };
  }
}

export function saveDesktopFramingToStorage(data: Record<string, AgentFraming>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_DESKTOP, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save desktop framing:', e);
  }
}

export function loadSavedMobileFraming(): Record<string, AgentFraming> {
  if (typeof window === 'undefined') return { ...MOBILE_AGENT_FRAMING };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOBILE);
    if (!raw) return { ...MOBILE_AGENT_FRAMING };
    const parsed = JSON.parse(raw);
    return { ...MOBILE_AGENT_FRAMING, ...parsed };
  } catch {
    return { ...MOBILE_AGENT_FRAMING };
  }
}

export function saveMobileFramingToStorage(data: Record<string, AgentFraming>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_MOBILE, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save mobile framing:', e);
  }
}

export function getAgentFraming(agentId: string, isMobile: boolean): AgentFraming {
  if (isMobile) {
    return MOBILE_AGENT_FRAMING[agentId] || DEFAULT_FRAMING;
  }
  return DESKTOP_AGENT_FRAMING[agentId] || DEFAULT_FRAMING;
}

// ==========================================
// 3. CONFIGURACIÓN DE ENCUADRE & DEGRADADO PARA PERFIL INDIVIDUAL (PROFILE HERO)
// ==========================================
export interface ProfileAgentFraming {
  scale: number;
  offsetX: number;
  offsetY: number;
  heightPercent: number;
  fadeStart: number; // Porcentaje donde comienza a difuminarse (ej: 78%)
  fadeEnd: number;   // Porcentaje donde se vuelve 100% transparente (ej: 98%)
}

export const DEFAULT_PROFILE_FRAMING: ProfileAgentFraming = {
  scale: 1.55,
  offsetX: 0,
  offsetY: 0,
  heightPercent: 100,
  fadeStart: 66,
  fadeEnd: 88
};

export const DESKTOP_PROFILE_FRAMING: Record<string, ProfileAgentFraming> = Object.fromEntries(
  AGENT_IDS.map((id) => [
    id,
    {
      scale: 1.55,
      offsetX: 0,
      offsetY: 0,
      heightPercent: 100,
      fadeStart: 66,
      fadeEnd: 88
    }
  ])
);

export const MOBILE_PROFILE_FRAMING: Record<string, ProfileAgentFraming> = Object.fromEntries(
  AGENT_IDS.map((id) => [
    id,
    {
      scale: 1.55,
      offsetX: 0,
      offsetY: 0,
      heightPercent: 100,
      fadeStart: 66,
      fadeEnd: 88
    }
  ])
);

const STORAGE_KEY_PROFILE_DESKTOP = 'agent_profile_framing_desktop_v6';
const STORAGE_KEY_PROFILE_MOBILE = 'agent_profile_framing_mobile_v6';

export function loadSavedProfileDesktopFraming(): Record<string, ProfileAgentFraming> {
  if (typeof window === 'undefined') return { ...DESKTOP_PROFILE_FRAMING };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE_DESKTOP);
    if (!raw) return { ...DESKTOP_PROFILE_FRAMING };
    const parsed = JSON.parse(raw);
    return { ...DESKTOP_PROFILE_FRAMING, ...parsed };
  } catch {
    return { ...DESKTOP_PROFILE_FRAMING };
  }
}

export function saveProfileDesktopFramingToStorage(data: Record<string, ProfileAgentFraming>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE_DESKTOP, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save profile desktop framing:', e);
  }
}

export function loadSavedProfileMobileFraming(): Record<string, ProfileAgentFraming> {
  if (typeof window === 'undefined') return { ...MOBILE_PROFILE_FRAMING };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE_MOBILE);
    if (!raw) return { ...MOBILE_PROFILE_FRAMING };
    const parsed = JSON.parse(raw);
    return { ...MOBILE_PROFILE_FRAMING, ...parsed };
  } catch {
    return { ...MOBILE_PROFILE_FRAMING };
  }
}

export function saveProfileMobileFramingToStorage(data: Record<string, ProfileAgentFraming>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE_MOBILE, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save profile mobile framing:', e);
  }
}

export function getProfileAgentFraming(agentId: string, isMobile: boolean): ProfileAgentFraming {
  if (isMobile) {
    return MOBILE_PROFILE_FRAMING[agentId] || DEFAULT_PROFILE_FRAMING;
  }
  return DESKTOP_PROFILE_FRAMING[agentId] || DEFAULT_PROFILE_FRAMING;
}
