

import api from "../api/api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'testing' | 'done';
  columnId: number;  // <-- campo usado pelo backend para indicar a coluna
}

const BASE_PATH = '/tasks';

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>(BASE_PATH);
  return response.data;
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await api.post<Task>(BASE_PATH, taskData);
  return response.data;
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await api.put<Task>(`${BASE_PATH}/${id}`, taskData);
  return response.data;
};

export const updateTaskStatus = async (id: string, status: Task['status']): Promise<Task> => {
  const response = await api.patch<Task>(`${BASE_PATH}/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};
