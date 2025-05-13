import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { CreateColumnDto } from './dtos/create-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async findAll(): Promise<ColumnEntity[]> {
    return this.columnRepository.find({
      relations: ['tasks'], // inclui tarefas relacionadas
    });
  }

  async create(data: CreateColumnDto): Promise<ColumnEntity> {
    const column = this.columnRepository.create(data);
    return this.columnRepository.save(column);
  }
}
