import axios, { AxiosError, isAxiosError, type AxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const commonOptions: AxiosRequestConfig = {
	baseURL: BASE_URL,
	withCredentials: true, // se não estiver usando cookies, pode remover
	headers: {
		'Content-Type': 'application/json'
	}
};

export const api = axios.create(commonOptions);

// Interceptor de requisição: injeta o token se existir
api.interceptors.request.use((config) => {
	const token = getAuthToken();

	if (token && config.headers) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}

	return config;
}, undefined);

// Mensagens padrão de erro
export const DEFAULT_ERROR_MESSAGES = {
	somethingMessage: '🫤 Ops! Algo deu errado. Tente novamente mais tarde.',
	networkError: '📡 Erro de rede, tente novamente mais tarde.',
	unauthorizedMessage: '🔐 Não autorizado, efetue login novamente.'
} as const;

const mappedErrors: Record<number, string> = {
	400: '⚠️ Requisição inválida.',
	401: DEFAULT_ERROR_MESSAGES.unauthorizedMessage,
	403: '⛔ Acesso negado.',
	404: '🔍 Recurso não encontrado.',
	500: DEFAULT_ERROR_MESSAGES.somethingMessage
};

// Interceptor de resposta: trata mensagens de erro
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<unknown> & { customMessage?: string }) => {
		if (isAxiosError(error)) {
			// Erro de rede
			if (error.code === AxiosError.ERR_NETWORK) {
				error.customMessage = DEFAULT_ERROR_MESSAGES.networkError;
				return Promise.reject(error);
			}

			const status = error.response?.status;

			// Verifica se há uma mensagem no corpo da resposta
			const data = error.response?.data;
			const serverMessage =
				data && typeof data === 'object' &&
				'message' in data &&
				typeof (data as Record<string, unknown>).message === 'string'
					? (data as Record<string, unknown>).message as string
					: null;

			if (status && mappedErrors[status]) {
				error.customMessage = mappedErrors[status];
			} else if (serverMessage) {
				error.customMessage = serverMessage;
			} else {
				error.customMessage = DEFAULT_ERROR_MESSAGES.somethingMessage;
			}

			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);
