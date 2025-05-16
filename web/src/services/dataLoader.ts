import { mockTasks } from '../mocks/tasks';
import { mockUser } from '../mocks/users';
import { mockBoards } from '../mocks/boards';
import { api } from '../lib';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';
import { useBoardStore } from '../stores/boardStore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'false';

export async function loadInitialData() {
  if (USE_MOCK) {
    useTaskStore.getState().setTasks(mockTasks);
    useBoardStore.getState().setBoards(mockBoards);
    useUserStore.getState().setUsers([mockUser]);  // ajustei para array
  } else {
    const [tasksRes, boardsRes, usersRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/boards'),
      api.get('/users')
    ]);
    useTaskStore.getState().setTasks(tasksRes.data);
    useBoardStore.getState().setBoards(boardsRes.data);
    useUserStore.getState().setUsers(usersRes.data);
  }
}