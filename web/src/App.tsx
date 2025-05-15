import { Outlet } from 'react-router-dom';

import { AppProviders } from './shared/components/AppProviders';

export function App() {
	return (
		<AppProviders>
			<Outlet />
		</AppProviders>
	);
}
