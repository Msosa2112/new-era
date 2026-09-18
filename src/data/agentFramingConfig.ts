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
  offsetY: 0,
  heightPercent: 100,
  avatarZoom: 1.0,
  avatarX: 50,
  avatarY: 20
};

// ==========================================
// 1. CONFIGURACIÓN EXCLUSIVA PARA DESKTOP
// ==========================================
export const DESKTOP_AGENT_FRAMING: Record<string, AgentFraming> = {
  "yeilen-contreras": {
    "scale": 1.11,
    "offsetX": 0,
    "offsetY": -93,
    "heightPercent": 117,
    "avatarZoom": 2.25,
    "avatarX": 50,
    "avatarY": 2
  },
  "yenny-mendoza-molina": {
    "scale": 1.7,
    "offsetX": 0,
    "offsetY": -186,
    "heightPercent": 107,
    "avatarZoom": 2.5,
    "avatarX": 19,
    "avatarY": 6
  },
  "dianelis-segrea-castellon": {
    "scale": 0.95,
    "offsetX": 0,
    "offsetY": 0,
    "heightPercent": 100,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 11
  },
  "marien-rodriguez-reyes": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -13,
    "heightPercent": 100,
    "avatarZoom": 1.65,
    "avatarX": 50,
    "avatarY": 7
  },
  "claudia-aguilera-cuenca": {
    "scale": 1.19,
    "offsetX": 0,
    "offsetY": -141,
    "heightPercent": 106,
    "avatarZoom": 1.9,
    "avatarX": 50,
    "avatarY": 24
  },
  "yazbel-diaz": {
    "scale": 1.55,
    "offsetX": 0,
    "offsetY": -208,
    "heightPercent": 88,
    "avatarZoom": 2.3,
    "avatarX": 86,
    "avatarY": 33
  },
  "javier-ferrer-rodriguez": {
    "scale": 1.06,
    "offsetX": 0,
    "offsetY": 39,
    "heightPercent": 87,
    "avatarZoom": 1.4,
    "avatarX": 30,
    "avatarY": 0
  },
  "leidys-herrera": {
    "scale": 1.42,
    "offsetX": 0,
    "offsetY": -143,
    "heightPercent": 130,
    "avatarZoom": 2.5,
    "avatarX": 2,
    "avatarY": 0
  },
  "dahana-aguila": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -8,
    "heightPercent": 88,
    "avatarZoom": 1.05,
    "avatarX": 50,
    "avatarY": 20
  },
  "walter-gotay": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -96,
    "heightPercent": 117,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 29
  },
  "karla-fernandez-soto": {
    "scale": 1.25,
    "offsetX": 0,
    "offsetY": 30,
    "heightPercent": 113,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 0
  },
  "geraldine-santiago-then": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -58,
    "heightPercent": 100,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 20
  },
  "lizandra-parra-rodriguez": {
    "scale": 1.37,
    "offsetX": 0,
    "offsetY": -80,
    "heightPercent": 110,
    "avatarZoom": 2.15,
    "avatarX": 23,
    "avatarY": 0
  },
  "yisel-pupo": {
    "scale": 1.16,
    "offsetX": 0,
    "offsetY": -49,
    "heightPercent": 100,
    "avatarZoom": 1.6,
    "avatarX": 50,
    "avatarY": 11
  },
  "solanch-rodriguez-curbeira": {
    "scale": 1.1,
    "offsetX": 0,
    "offsetY": -20,
    "heightPercent": 100,
    "avatarZoom": 1.55,
    "avatarX": 50,
    "avatarY": 7
  },
  "albin-machado-campo": {
    "scale": 1.37,
    "offsetX": 0,
    "offsetY": -132,
    "heightPercent": 100,
    "avatarZoom": 1.8,
    "avatarX": 50,
    "avatarY": 19
  },
  "ivonne-medina": {
    "scale": 1.33,
    "offsetX": 0,
    "offsetY": -150,
    "heightPercent": 100,
    "avatarZoom": 1.75,
    "avatarX": 50,
    "avatarY": 27
  },
  "maria-mendez": {
    "scale": 0.7,
    "offsetX": 0,
    "offsetY": 59,
    "heightPercent": 100,
    "avatarZoom": 1,
    "avatarX": 50,
    "avatarY": 13
  },
  "rosa-mustelier-jimenez": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -40,
    "heightPercent": 100,
    "avatarZoom": 1.5,
    "avatarX": 50,
    "avatarY": 20
  }
};

// ==========================================
// 2. CONFIGURACIÓN EXCLUSIVA PARA MOBILE
// ==========================================
export const MOBILE_AGENT_FRAMING: Record<string, AgentFraming> = {
  "yeilen-contreras": {
    "scale": 1.16,
    "offsetX": 0,
    "offsetY": -66,
    "heightPercent": 121,
    "avatarZoom": 2.25,
    "avatarX": 50,
    "avatarY": 2
  },
  "yenny-mendoza-molina": {
    "scale": 1.7,
    "offsetX": 0,
    "offsetY": -80,
    "heightPercent": 107,
    "avatarZoom": 2.5,
    "avatarX": 19,
    "avatarY": 6
  },
  "dianelis-segrea-castellon": {
    "scale": 0.95,
    "offsetX": 0,
    "offsetY": 14,
    "heightPercent": 100,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 11
  },
  "marien-rodriguez-reyes": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": 7,
    "heightPercent": 100,
    "avatarZoom": 1.65,
    "avatarX": 50,
    "avatarY": 7
  },
  "claudia-aguilera-cuenca": {
    "scale": 1.03,
    "offsetX": 0,
    "offsetY": -38,
    "heightPercent": 106,
    "avatarZoom": 1.9,
    "avatarX": 50,
    "avatarY": 24
  },
  "yazbel-diaz": {
    "scale": 1.51,
    "offsetX": 0,
    "offsetY": -86,
    "heightPercent": 88,
    "avatarZoom": 2.3,
    "avatarX": 86,
    "avatarY": 33
  },
  "javier-ferrer-rodriguez": {
    "scale": 1.06,
    "offsetX": 0,
    "offsetY": 31,
    "heightPercent": 87,
    "avatarZoom": 1.4,
    "avatarX": 30,
    "avatarY": 0
  },
  "leidys-herrera": {
    "scale": 1.42,
    "offsetX": 0,
    "offsetY": -76,
    "heightPercent": 130,
    "avatarZoom": 2.5,
    "avatarX": 2,
    "avatarY": 0
  },
  "dahana-aguila": {
    "scale": 0.94,
    "offsetX": 0,
    "offsetY": 4,
    "heightPercent": 88,
    "avatarZoom": 1.05,
    "avatarX": 50,
    "avatarY": 20
  },
  "walter-gotay": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -41,
    "heightPercent": 117,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 29
  },
  "karla-fernandez-soto": {
    "scale": 1.25,
    "offsetX": 0,
    "offsetY": 21,
    "heightPercent": 113,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 0
  },
  "geraldine-santiago-then": {
    "scale": 1,
    "offsetX": 0,
    "offsetY": -21,
    "heightPercent": 100,
    "avatarZoom": 1.35,
    "avatarX": 50,
    "avatarY": 20
  },
  "lizandra-parra-rodriguez": {
    "scale": 1.37,
    "offsetX": 0,
    "offsetY": -38,
    "heightPercent": 110,
    "avatarZoom": 2.15,
    "avatarX": 23,
    "avatarY": 0
  },
  "yisel-pupo": {
    "scale": 1.16,
    "offsetX": 0,
    "offsetY": -21,
    "heightPercent": 100,
    "avatarZoom": 1.6,
    "avatarX": 50,
    "avatarY": 11
  },
  "solanch-rodriguez-curbeira": {
    "scale": 0.99,
    "offsetX": 0,
    "offsetY": 4,
    "heightPercent": 100,
    "avatarZoom": 1.55,
    "avatarX": 50,
    "avatarY": 7
  },
  "albin-machado-campo": {
    "scale": 1.31,
    "offsetX": 0,
    "offsetY": -52,
    "heightPercent": 100,
    "avatarZoom": 1.8,
    "avatarX": 50,
    "avatarY": 19
  },
  "ivonne-medina": {
    "scale": 1.33,
    "offsetX": 0,
    "offsetY": -62,
    "heightPercent": 100,
    "avatarZoom": 1.75,
    "avatarX": 50,
    "avatarY": 27
  },
  "maria-mendez": {
    "scale": 0.7,
    "offsetX": 0,
    "offsetY": 38,
    "heightPercent": 100,
    "avatarZoom": 1,
    "avatarX": 50,
    "avatarY": 13
  },
  "rosa-mustelier-jimenez": {
    "scale": 1.05,
    "offsetX": 0,
    "offsetY": -24,
    "heightPercent": 102,
    "avatarZoom": 1.5,
    "avatarX": 50,
    "avatarY": 20
  }
};

const STORAGE_KEY_DESKTOP = 'agent_framing_desktop_v5';
const STORAGE_KEY_MOBILE = 'agent_framing_mobile_v5';

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
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  heightPercent: 100,
  fadeStart: 78,
  fadeEnd: 98
};

export const DESKTOP_PROFILE_FRAMING: Record<string, ProfileAgentFraming> = {
  "yeilen-contreras": {
    "scale": 2.2,
    "offsetX": -32,
    "offsetY": 39,
    "heightPercent": 100,
    "fadeStart": 56,
    "fadeEnd": 67
  },
  "yenny-mendoza-molina": {
    "scale": 2.2,
    "offsetX": -20,
    "offsetY": 38,
    "heightPercent": 100,
    "fadeStart": 53,
    "fadeEnd": 69
  },
  "dianelis-segrea-castellon": {
    "scale": 1.7,
    "offsetX": -24,
    "offsetY": 37,
    "heightPercent": 100,
    "fadeStart": 70,
    "fadeEnd": 78
  },
  "marien-rodriguez-reyes": {
    "scale": 1.49,
    "offsetX": -16,
    "offsetY": -32,
    "heightPercent": 100,
    "fadeStart": 73,
    "fadeEnd": 88
  },
  "claudia-aguilera-cuenca": {
    "scale": 1.7,
    "offsetX": -20,
    "offsetY": -50,
    "heightPercent": 100,
    "fadeStart": 67,
    "fadeEnd": 90
  },
  "yazbel-diaz": {
    "scale": 2.16,
    "offsetX": 0,
    "offsetY": -49,
    "heightPercent": 100,
    "fadeStart": 66,
    "fadeEnd": 81
  },
  "javier-ferrer-rodriguez": {
    "scale": 1.37,
    "offsetX": -18,
    "offsetY": 0,
    "heightPercent": 100,
    "fadeStart": 72,
    "fadeEnd": 91
  },
  "leidys-herrera": {
    "scale": 2.2,
    "offsetX": 0,
    "offsetY": 99,
    "heightPercent": 100,
    "fadeStart": 51,
    "fadeEnd": 62
  },
  "dahana-aguila": {
    "scale": 1.33,
    "offsetX": 0,
    "offsetY": -32,
    "heightPercent": 100,
    "fadeStart": 78,
    "fadeEnd": 98
  },
  "walter-gotay": {
    "scale": 1.53,
    "offsetX": 0,
    "offsetY": -60,
    "heightPercent": 100,
    "fadeStart": 78,
    "fadeEnd": 98
  },
  "karla-fernandez-soto": {
    "scale": 2.2,
    "offsetX": 0,
    "offsetY": 109,
    "heightPercent": 100,
    "fadeStart": 40,
    "fadeEnd": 60
  },
  "geraldine-santiago-then": {
    "scale": 1.44,
    "offsetX": 0,
    "offsetY": -49,
    "heightPercent": 100,
    "fadeStart": 78,
    "fadeEnd": 98
  },
  "lizandra-parra-rodriguez": {
    "scale": 2.2,
    "offsetX": 0,
    "offsetY": 102,
    "heightPercent": 100,
    "fadeStart": 40,
    "fadeEnd": 60
  },
  "yisel-pupo": {
    "scale": 1.63,
    "offsetX": 0,
    "offsetY": 0,
    "heightPercent": 100,
    "fadeStart": 50,
    "fadeEnd": 81
  },
  "solanch-rodriguez-curbeira": {
    "scale": 1.73,
    "offsetX": 0,
    "offsetY": 7,
    "heightPercent": 100,
    "fadeStart": 50,
    "fadeEnd": 80
  },
  "albin-machado-campo": {
    "scale": 1.63,
    "offsetX": 0,
    "offsetY": -50,
    "heightPercent": 100,
    "fadeStart": 56,
    "fadeEnd": 92
  },
  "ivonne-medina": {
    "scale": 1.74,
    "offsetX": 0,
    "offsetY": -29,
    "heightPercent": 100,
    "fadeStart": 67,
    "fadeEnd": 87
  },
  "maria-mendez": {
    "scale": 1.33,
    "offsetX": -33,
    "offsetY": 7,
    "heightPercent": 100,
    "fadeStart": 72,
    "fadeEnd": 90
  },
  "rosa-mustelier-jimenez": {
    "scale": 1.68,
    "offsetX": 0,
    "offsetY": 0,
    "heightPercent": 100,
    "fadeStart": 63,
    "fadeEnd": 84
  }
};

export const MOBILE_PROFILE_FRAMING: Record<string, ProfileAgentFraming> = {
  "yeilen-contreras": {
    "scale": 2.2,
    "offsetX": -32,
    "offsetY": 39,
    "heightPercent": 100,
    "fadeStart": 56,
    "fadeEnd": 67
  },
  "yenny-mendoza-molina": {
    "scale": 2.2,
    "offsetX": -20,
    "offsetY": 38,
    "heightPercent": 100,
    "fadeStart": 53,
    "fadeEnd": 69
  },
  "dianelis-segrea-castellon": {
    "scale": 1.7,
    "offsetX": -24,
    "offsetY": 37,
    "heightPercent": 100,
    "fadeStart": 70,
    "fadeEnd": 78
  },
  "marien-rodriguez-reyes": {
    "scale": 1.49,
    "offsetX": -16,
    "offsetY": -32,
    "heightPercent": 100,
    "fadeStart": 73,
    "fadeEnd": 88
  },
  "claudia-aguilera-cuenca": {
    "scale": 1.7,
    "offsetX": -20,
    "offsetY": -50,
    "heightPercent": 100,
    "fadeStart": 67,
    "fadeEnd": 90
  },
  "yazbel-diaz": {
    "scale": 2.16,
    "offsetX": 0,
    "offsetY": -49,
    "heightPercent": 100,
    "fadeStart": 66,
    "fadeEnd": 81
  },
  "javier-ferrer-rodriguez": {
    "scale": 1.37,
    "offsetX": -18,
    "offsetY": 0,
    "heightPercent": 100,
    "fadeStart": 72,
    "fadeEnd": 91
  },
  "leidys-herrera": {
    "scale": 2.2,
    "offsetX": 0,
    "offsetY": 99,
    "heightPercent": 100,
    "fadeStart": 51,
    "fadeEnd": 62
  },
  "dahana-aguila": {
    "scale": 1.33,
    "offsetX": 0,
    "offsetY": -32,
    "heightPercent": 100,
    "fadeStart": 78,
    "fadeEnd": 98
  },
  "walter-gotay": {
    "scale": 1.53,
    "offsetX": 0,
    "offsetY": -60,
    "heightPercent": 100,
    "fadeStart": 78,
    "fadeEnd": 98
  },
  "karla-fernandez-soto": {
    "scale": 2.2,
    "offsetX": 0,
    "offsetY": 109,
    "heightPercent": 100,
    "fadeStart": 40,
    "fadeEnd": 60
  },
  "geraldine-santiago-then": {
    "scale": 1.44,
    "offsetX": 0,
    "offsetY": -49,
    "heightPercent": 100,
    "fadeStart": 78,
    "fadeEnd": 98
  },
  "lizandra-parra-rodriguez": {
    "scale": 2.2,
    "offsetX": 0,
    "offsetY": 102,
    "heightPercent": 100,
    "fadeStart": 40,
    "fadeEnd": 60
  },
  "yisel-pupo": {
    "scale": 1.63,
    "offsetX": 0,
    "offsetY": 0,
    "heightPercent": 100,
    "fadeStart": 50,
    "fadeEnd": 81
  },
  "solanch-rodriguez-curbeira": {
    "scale": 1.73,
    "offsetX": 0,
    "offsetY": 7,
    "heightPercent": 100,
    "fadeStart": 50,
    "fadeEnd": 80
  },
  "albin-machado-campo": {
    "scale": 1.63,
    "offsetX": 0,
    "offsetY": -50,
    "heightPercent": 100,
    "fadeStart": 56,
    "fadeEnd": 92
  },
  "ivonne-medina": {
    "scale": 1.74,
    "offsetX": 0,
    "offsetY": -29,
    "heightPercent": 100,
    "fadeStart": 67,
    "fadeEnd": 87
  },
  "maria-mendez": {
    "scale": 1.33,
    "offsetX": -33,
    "offsetY": 7,
    "heightPercent": 100,
    "fadeStart": 72,
    "fadeEnd": 90
  },
  "rosa-mustelier-jimenez": {
    "scale": 1.68,
    "offsetX": 0,
    "offsetY": 0,
    "heightPercent": 100,
    "fadeStart": 63,
    "fadeEnd": 84
  }
};

const STORAGE_KEY_PROFILE_DESKTOP = 'agent_profile_framing_desktop_v2';
const STORAGE_KEY_PROFILE_MOBILE = 'agent_profile_framing_mobile_v2';

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


