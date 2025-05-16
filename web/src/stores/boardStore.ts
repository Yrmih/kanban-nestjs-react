// stores/boardStore.ts
import { create } from 'zustand';

export type BoardType = {
  id: string;
  name: string;
  columns: {
    id: string;
    name: string;
  }[];
};

type BoardState = {
  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  setBoards: (boards) => set({ boards }),
}));
