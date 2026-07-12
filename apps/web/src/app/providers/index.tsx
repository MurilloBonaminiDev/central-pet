import type { PropsWithChildren } from 'react';
import { ThemeProvider, ToastProvider } from '@central-pet/ui';
import { AuthProvider } from '@modules/auth';

/** App providers: Design System + Authentication session. */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultMode="system">
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
