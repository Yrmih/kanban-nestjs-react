import api from "../api/api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'testing' | 'done';
  columnId: number;  // campo usado pelo backend para indicar a coluna
}

// NOVO: interface para coluna (conforme seu backend)
// Cada coluna tem id e title, que vem da tabela columns
export interface Column {
  id: number;
  title: string;
}

const TASKS_BASE_PATH = '/tasks';

// NOVO: base path para columns, só pra organizar
const COLUMNS_BASE_PATH = '/columns';

// Função para pegar todas as tarefas (igual a sua)
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>(TASKS_BASE_PATH);
  return response.data;
};

// Função pra criar tarefa (igual a sua)
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await api.post<Task>(TASKS_BASE_PATH, taskData);
  return response.data;
};

// Função pra atualizar tarefa (igual a sua)
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await api.put<Task>(`${TASKS_BASE_PATH}/${id}`, taskData);
  return response.data;
};

// Função para atualizar só o status da tarefa (igual a sua)
export const updateTaskStatus = async (id: string, status: Task['status']): Promise<Task> => {
  const response = await api.patch<Task>(`${TASKS_BASE_PATH}/${id}/status`, { status });
  return response.data;
};

// Função para deletar tarefa (igual a sua)
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`${TASKS_BASE_PATH}/${id}`);
};

// NOVO: Função para buscar todas as colunas da API
// Use essa função no front para pegar a lista atualizada de colunas com id e title
export const getColumns = async (): Promise<Column[]> => {
  const response = await api.get<Column[]>(COLUMNS_BASE_PATH);
  return response.data;
};
