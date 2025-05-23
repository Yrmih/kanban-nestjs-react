import { IsOptional, IsString, IsEnum, IsInt, IsBoolean } from 'class-validator';
import { TaskStatus } from '../task.entity';

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

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

/**
 * DTO para atualização de tarefa
 */
