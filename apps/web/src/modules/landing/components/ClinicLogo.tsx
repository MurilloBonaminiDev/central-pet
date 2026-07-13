type ClinicLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'light' | 'dark';
};

function LogoMark({ className }: { className?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="8" r="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 14c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-2 5-4 5-4-3.5-4-5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SIZES = {
  sm: { box: 'h-9 w-9', title: 'text-base', tagline: 'text-[10px]' },
  md: { box: 'h-10 w-10', title: 'text-lg', tagline: 'text-xs' },
  lg: { box: 'h-14 w-14', title: 'text-2xl', tagline: 'text-sm' },
} as const;

export function ClinicLogo({
  size = 'md',
  showTagline = true,
  variant = 'dark',
}: ClinicLogoProps) {
  const s = SIZES[size];
  const titleClass = variant === 'light' ? 'text-white' : 'text-[var(--color-fg)]';
  const taglineClass =
    variant === 'light' ? 'text-white/70' : 'text-[var(--color-fg-muted)]';

  return (
    <span className="flex items-center gap-3">
      <span
        className={`flex shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-600)] p-2 text-[var(--color-primary-fg)] shadow-[var(--shadow-sm)] ${s.box}`}
      >
        <LogoMark />
      </span>
      <span className="leading-tight">
        <span className={`block font-display font-semibold tracking-tight ${s.title} ${titleClass}`}>
          Central Pet
        </span>
        {showTagline ? (
          <span className={`hidden sm:block ${s.tagline} ${taglineClass}`}>
            Clínica Veterinária & Pet Shop
          </span>
        ) : null}
      </span>
    </span>
  );
}
