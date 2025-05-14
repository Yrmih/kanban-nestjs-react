import { IsBoolean } from 'class-validator';

export class UpdateSubTaskStatusDto {
  @IsBoolean()
  isDone: boolean;
}
