import { IsOptional, IsString, IsIn, IsUUID } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.input.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}
//TODO e PEDING são a mesma coisa.
