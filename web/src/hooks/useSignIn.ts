import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { signin } from '../services/auth.service'; 
import type { ResponseSignIn, SignInRequest } from '../services/auth.service';

import { api } from '../lib';
import { setAuthToken } from '../utils/auth';

import type { ErrorApi } from '../types';

import { useNotificationToasty } from './useNotificationToasty';

export const useSignInMutation = () => {
	const navigate = useNavigate();
	const { notification } = useNotificationToasty();

	return useMutation<ResponseSignIn, ErrorApi, SignInRequest>({
		mutationFn: (data) => signin(data),
		onSuccess: (data) => {
			api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
			setAuthToken(data.access_token);
			notification('success', 'login success, you are being redirected...', {
				duration: 1000
			});
			setTimeout(() => {
				navigate('/');
			}, 1000);
		},
		onError: (error) => {
			const errorMessage =
				error.response?.data?.message ?? 'Something went wrong';
			notification('error', errorMessage);
		}
	});
};
