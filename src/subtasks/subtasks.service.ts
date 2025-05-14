import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubTask } from './entities/subtask.entity';

@Injectable()
export class SubTasksService {
  constructor(
    @InjectRepository(SubTask)
    private readonly subTaskRepo: Repository<SubTask>,
  ) {}

  async changeStatus(id: string, isDone: boolean): Promise<SubTask> {
    const subTask = await this.subTaskRepo.findOne({ where: { id } });
    if (!subTask) throw new NotFoundException('Subtask not found');
    subTask.isDone = isDone;
    return this.subTaskRepo.save(subTask);
  }
}
