import { IsString, IsEnum, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsInt()
  columnId: number;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

/**
 * DTO para criação de tarefa
 */
