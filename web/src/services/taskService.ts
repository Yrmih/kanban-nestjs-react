import api from '../api/axios';
import type { Task } from '../context/TaskContext';
 

export const getTasks = async () => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>) => {
  const response = await api.post<Task>('/tasks', task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  const response = await api.put<Task>(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
