import axios, { AxiosError, isAxiosError, type AxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const commonOptions: AxiosRequestConfig = {
	baseURL: BASE_URL,
	withCredentials: true, // se estiver usando cookies com SameSite, senão pode remover
	headers: {
		'Content-Type': 'application/json'
	}
};

export const api = axios.create(commonOptions);

// Interceptor de requisição
api.interceptors.request.use((config) => {
	const token = getAuthToken();

	if (token && config.headers) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}

	return config;
}, undefined);

// Mensagens padrão de erro
export const DEFAULT_ERROR_MESSAGES = {
	somethingMessage: '🫤 ! Ops! Algo deu errado. Tente novamente mais tarde.',
	networkError: '📡 Erro de rede, tente novamente mais tarde.',
	unauthorizedMessage: '🔐 Não autorizado, efetue login novamente.'
} as const;

const mappedErrors = {
	500: DEFAULT_ERROR_MESSAGES.somethingMessage,
	401: DEFAULT_ERROR_MESSAGES.unauthorizedMessage
};

// Interceptor de resposta
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
				error.message = mappedErrors[error.response.status as keyof typeof mappedErrors];
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
