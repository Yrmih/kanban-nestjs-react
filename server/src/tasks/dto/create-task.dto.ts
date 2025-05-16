// create-task.dto.ts
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubTaskDto } from 'src/subtasks/dtos/sub-task.dto';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  columnId: string; // Se sua entidade Task tem coluna associada

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubTaskDto)
  subTasks: SubTaskDto[];
}
