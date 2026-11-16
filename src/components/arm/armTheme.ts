import { ArmThemeMode, OmniChannel } from '../../types/arm';

export interface ArmPalette {
  mode: ArmThemeMode;
  bgApp: string;
  bgPanel: string;
  bgSubtle: string;
  bgElevated: string;
  bgHeader: string;
  border: string;
  borderStrong: string;
  brand: string;
  brandHover: string;
  brandSoft: string;
  brandBorder: string;
  brandTextOnPrimary: string;
  positiveMoney: string;
  negativeMoney: string;
  stoneSoft: string;
  stoneBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  shadow: string;
  shadowLg: string;
}

const LIGHT_PALETTE: ArmPalette = {
  mode: 'light',
  bgApp: '#FAF7F2',
  bgPanel: '#FFFFFF',
  bgSubtle: '#F4EFE7',
  bgElevated: '#FFFFFF',
  bgHeader: 'rgba(255, 255, 255, 0.96)',
  border: '#E5DDD0',
  borderStrong: '#C9BFA9',
  brand: '#660E1A',
  brandHover: '#7D1222',
  brandSoft: '#F8F1F2',
  brandBorder: 'rgba(102, 14, 26, 0.25)',
  brandTextOnPrimary: '#FFFFFF',
  positiveMoney: '#15803D',
  negativeMoney: '#991B1B',
  stoneSoft: '#F3EFE8',
  stoneBorder: '#D6CFC4',
  text: '#121418',
  textSecondary: '#4B505B',
  textMuted: '#736D66',
  shadow: '0 8px 24px rgba(18, 20, 24, 0.05)',
  shadowLg: '0 18px 40px rgba(18, 20, 24, 0.1)',
};

const DARK_PALETTE: ArmPalette = {
  mode: 'dark',
  bgApp: '#0D1016',
  bgPanel: '#161B24',
  bgSubtle: '#1D2430',
  bgElevated: '#232B39',
  bgHeader: 'rgba(22, 27, 36, 0.96)',
  border: '#2B3548',
  borderStrong: '#3E4C66',
  brand: '#8B1D2C',
  brandHover: '#A32436',
  brandSoft: 'rgba(139, 29, 44, 0.22)',
  brandBorder: 'rgba(212, 175, 55, 0.35)',
  brandTextOnPrimary: '#FFFFFF',
  positiveMoney: '#4ADE80',
  negativeMoney: '#FCA5A5',
  stoneSoft: '#1E2533',
  stoneBorder: '#334155',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  shadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
  shadowLg: '0 24px 52px rgba(0, 0, 0, 0.55)',
};

export function getArmPalette(mode: ArmThemeMode): ArmPalette {
  return mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
}

export function getChannelBadgeStyle(
  channel: OmniChannel,
  mode: ArmThemeMode
): { bg: string; color: string; border: string; label: string } {
  const labelMap: Record<OmniChannel, string> = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    facebook: 'Facebook',
    email: 'Correo',
  };
  return mode === 'dark'
    ? { bg: '#1E2533', color: '#E2E8F0', border: '#334155', label: labelMap[channel] }
    : { bg: '#F3EFE8', color: '#121418', border: '#D6CFC4', label: labelMap[channel] };
}

export function formatUsd(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(safe);
}

/**
 * Generates deterministic 29x29 QR SVG cell coordinates with standard 7x7 corner finders.
 */
export function generateDeterministicQrMatrix(
  seedText: string
): { size: number; cells: Array<{ x: number; y: number }> } {
  const n = 29;
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const cells: Array<{ x: number; y: number }> = [];
  const isFinderArea = (x: number, y: number) =>
    (x < 10 && y < 10) || (x > n - 11 && y < 10) || (x < 10 && y > n - 11);

  for (let y = 2; y < n - 2; y++) {
    for (let x = 2; x < n - 2; x++) {
      if (!isFinderArea(x, y)) {
        const hash = (x * 37 + y * 19 + seed + ((x * y) % 11)) % 3;
        if (hash === 0) {
          cells.push({ x, y });
        }
      }
    }
  }

  return { size: n, cells };
}
