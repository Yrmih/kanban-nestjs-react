import { Controller, Get, Post, Body } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dtos/create-column.dto';
import { ColumnEntity } from './column.entity';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  findAll(): Promise<ColumnEntity[]> {
    return this.columnsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateColumnDto): Promise<ColumnEntity> {
    return this.columnsService.create(dto);
  }
}
