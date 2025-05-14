// src/subtasks/subtasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubTask } from './entities/subtask.entity';
import { UpdateSubTaskStatusDto } from './dtos/update-subtask-status.dto';

@Injectable()
export class SubTasksService {
  constructor(
    @InjectRepository(SubTask)
    private readonly subTaskRepo: Repository<SubTask>,
  ) {}

  async changeStatus(
    id: string,
    dto: UpdateSubTaskStatusDto,
  ): Promise<SubTask> {
    const subtask = await this.subTaskRepo.findOne({ where: { id } });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    subtask.isDone = dto.isDone;
    return this.subTaskRepo.save(subtask);
  }
}
