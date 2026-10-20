export const REALITY = {
  real: 'real',
  simulation: 'simulation',
} as const;

export type Reality = (typeof REALITY)[keyof typeof REALITY];
