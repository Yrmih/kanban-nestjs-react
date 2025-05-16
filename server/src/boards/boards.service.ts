import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { Column } from 'src/columns/column.entity';
import { CreateBoardInputDto, UpdateBoardInputDto, UpdateBoardOutPutDto } from './dtos';
import { User } from 'src/user/user.entity';

@Injectable()
export class BoardsService {
  findAllByUser(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Column)
    private readonly columnRepository: Repository<Column>,
  ) {}

  async create(data: CreateBoardInputDto & { userId: string }): Promise<void> {
    const existingBoard = await this.boardRepository.findOne({
      where: { name: data.name, user: { id: data.userId } },
      relations: ['user'],
    });

    if (existingBoard) {
      throw new ConflictException('Board already exists');
    }

    const board = this.boardRepository.create({
      name: data.name,
      user: { id: data.userId } as User, // cast porque só queremos o id
    });

    const savedBoard = await this.boardRepository.save(board);

    if (data?.initialColumns?.length) {
      const columns = data.initialColumns.map((name) =>
        this.columnRepository.create({ name, board: savedBoard }),
      );
      await this.columnRepository.save(columns);
    }
  }

  async update(data: UpdateBoardInputDto & { boardId: string }): Promise<UpdateBoardOutPutDto> {
    const { boardId, name, columns } = data;

    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['columns'],
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Atualiza o nome
    board.name = name;
    await this.boardRepository.save(board);

    const incomingIds = new Set(columns.filter(c => c.id).map(c => c.id));

    // Apagar colunas que foram removidas
    const columnsToDelete = board.columns.filter(
      (col) => col.id && !incomingIds.has(col.id),
    );
    if (columnsToDelete.length > 0) {
      await this.columnRepository.remove(columnsToDelete);
    }

    // Atualizar ou criar colunas
    for (const col of columns) {
      if (col.id) {
        await this.columnRepository.update(col.id, { name: col.name });
      } else {
        const newColumn = this.columnRepository.create({
          name: col.name,
          board,
        });
        await this.columnRepository.save(newColumn);
      }
    }

    const updatedBoard = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['columns'],
    });

    return {
      name: updatedBoard.name,
      columns: updatedBoard.columns.map((column) => ({
        id: column.id,
        name: column.name,
      })),
    };
  }

  async delete(id: string): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.boardRepository.delete(id);
  }
}
