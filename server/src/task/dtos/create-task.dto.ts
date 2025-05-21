import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsInt()
  columnId: number;
}

/**
 * DTO para criação de tarefa
 */
