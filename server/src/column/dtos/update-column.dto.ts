import { IsString, IsOptional } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  @IsOptional()
  title?: string;
}
