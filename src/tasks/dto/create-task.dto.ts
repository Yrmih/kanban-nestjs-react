import { IsString, IsOptional, IsIn } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: TaskStatus;
}
