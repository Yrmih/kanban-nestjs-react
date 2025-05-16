import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// CreateTaskDto,
//   CreateTaskOutPutDto,
//   GetTasksOutputDto,
//   UpdateTasksOrderDto
import { CreateTaskDto } from './dto/create-task.input.dto';
import { CreateTaskOutPutDto } from './dto/create-task-output.dto';
import { GetTasksOutputDto } from './dto/get-tasks-output.dto';
import { UpdateTaskInputDto } from './dtos/update-task-input.dto';
import { Task } from './task.entity';
import { SubTask } from 'src/subtasks/entities/subtask.entity';
import { Column } from './entities/column.entity';
import { TaskMapper } from './task.mapper';
import { TaskStatus } from './task-status.enum';
import { UpdateTasksOrderDto } from './dto/update-tasks-order';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(SubTask)
    private readonly subTaskRepository: Repository<SubTask>,
    @InjectRepository(Column) private readonly columnRepository: Repository<Column>
  ) {}

  async createTask(data: CreateTaskDto): Promise<CreateTaskOutPutDto> {
    const { columnId, title, description, subTasks } = data;

    // Verifica se a coluna existe
    const column = await this.columnRepository.findOne(columnId);
    if (!column) throw new NotFoundException('Column not found');

    // Pega última task ordenada para calcular a nova ordem
    const lastTask = await this.taskRepository.findOne({
      where: { column: column },
      order: { order: 'DESC' }
    });

    // Cria a nova task
    const task = this.taskRepository.create({
      name: title,
      description,
      order: lastTask ? lastTask.order + 1 : 1,
      column,
      subtasks: subTasks.map(st => this.subTaskRepository.create({ name: st.title }))
    });

    const savedTask = await this.taskRepository.save(task);

    return TaskMapper.toHttpTask(savedTask);
  }

  async getTasks(boardId: string): Promise<GetTasksOutputDto[]> {
    // Busca colunas com tasks e subtasks
    const columns = await this.columnRepository.find({
      where: { boardId },
      relations: ['tasks', 'tasks.subtasks'],
      order: {
        tasks: {
          order: 'ASC'
        }
      }
    });

    // Mapear as tasks para o formato HTTP pode ficar no Controller ou aqui,
    // dependendo da sua arquitetura
    return columns.flatMap((column) =>
      column.tasks.map((task) => TaskMapper.toHttpTask(task)),
    );
  }

  async updateTask(data: UpdateTaskInputDto & { id: string }): Promise<GetTasksOutputDto> {
    const { id, columnId, title, description, subTasks } = data;

    const task = await this.taskRepository.findOne(id, { relations: ['subtasks', 'column'] });
    if (!task) throw new NotFoundException('Task not found');

    const column = await this.columnRepository.findOne(columnId);
    if (!column) throw new NotFoundException('Column not found');

    // Atualiza task
    task.name = title;
    task.description = description;

    // Atualiza coluna e ordem, se mudou de coluna
    if (task.column.id !== columnId) {
      // Pega última task da nova coluna para ajustar ordem
      const lastTask = await this.taskRepository.findOne({
        where: { column },
        order: { order: 'DESC' }
      });

      task.order = lastTask ? lastTask.order + 1 : 1;
      task.column = column;
    }

    // Atualiza subtasks - lógica para deletar e criar/update subtasks
    // IDs recebidos são os que devem continuar, os outros deletar
    const incomingSubTaskIds = subTasks.filter(st => st.id).map(st => st.id);
    const subtasksToDelete = task.subtasks.filter(st => !incomingSubTaskIds.includes(st.id));

    // Deleta subtasks removidas
    if (subtasksToDelete.length) {
      await this.subTaskRepository.remove(subtasksToDelete);
    }

    // Atualiza e cria subtasks
    for (const st of subTasks) {
      if (st.id) {
        // Atualiza existente
        const existing = task.subtasks.find(sub => sub.id === st.id);
        if (existing) {
          existing.name = st.title;
          await this.subTaskRepository.save(existing);
        }
      } else {
        // Cria nova
        const newSubtask = this.subTaskRepository.create({ name: st.title, task });
        await this.subTaskRepository.save(newSubtask);
      }
    }

    const updatedTask = await this.taskRepository.save(task);

    return TaskMapper.toHttpTask(updatedTask);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findOne(id);
    if (!task) throw new NotFoundException('Task not found');

    await this.taskRepository.remove(task);
  }

  async updateTaskOrder({
    id,
    destinationColumnId,
    newOrder
  }: UpdateTasksOrderDto & { id: string }): Promise<void> {
    const task = await this.taskRepository.findOne(id, { relations: ['column'] });
    if (!task) throw new NotFoundException('Task Not Found');

    const oldColumnId = task.column.id;
    const oldOrder = task.order;

    if (destinationColumnId === oldColumnId && newOrder === oldOrder) return;

    if (oldColumnId === destinationColumnId) {
      // Reordenar dentro da mesma coluna
      if (oldOrder < newOrder) {
        await this.taskRepository
          .createQueryBuilder()
          .update(Task)
          .set({ order: () => '"order" - 1' })
          .where(
            'columnId = :columnId AND order > :oldOrder AND order <= :newOrder',
            { columnId: oldColumnId, oldOrder, newOrder },
          )
          .execute();
      } else {
        await this.taskRepository
          .createQueryBuilder()
          .update(Task)
          .set({ order: () => '"order" + 1' })
          .where(
            'columnId = :columnId AND order >= :newOrder AND order < :oldOrder',
            { columnId: oldColumnId, oldOrder, newOrder },
          )
          .execute();
      }

      task.order = newOrder;
      await this.taskRepository.save(task);
      return;
    }

    // Mudança entre colunas
    // Ajusta ordem na coluna antiga
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ order: () => '"order" - 1' })
      .where('columnId = :oldColumnId AND order > :oldOrder', { oldColumnId, oldOrder })
      .execute();

    // Ajusta ordem na coluna destino
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ order: () => '"order" + 1' })
      .where('columnId = :destinationColumnId AND order >= :newOrder', { destinationColumnId, newOrder })
      .execute();

    // Atualiza a task movida
    task.order = newOrder;
    task.column = await this.columnRepository.findOne(destinationColumnId);
    await this.taskRepository.save(task);
  }

  async getTasksFromColumn(columnId: string): Promise<GetTasksOutputDto[]> {
    const tasks = await this.taskRepository.find({
      where: { column: { id: columnId } },
      relations: ['subtasks'],
      order: { order: 'ASC' },
    });

    return tasks.map((task) => TaskMapper.toHttpTask(task));
  }

  async changeStatusTask(taskId: string, columnId: string): Promise<void> {
    const task = await this.taskRepository.findOne(taskId, { relations: ['column'] });
    if (!task) throw new NotFoundException('Task not found');

    const lastTask = await this.taskRepository.findOne({
      where: { column: { id: columnId } },
      order: { order: 'DESC' }
    });

    const newColumn = await this.columnRepository.findOne(columnId);
    if (!newColumn) throw new NotFoundException('Column not found');

    task.column = newColumn;
    task.order = lastTask ? lastTask.order + 1 : 1;

    //  Aqui você atualiza o status conforme o nome da coluna
    switch (newColumn.name.toLowerCase()) {
      case 'to do':
        task.status = TaskStatus.TODO;
        break;
      case 'in progress':
        task.status = TaskStatus.IN_PROGRESS;
        break;
      case 'done':
        task.status = TaskStatus.DONE;
        break;
      default:
        task.status = TaskStatus.TODO; // fallback
    }

    await this.taskRepository.save(task);
  }
}