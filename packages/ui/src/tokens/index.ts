export const typography = {
  display: {
    fontFamily: 'var(--font-display)',
    weights: [500, 600, 700],
  },
  sans: {
    fontFamily: 'var(--font-sans)',
    weights: [400, 500, 600, 700],
  },
  scale: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
    '3xl': 'var(--text-3xl)',
    '4xl': 'var(--text-4xl)',
  },
} as const;

export const colorRoles = [
  'brand',
  'accent',
  'surface',
  'content',
  'line',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
] as const;

export const spacingScale = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const;
