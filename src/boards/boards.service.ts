import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepo: Repository<Board>,
  ) {}

  async create(dto: CreateBoardDto, userId: string): Promise<Board> {
    const board = this.boardsRepo.create({
      name: dto.name,
      user: { id: userId } as User, // 👈 evita o findOne
    });

    return this.boardsRepo.save(board);
  }

  async findAllByUser(userId: string): Promise<Board[]> {
    return this.boardsRepo.find({
      where: { user: { id: userId } },
      relations: ['columns'],
    });
  }
}
