import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  title: string;
  description: string;
  columnId: number;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  userId: string;
}
