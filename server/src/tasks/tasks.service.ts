import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task, TaskStatus } from './entities/task.entity';
import { ColumnEntity } from 'src/columns/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { SubTask } from 'src/subtasks/entities/subtask.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(_id: number) {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateStatus(_id: number, _status: TaskStatus): Task | PromiseLike<Task> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_id: number, _updateData: UpdateTaskDto): Task | PromiseLike<Task> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findOne(_id: number): Task | PromiseLike<Task> {
    throw new Error('Method not implemented.');
  }
  findAll(): Task[] | PromiseLike<Task[]> {
    throw new Error('Method not implemented.');
  }
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

    const validSubTasks = subTasks.filter(
      (sub): sub is SubTask =>
        sub && typeof sub.title === 'string' && typeof sub.isDone === 'boolean',
    );

    const subTaskEntities = validSubTasks.map((sub) =>
      this.subTaskRepo.create({
        title: sub.title,
        isDone: sub.isDone,
        task: savedTask,
      }),
    );

    await this.subTaskRepo.save(subTaskEntities);

    const createdTask = await this.taskRepo.findOne({
      where: { id: savedTask.id },
      relations: ['subTasks', 'column'],
    });

    if (!createdTask) {
      throw new NotFoundException('Task not found after creation');
    }

    return createdTask;
  }
}
