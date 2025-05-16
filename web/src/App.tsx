
import { Outlet } from 'react-router-dom';

import { AppProviders } from './shared/components/AppProviders';

export function App() {
  return (
    <AppProviders>
      {/* Botão removido */}
      <Outlet />
    </AppProviders>
  );
}
