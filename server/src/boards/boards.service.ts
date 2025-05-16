// src/boards/boards.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardInputDto, UpdateBoardInputDto } from './dtos';
import { UpdateBoardOutPutDto } from './dtos';
import { User } from 'src/user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAllByUser(userId: string): Promise<Board[]> {
    return this.boardRepository.find({ where: { userId } });
  }

  async create(data: CreateBoardInputDto & { userId: string }): Promise<void> {
    const existingBoard = await this.boardRepository.findOne({
      where: { name: data.name, userId: data.userId },
    });

    if (existingBoard) {
      throw new ConflictException('Board already exists');
    }

    const columns = (data.initialColumns || []).map((name) => ({
      id: uuidv4(),
      name,
    }));

    const board = this.boardRepository.create({
      name: data.name,
      user: { id: data.userId } as User,
      userId: data.userId,
      columns,
    });

    await this.boardRepository.save(board);
  }

  async update(
    data: UpdateBoardInputDto & { boardId: string },
  ): Promise<UpdateBoardOutPutDto> {
    const { boardId, name, columns } = data;

    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) throw new NotFoundException('Board not found');

    board.name = name;

    board.columns = columns.map((col) => ({
      id: col.id || uuidv4(),
      name: col.name,
    }));

    const updatedBoard = await this.boardRepository.save(board);

    return {
      name: updatedBoard.name,
      columns: updatedBoard.columns || [],
    };
  }

  async delete(id: string): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) throw new NotFoundException('Board not found');

    await this.boardRepository.delete(id);
  }

  async updateBoardCover(boardId: string, imageUrl: string, userId: string) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId, userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found or unauthorized');
    }

    board.coverUrl = imageUrl;
    return this.boardRepository.save(board);
  }
}
