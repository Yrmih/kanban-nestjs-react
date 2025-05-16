import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTask } from './subtask.entity';

// Importa o DTO de saída
import { UpdateStatusSubTaskOutPutDto } from './dtos/update-status-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(SubTask)
    private readonly subTaskRepository: Repository<SubTask>,
  ) {}

  async updateSubTaskStatus(
    subTaskId: string,
    isDone: boolean,
  ): Promise<UpdateStatusSubTaskOutPutDto> {
    const existingSubTask = await this.subTaskRepository.findOne({
      where: { id: subTaskId },
    });

    if (!existingSubTask) {
      throw new NotFoundException('Subtask not found');
    }

    existingSubTask.isDone = isDone;

    const updatedSubTask = await this.subTaskRepository.save(existingSubTask);

    // Aqui você mapeia o retorno para o formato que o DTO exige
    return {
      id: updatedSubTask.id,
      name: updatedSubTask.name, // garante que isso exista na entidade SubTask
      isDone: updatedSubTask.isDone,
    };
  }
}
