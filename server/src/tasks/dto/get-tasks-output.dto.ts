export interface CreateTaskOutPutDto {
  id: string;
  title: string;
  description?: string | null;
  boardId: string;
  subTasks: Array<{
    id: string;
    title: string;
    isDone: boolean;
  }>;
}
