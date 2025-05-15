import { create } from "zustand";

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
}));
