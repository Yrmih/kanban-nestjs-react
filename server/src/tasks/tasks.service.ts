import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ColumnEntity } from 'src/columns/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { SubTask } from 'src/subtasks/entities/subtask.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(ColumnEntity)
    private readonly columnRepo: Repository<ColumnEntity>,

    @InjectRepository(SubTask)
    private readonly subTaskRepo: Repository<SubTask>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, columnId, subTasks = [] } = createTaskDto;

    const column = await this.columnRepo.findOne({ where: { id: columnId } });
    if (!column) throw new NotFoundException('Column not found');

    const task = this.taskRepo.create({
      title,
      description,
      column,
    });

    const savedTask = await this.taskRepo.save(task);

    const subTaskEntities = subTasks.map((sub: { title: any; isDone: any }) =>
      this.subTaskRepo.create({
        title: sub.title,
        isDone: sub.isDone,
        task: savedTask,
      }),
    );

    await this.subTaskRepo.save(subTaskEntities);

    return this.taskRepo.findOne({
      where: { id: savedTask.id },
    });
  }
}
