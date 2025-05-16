/* eslint-disable no-param-reassign */
import axios, { AxiosError, isAxiosError, type AxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const commonOptions: AxiosRequestConfig = {
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
};

export const api = axios.create(commonOptions);

// Interceptor de requisição corrigido
api.interceptors.request.use((config) => {
	const token = getAuthToken();

	if (token) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	return config;
}, undefined);

//  Mensagens padrão de erro
export const DEFAULT_ERROR_MESSAGES = {
	somethingMessage: '🫤 Ops! Something went wrong, please try again later.',
	networkError: '📡 Network error, please try again later.',
	unauthorizedMessage: '🔐 Unauthorized, please login again.'
} as const;

const mappedErrors = {
	500: DEFAULT_ERROR_MESSAGES.somethingMessage,
	401: DEFAULT_ERROR_MESSAGES.unauthorizedMessage
};

// Interceptor de resposta com tratamento de erros
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<Record<string, unknown>>) => {
		if (isAxiosError(error)) {
			if (error.code === AxiosError.ERR_NETWORK) {
				error.message = DEFAULT_ERROR_MESSAGES.networkError;
				return Promise.reject(error);
			}

			if (error.response && !error.response.data?.message) {
				error.message = DEFAULT_ERROR_MESSAGES.somethingMessage;
				return Promise.reject(error);
			}

			if (error.response?.status && error.response.status in mappedErrors) {
				error.message =
					mappedErrors[error.response.status as keyof typeof mappedErrors];
				return Promise.reject(error);
			}

			error.message = typeof error.response?.data?.message === 'string'
				? error.response.data.message
				: error.message;

			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);
