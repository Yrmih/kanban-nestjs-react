import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.input.dto';
import { CreateTaskOutPutDto } from './dto/create-task-output.dto';
import { GetTasksOutputDto } from './dto/get-tasks-output.dto';
import { UpdateTaskInputDto } from './dto/update-task-status.dto';
import { UpdateTasksOrderDto } from './dto/update-tasks-order';
import { Task } from './task.entity';
import { SubTask } from 'src/subtasks/subtask.entity';
import { TaskMapper } from './task.mapper';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(SubTask)
    private readonly subTaskRepository: Repository<SubTask>,
  ) { }

  // cria task vinculando ao boardId (sem coluna)
  async createTask(data: CreateTaskDto): Promise<CreateTaskOutPutDto> {
    const { boardId, title, description, subTasks } = data;

    // pegar última task do board para ordenar
    const lastTask = await this.taskRepository.findOne({
      where: { boardId },
      order: { order: 'DESC' }
    });

    const task = this.taskRepository.create({
      name: title,
      description,
      order: lastTask ? lastTask.order + 1 : 1,
      boardId,
      subtasks: subTasks.map(st => this.subTaskRepository.create({ name: st.title }))
    });

    const taskCreated = await this.taskRepository.save(task);

    return TaskMapper.toHttpTask(taskCreated);
  }

  // pega todas as tasks do board
  async getTasks(boardId: string): Promise<GetTasksOutputDto[]> {
    const tasks = await this.taskRepository.find({
      where: { boardId },
      relations: ['subtasks'],
      order: { order: 'ASC' }
    });

    return tasks.map(TaskMapper.toHttpTask);
  }

  // update da task
  async updateTask(data: UpdateTaskInputDto & { id: string }): Promise<GetTasksOutputDto> {
    const { id, boardId, title, description, subTasks } = data;

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['subtasks']
    });
    if (!task) throw new NotFoundException('Task not found');

    // atualiza dados básicos
    task.name = title;
    task.description = description;

    // Se precisar atualizar boardId, ajusta aqui (se fizer sentido)
    task.boardId = boardId;

    // Filtrar subtasks que vieram na atualização
    const existingSubTaskIds = subTasks
      .filter((st) => st.id)
      .map((st) => st.id);

    // Deletar subtasks que não estão no payload
    await this.subTaskRepository.delete({
      task: { id },
      id: Not(In(existingSubTaskIds.length ? existingSubTaskIds : ['']))
    });

    // Atualizar e criar subtasks
    for (const subTaskDto of subTasks) {
      if (subTaskDto.id) {
        // update
        await this.subTaskRepository.update(subTaskDto.id, { name: subTaskDto.title });
      } else {
        // create
        const newSubTask = this.subTaskRepository.create({
          name: subTaskDto.title,
          task
        });
        await this.subTaskRepository.save(newSubTask);
      }
    }

    const updatedTask = await this.taskRepository.save(task);

    return TaskMapper.toHttpTask(updatedTask);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    await this.taskRepository.delete(id);
  }

  // atualizar ordem da task dentro do mesmo board (sem coluna)
  async updateTaskOrder({
    id,
    newOrder,
    boardId
  }: UpdateTasksOrderDto & { id: string }): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (task.order === newOrder) return;

    // pega todas as tasks do board que estão entre as ordens
    const minOrder = Math.min(task.order, newOrder);
    const maxOrder = Math.max(task.order, newOrder);

    const tasksToUpdate = await this.taskRepository.find({
      where: {
        boardId,
        order: In(Array.from({ length: maxOrder - minOrder + 1 }, (_, i) => i + minOrder))
      }
    });

    // reajusta a ordem das tasks
    for (const t of tasksToUpdate) {
      if (t.id === id) {
        t.order = newOrder;
      } else if (task.order < newOrder) {
        // task foi pra frente => decrementa as outras
        if (t.order > task.order && t.order <= newOrder) t.order--;
      } else {
        // task foi pra trás => incrementa as outras
        if (t.order < task.order && t.order >= newOrder) t.order++;
      }
    }

    await this.taskRepository.save(tasksToUpdate);
  }

  // Pega tasks por board e retorna mapeado
  async getTasksFromBoard(boardId: string): Promise<GetTasksOutputDto[]> {
    const tasks = await this.taskRepository.find({
      where: { boardId },
      relations: ['subtasks'],
      order: { order: 'ASC' }
    });

    return tasks.map(TaskMapper.toHttpTask);
  }

  // Muda status da task alterando o boardId e colocando a task no final da lista
  async changeStatusTask(taskId: string, boardId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const lastTask = await this.taskRepository.findOne({
      where: { boardId },
      order: { order: 'DESC' }
    });

    task.boardId = boardId;
    task.order = lastTask ? lastTask.order + 1 : 1;

    await this.taskRepository.save(task);
  }
}
