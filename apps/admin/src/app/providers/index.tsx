import type { PropsWithChildren } from 'react';
import { ThemeProvider, ToastProvider } from '@central-pet/ui';

/** Admin composition root — Design System providers only. */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultMode="system">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
