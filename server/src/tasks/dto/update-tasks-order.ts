import { IsNumber, IsUUID, Min } from 'class-validator';

export class UpdateTasksOrderDto {
  @IsUUID('4')
  boardId: string;

  @IsNumber()
  @Min(0)
  newOrder: number;
}
