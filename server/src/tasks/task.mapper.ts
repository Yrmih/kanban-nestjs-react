import { CreateTaskOutPutDto } from './dto/create-task-output.dto';
import { Task } from './task.entity';

export class TaskMapper {
  static toHttpTask(this: void, task: Task): CreateTaskOutPutDto {
    return {
      id: task.id,
      title: task.title ?? '', // garante string
      description: task.description ?? null, // pode ser null
      boardId: task.boardId,
      subTasks: task.subTasks.map((subTask) => ({
        id: subTask.id,
        title: subTask.title ?? '',
        isDone: subTask.isDone,
      })),
    };
  }
}
