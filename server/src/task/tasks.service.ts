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
      return await this.taskRepository.find({
        relations: ['column'],
        order: {
          columnId: 'ASC',
          isPinned: 'DESC', // Tarefas fixadas aparecem primeiro
          order: 'ASC', // Depois, pelo campo de ordenação
        },
      });
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
      throw new InternalServerErrorException('Erro ao buscar tasks');
    }
  }

  async create(createTaskDto: CreateTaskDto) {
    const { columnId, isPinned } = createTaskDto;

    // Busca a última posição (maior order) na coluna
    const lastTask = await this.taskRepository.findOne({
      where: { columnId },
      order: { order: 'DESC' },
    });

    const order = lastTask ? lastTask.order + 1 : 0;

    const task = this.taskRepository.create({
      ...createTaskDto,
      isPinned: isPinned ?? false,
      order,
    });

    return this.taskRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Atualiza os campos recebidos
    Object.assign(task, updateTaskDto);

    // Atualiza coluna se necessário
    if (updateTaskDto.columnId && updateTaskDto.columnId !== task.columnId) {
      const newColumn = await this.columnsRepository.findOne({
        where: { id: updateTaskDto.columnId },
      });

      if (!newColumn) {
        throw new NotFoundException('Column not found');
      }

      task.column = newColumn;
      task.columnId = newColumn.id;
    }

    // Atualiza order se passado explicitamente (drag-and-drop)
    if (typeof updateTaskDto.order === 'number') {
      task.order = updateTaskDto.order;
    }

    // Atualiza is_pinned se passado
    if (typeof updateTaskDto.isPinned === 'boolean') {
      task.isPinned = updateTaskDto.isPinned;
    }

    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}
