import { create } from "zustand";
import { USE_MOCK } from "../config"; // um mock pra testar o front 
import { mockTasks } from "../mocks/tasks";
// Defina o tipo Task aqui ou importe se já tiver
type Task = {
  id: string;
  name: string;
  description?: string;
  // adicione outras propriedades conforme seu modelo
};

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  loadTasks: () => Promise<void>; // do mock
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  addTask: (task: Task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId: string, updatedTask: Task) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      ),
    })),
  deleteTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
    loadTasks: async () => {
    if (USE_MOCK) {
      // Simula um delay opcional
      await new Promise((r) => setTimeout(r, 300));
      set({ tasks: mockTasks });
    } else {
      // Aqui vai o fetch real quando o backend estiver pronto
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: data });
    }
  }
}));
