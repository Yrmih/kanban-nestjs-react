import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(data: CreateBoardDto): Promise<Board> {
    const user = await this.userRepo.findOneBy({ id: data.userId });
    if (!user) throw new Error('User not found');

    const board = this.boardRepo.create({ name: data.name, user });
    return this.boardRepo.save(board);
  }
}
