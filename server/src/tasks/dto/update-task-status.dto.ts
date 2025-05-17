import { IsArray, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { SubTaskDto } from './create-task.input.dto';
import { Type } from 'class-transformer';

export class UpdateTaskInputDto {
  @IsOptional()
  @IsString()
  @Length(5, 50)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @IsUUID()
  boardId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubTaskDto)
  subTasks?: SubTaskDto[] = [];
}

// É um Data Transfer Object usado para atualizar o status de uma tarefa com segurança e validação.
// Ele garante que só valores válidos (do enum TaskStatus) sejam aceitos.
// Ou seja, ele recebe a nova informação do status e valida se está dentro do que o sistema espera.
