import { create } from 'zustand';
import type { Task } from '../context/TaskContext'; // ajuste o caminho se necessário
import * as taskService from '../services/taskService';

interface TaskState {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  
  fetchTasks: async () => {
    const tasks = await taskService.getTasks();
    set({ tasks });
  },

  addTask: async (newTask) => {
    const created = await taskService.createTask(newTask);
    set((state) => ({ tasks: [...state.tasks, created] }));
  },

  updateTask: async (id, data) => {
    const updated = await taskService.updateTask(id, data);
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }));
  },

  removeTask: async (id) => {
    await taskService.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
}));
