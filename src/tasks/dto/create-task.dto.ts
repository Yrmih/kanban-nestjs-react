import { IsString, IsOptional, IsIn, IsInt } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: TaskStatus;

  @IsInt()
  columnId: number;
}
