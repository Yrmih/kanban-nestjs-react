
import { create } from 'zustand';
import { getAuthToken } from '../utils/auth';
import type { UserProfile } from '../types';

type AuthState = {
	user: UserProfile | undefined;
	token: string | undefined;
	isAuth: boolean;
	actions: {
		setToken: (token?: string) => void;
		setUser: (user: UserProfile) => void;
		clearAll: () => void;
		setIsAuth: (isAuth: boolean) => void;
	};
};

const AuthStore = create<AuthState>((set) => ({
	token: getAuthToken(),
	user: undefined,
	isAuth: !!getAuthToken(), // já define baseado no token
	actions: {
		setToken: (token?: string) => set({ token }),
		setUser: (user: UserProfile) => set({ user, isAuth: true }),
		clearAll: () => set({ user: undefined, token: undefined, isAuth: false }),
		setIsAuth: (isAuth: boolean) => set({ isAuth })
	}
}));

export const useAuthStore = AuthStore;
export const useAuthStoreActions = () => AuthStore.getState().actions;


// import { create } from 'zustand';

// import { getAuthToken } from '../utils/auth';

// import type { UserProfile } from '../types';

// type AuthState = {
// 	user: UserProfile | undefined;
// 	token: string | undefined;
// 	isAuth: boolean;
// 	actions: {
// 		setToken: (token?: string) => void;
// 		setUser: (user: UserProfile) => void;
// 		clearAll: () => void;
// 		setIsAuth: (isAuth: boolean) => void;
// 	};
// };

// const AuthStore = create<AuthState>((set) => ({
// 	token: getAuthToken(),
// 	user: undefined,
// 	isAuth: false,
// 	actions: {
// 		setToken: (token?: string) => set({ token }),
// 		setUser: (user: UserProfile) => set({ user, isAuth: true }),
// 		clearAll: () => set({ user: undefined, token: undefined, isAuth: false }),
// 		setIsAuth: (isAuth: boolean) => set({ isAuth })
// 	}
// }));

// export const useAuthStore = AuthStore;
// export const useAuthStoreActions = () => AuthStore.getState().actions;
