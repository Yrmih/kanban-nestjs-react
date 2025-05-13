import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task.entity';
import { ColumnEntity } from 'src/columns/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['column'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column'],
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const column = await this.columnRepository.findOne({
      where: { id: String(data.columnId) },
    });

    if (!column) {
      throw new NotFoundException(`Column #${data.columnId} not found`);
    }

    const task = this.taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status ?? TaskStatus.PENDING,
      column,
    });

    return this.taskRepository.save(task);
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (data.columnId) {
      const column = await this.columnRepository.findOne({
        where: { id: data.columnId },
      });

      if (!column) {
        throw new NotFoundException(`Column #${data.columnId} not found`);
      }

      task.column = column;
    }

    task.title = data.title ?? task.title;
    task.description = data.description ?? task.description;
    task.status = data.status ?? task.status;

    return this.taskRepository.save(task);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    task.status = status;
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
