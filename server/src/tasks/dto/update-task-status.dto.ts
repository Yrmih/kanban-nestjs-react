import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
// É um Data Transfer Object usado para atualizar o status de uma tarefa com segurança e validação.
// Ele garante que só valores válidos (do enum TaskStatus) sejam aceitos.
// Ou seja, ele recebe a nova informação do status e valida se está dentro do que o sistema espera.
