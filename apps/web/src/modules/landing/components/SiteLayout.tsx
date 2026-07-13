import type { PropsWithChildren } from 'react';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { SiteWhatsAppFab } from './SiteWhatsAppFab';

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <SiteHeader />
      <main className="pt-[4.25rem]">{children}</main>
      <SiteFooter />
      <SiteWhatsAppFab />
    </div>
  );
}
