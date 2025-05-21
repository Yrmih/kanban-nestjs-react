import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Columns } from './columns.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
  ) {}

  findAll(): Promise<Columns[]> {
    return this.columnsRepository.find({ relations: ['tasks'] });
  }

  findOne(id: number): Promise<Columns> {
    return this.columnsRepository.findOneOrFail({
      where: { id },
      relations: ['tasks'],
    });
  }

  create(title: string): Promise<Columns> {
    const column = this.columnsRepository.create({ title });
    return this.columnsRepository.save(column);
  }

  async update(id: number, title?: string): Promise<Columns> {
    await this.columnsRepository.update(id, { title });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.columnsRepository.delete(id);
  }
}
