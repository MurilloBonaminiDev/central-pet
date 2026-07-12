import { AppProviders } from '@app/providers';
import { AppRouter } from '@app/router';

/** Application shell only — no product pages yet. */
export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
