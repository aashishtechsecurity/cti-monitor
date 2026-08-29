export type TlpLevel = 'TLP:CLEAR' | 'TLP:GREEN' | 'TLP:AMBER' | 'TLP:AMBER+STRICT' | 'TLP:RED';

export interface TlpBadgeConfig {
  label: TlpLevel;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export function getTlpBadgeStyle(level: TlpLevel): TlpBadgeConfig {
  switch (level) {
    case 'TLP:CLEAR':
      return { label: 'TLP:CLEAR', bgColor: 'rgba(248, 250, 252, 0.12)', borderColor: '#cbd5e1', textColor: '#f8fafc' };
    case 'TLP:GREEN':
      return { label: 'TLP:GREEN', bgColor: 'rgba(74, 222, 128, 0.15)', borderColor: '#4ade80', textColor: '#4ade80' };
    case 'TLP:AMBER':
      return { label: 'TLP:AMBER', bgColor: 'rgba(249, 115, 22, 0.15)', borderColor: '#f97316', textColor: '#f97316' };
    case 'TLP:AMBER+STRICT':
      return { label: 'TLP:AMBER+STRICT', bgColor: 'rgba(234, 179, 8, 0.15)', borderColor: '#eab308', textColor: '#eab308' };
    case 'TLP:RED':
      return { label: 'TLP:RED', bgColor: 'rgba(239, 68, 68, 0.18)', borderColor: '#ef4444', textColor: '#f87171' };
    default:
      return { label: 'TLP:CLEAR', bgColor: 'rgba(248, 250, 252, 0.12)', borderColor: '#cbd5e1', textColor: '#f8fafc' };
  }
}
