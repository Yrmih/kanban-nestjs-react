import type { BoardType } from "../stores/active-board-store";

export const mockBoards: BoardType[] = [
  {
    id: 'b1',
    name: 'Projeto Kanban',
    columns: [
      { id: 'c1', name: 'A Fazer' },
      { id: 'c2', name: 'Fazendo' },
      { id: 'c3', name: 'Feito' },
    ]
  },
];
