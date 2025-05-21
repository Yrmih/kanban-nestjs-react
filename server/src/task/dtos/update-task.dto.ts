import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { TaskStatus } from '../task.entity'; // importa o enum

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  columnId?: number;
}

/**
 * DTO para atualização de tarefa
 */
