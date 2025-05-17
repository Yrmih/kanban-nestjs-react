import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  IsUUID,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class SubTaskDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional() // descrição é opcional
  @IsString()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  boardId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubTaskDto)
  subTasks: SubTaskDto[];
}
