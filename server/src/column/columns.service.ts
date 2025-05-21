import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Columns } from './columns.entity';

@Injectable()
export class ColumnsService implements OnModuleInit {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
  ) {}

  private defaultColumns = ['todo', 'processing', 'done', 'backlogged'];

  async onModuleInit() {
    const existingColumns = await this.columnsRepository.find();
    const existingTitles = existingColumns.map((col) => col.title);

    const missingColumns = this.defaultColumns.filter((title) => !existingTitles.includes(title));

    if (missingColumns.length > 0) {
      const newColumns = missingColumns.map((title) => this.columnsRepository.create({ title }));
      await this.columnsRepository.save(newColumns);
      console.log(`Colunas criadas: ${missingColumns.join(', ')}`);
    } else {
      console.log('Todas as colunas padrão já existem no banco');
    }
  }

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
