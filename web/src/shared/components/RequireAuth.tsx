import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { LoadingPage } from './LoadingPage';

import { useGetProfile } from '../../hooks/useGetProfile';
import { useNotificationToasty } from '../../hooks/useNotificationToasty';

import { getAuthToken } from '../../utils/auth';

export function RequireAuth({ children }: { children: ReactNode }) {
	const { notification } = useNotificationToasty();
	const [token] = useState(() => getAuthToken());
	const { isLoading, error } = useGetProfile(token);

	useEffect(() => {
		if (
			error instanceof AxiosError &&
			error.message === 'GET_PROFILE_TIMEOUT'
		) {
			notification('error', 'O servidor demorou demais para responder 😢');
		}
	}, [error, notification]);

	if (!token || error) {
		return <Navigate to="/auth/login" replace />;
	}

	if (isLoading && !error) {
		return <LoadingPage />;
	}

	return <>{children}</>;
}

// guardião de rota (ótimo pra rotas privadas no React Router DOM)