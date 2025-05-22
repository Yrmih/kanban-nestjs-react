import api from "../api/api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'testing' | 'done';
  columnId: number;  // campo usado pelo backend para indicar a coluna
}

export interface Column {
  id: number;
  title: string;
}

const TASKS_BASE_PATH = '/tasks';
const COLUMNS_BASE_PATH = '/columns';

// Buscar todas as tarefas
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>(TASKS_BASE_PATH);
  return response.data;
};

// Criar uma nova tarefa
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await api.post<Task>(TASKS_BASE_PATH, taskData);
  return response.data;
};

// 🔄 Atualizar tarefa com PATCH (agora compatível com o novo backend)
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await api.patch<Task>(`${TASKS_BASE_PATH}/${id}`, taskData);
  return response.data;
};

// Atualizar somente o status da tarefa (opcional, pode ser mantido ou fundido com o updateTask)
export const updateTaskStatus = async (id: string, status: Task['status']): Promise<Task> => {
  const response = await api.patch<Task>(`${TASKS_BASE_PATH}/${id}`, { status });
  return response.data;
};

// Deletar tarefa
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`${TASKS_BASE_PATH}/${id}`);
};

// Buscar todas as colunas
export const getColumns = async (): Promise<Column[]> => {
  const response = await api.get<Column[]>(COLUMNS_BASE_PATH);
  return response.data;
};
