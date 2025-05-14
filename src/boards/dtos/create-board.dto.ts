import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateBoardDto {
  title: string;
  description: string;
  columnId: number;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  userId: string;
  @IsArray()
  columns: Array<{ id?: string; name: string }>;
}
