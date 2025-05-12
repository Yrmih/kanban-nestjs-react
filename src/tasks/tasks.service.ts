import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Column } from 'src/columns/column.entity'; // Importar a entidade Column
import { CreateTaskDto } from './dto/create-task.dto'; // O DTO que você ajustou

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Column)
    private readonly columnRepository: Repository<Column>, // Injetar o repositório da Column
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column'], // Garantir que a coluna associada à tarefa seja carregada
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const column = await this.columnRepository.findOne({
      where: { id: data.columnId },
    });

    if (!column) {
      throw new NotFoundException(`Column #${data.columnId} not found`);
    }

    const task = this.taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      column, // Relacionar a tarefa à coluna
    });

    return this.taskRepository.save(task);
  }

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);

    if (data.columnId) {
      const column = await this.columnRepository.findOne({
        where: { id: data.columnId },
      });
      if (!column) {
        throw new NotFoundException(`Column #${data.columnId} not found`);
      }
      task.column = column; // Atualizar a coluna da tarefa
    }

    task.title = data.title || task.title;
    task.description = data.description || task.description;
    task.status = data.status || task.status;

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
