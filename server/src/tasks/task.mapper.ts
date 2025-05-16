// task.mapper.ts
import { Task } from './task.entity';
import { GetTasksOutputDto } from './dto/get-tasks-output.dto';

export class TaskMapper {
  static toHttpTask(task: Task): GetTasksOutputDto {
    return {
      id: task.id,
      columnId: task.columnId,
      title: task.title,
      description: task.description,
      statusName: task.statusName,
      order: task.order,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      subTasks: task.subTasks.map((subTask) => ({
        id: subTask.id,
        title: subTask.title,
        isDone: subTask.isDone,
      })),
    };
  }
}
