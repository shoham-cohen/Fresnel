import { Platform } from 'react-native';

// The start of a line in RTL (right). Android and iOS swap 'left' and 'right' when the app is RTL,
// so 'left' already means start there. Web does not swap, so it needs 'right'.
export const textAlignStart = Platform.OS === 'web' ? 'right' : 'left';

// From the Figma screens.
export const colors = {
  background: '#F8FBFF',
  surface: '#E8F1FC',
  header: '#102B4D',
  onHeader: '#FFFFFF',
  border: '#D7E4F2',
  divider: '#E6EDF6',
  input: '#FFFFFF',
  iconBackground: '#D6E3F2',
  activeTabBorder: '#C2CEDD',
  text: '#102B4D',
  textMuted: '#5B6B80',
  primary: '#0A7AFF',
  onPrimary: '#FFFFFF',
  danger: '#D93025',
  backdrop: 'rgba(0, 0, 0, 0.35)',
  navy: '#0E2B47',
  cardBorder: '#E2E8F0',
  cardBackground: '#FFFFFF',
  track: '#E5E7EB',
  indicator: '#64748B',
};

export const severityColors = {
  critical: '#D93025',
  high: '#F28C28',
  medium: '#F4C430',
  low: '#9E9E9E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 26,
};
