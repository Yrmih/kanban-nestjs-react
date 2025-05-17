import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.input.dto';
import { CreateTaskOutPutDto } from './dto/create-task-output.dto';

import { UpdateTaskInputDto } from './dto/update-task-status.dto';
import { UpdateTasksOrderDto } from './dto/update-tasks-order';
import { Task } from './task.entity';
import { SubTask } from 'src/subtasks/subtask.entity';
import { TaskMapper } from './task.mapper';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(SubTask)
    private readonly subTaskRepository: Repository<SubTask>,
  ) {}

  async createTask(data: CreateTaskDto): Promise<CreateTaskOutPutDto> {
    const { boardId, title, description, subTasks } = data;

    const lastTask = await this.taskRepository.findOne({
      where: { boardId },
      order: { order: 'DESC' },
    });

    const task = this.taskRepository.create({
      title,
      description,
      order: lastTask ? lastTask.order + 1 : 1,
      boardId,
      statusName: TaskStatus.TODO,
      subTasks: subTasks?.map((st) => this.subTaskRepository.create({ title: st.title })) || [],
    });

    const taskCreated = await this.taskRepository.save(task);

    return TaskMapper.toHttpTask(taskCreated);
  }

  async getTasks(boardId: string): Promise<CreateTaskOutPutDto[]> {
    const tasks = await this.taskRepository.find({
      where: { boardId },
      relations: ['subTasks'],
      order: { order: 'ASC' },
    });

    return tasks.map(TaskMapper.toHttpTask);
  }

  // --- Método updateTask corrigido ---
  async updateTask(data: UpdateTaskInputDto & { id: string }): Promise<CreateTaskOutPutDto> {
    const { id, boardId, title, description, subTasks } = data;

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['subTasks'],
    });
    if (!task) throw new NotFoundException('Task not found');

    // Atualiza somente se o campo existir no DTO
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (boardId !== undefined) task.boardId = boardId;

    const existingSubTaskIds = subTasks?.filter((st) => st.id).map((st) => st.id) || [];

    // Deleta subtasks que não estão no array recebido
    if (existingSubTaskIds.length > 0) {
      await this.subTaskRepository.delete({
        task: { id },
        id: Not(In(existingSubTaskIds)),
      });
    } else {
      // Se não tem subtasks no input, apaga todas
      await this.subTaskRepository.delete({ task: { id } });
    }

    // Atualiza subtasks existentes ou cria novas
    for (const subTaskDto of subTasks || []) {
      if (subTaskDto.id) {
        await this.subTaskRepository.update(subTaskDto.id, {
          title: subTaskDto.title,
        });
      } else {
        const newSubTask = this.subTaskRepository.create({
          title: subTaskDto.title,
          task,
        });
        await this.subTaskRepository.save(newSubTask);
      }
    }

    const updatedTask = await this.taskRepository.save(task);

    return TaskMapper.toHttpTask(updatedTask);
  }
  // --- Fim do método corrigido ---

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    await this.taskRepository.delete(id);
  }

  async updateTaskOrder({
    id,
    newOrder,
    boardId,
  }: UpdateTasksOrderDto & { id: string }): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (task.order === newOrder) return;

    const minOrder = Math.min(task.order, newOrder);
    const maxOrder = Math.max(task.order, newOrder);

    const tasksToUpdate = await this.taskRepository.find({
      where: {
        boardId,
        order: In(Array.from({ length: maxOrder - minOrder + 1 }, (_, i) => i + minOrder)),
      },
    });

    for (const t of tasksToUpdate) {
      if (t.id === id) {
        t.order = newOrder;
      } else if (task.order < newOrder) {
        if (t.order > task.order && t.order <= newOrder) t.order--;
      } else {
        if (t.order < task.order && t.order >= newOrder) t.order++;
      }
    }

    await this.taskRepository.save(tasksToUpdate);
  }

  async getTasksFromBoard(boardId: string): Promise<CreateTaskOutPutDto[]> {
    const tasks = await this.taskRepository.find({
      where: { boardId },
      relations: ['subTasks'],
      order: { order: 'ASC' },
    });

    return tasks.map(TaskMapper.toHttpTask);
  }

  async changeStatusTask(taskId: string, boardId: string, columnId?: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const lastTask = await this.taskRepository.findOne({
      where: { boardId },
      order: { order: 'DESC' },
    });

    task.boardId = boardId;
    task.columnId = columnId ?? task.columnId;
    task.order = lastTask ? lastTask.order + 1 : 1;

    await this.taskRepository.save(task);
  }
}
