
import { create } from 'zustand';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  boards: string[];
};

type UserState = {
  users: UserProfile[];
  setUsers: (users: UserProfile[]) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
