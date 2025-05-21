import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Columns } from '../column/columns.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Columns)
    private readonly columnsRepository: Repository<Columns>,
  ) {}

  async findAll() {
    try {
      return await this.taskRepository.find({ relations: ['column'] });
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
      throw new InternalServerErrorException('Erro ao buscar tasks');
    }
  }

  create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['column'] });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Atualiza os campos recebidos
    Object.assign(task, updateTaskDto);

    // Se o DTO incluir columnId, atualiza a coluna
    if (updateTaskDto.columnId) {
      const column = await this.columnsRepository.findOne({
        where: { id: updateTaskDto.columnId },
      });
      if (!column) {
        throw new NotFoundException('Column not found');
      }
      task.column = column;
    }

    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}
