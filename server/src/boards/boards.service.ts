import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';
import { EditBoardDto } from './dtos/edit-board.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepo: Repository<Board>,
  ) { }

  async create(dto: CreateBoardDto, userId: string): Promise<Board> {
    const board = this.boardsRepo.create({
      name: dto.name,
      user: { id: userId } as User,
    });

    return this.boardsRepo.save(board);
  }

  async findAllByUser(userId: string): Promise<Board[]> {
    return this.boardsRepo.find({
      where: { user: { id: userId } },
      relations: ['columns'],
    });
  }

  async updateBoard(
    id: string,
    dto: EditBoardDto,
    userId: string,
  ): Promise<Board> {
    const board = await this.boardsRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['columns'],
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    board.name = dto.name;

    // Se houver colunas no DTO, atualiza-as
    if (dto.columns) {
      Board.columns = dto.columns.map((col) => ({
        ...col,
        board,
      }));
    }

    return this.boardsRepo.save(board);
  }

  // Método para deletar o board
  async deleteBoard(id: string, userId: string): Promise<void> {
    const board = await this.boardsRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.boardsRepo.remove(board);
  }
}
