// context/TaskContext.tsx

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import * as taskService from '../services/taskService';

// Aqui, não usamos columnId no frontend, só status para filtrar e organizar
export type TaskStatus = 'pending' | 'in_progress' | 'testing' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  // columnId foi removido aqui, pois não usamos no frontend, só no backend
}

interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      // Se quiser, pode mapear para remover columnId e deixar só o status aqui
      setTasks(data.map(({id, title, description, status}) => ({ id, title, description, status })));
    } catch (error) {
      console.error('fetchTasks:', error);
      toast.error('Erro ao carregar tarefas');
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await taskService.createTask(task);
      setTasks(prev => [...prev, { id: newTask.id, title: newTask.title, description: newTask.description, status: newTask.status }]);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error) {
      console.error('addTask:', error);
      toast.error('Erro ao adicionar tarefa');
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, task);
      setTasks(prev => prev.map(t => (t.id === updatedTask.id ? { id: updatedTask.id, title: updatedTask.title, description: updatedTask.description, status: updatedTask.status } : t)));
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('updateTask:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Tarefa deletada com sucesso!');
    } catch (error) {
      console.error('deleteTask:', error);
      toast.error('Erro ao deletar tarefa');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
