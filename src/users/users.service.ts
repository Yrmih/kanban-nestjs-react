import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, GetProfileOutputDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(data);
    return await this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async getProfile(id: string): Promise<GetProfileOutputDto | null> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: {
        boards: {
          columns: true
        }
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      boards: user.boards.map(board => ({
        id: board.id,
        name: board.name,
        columns: board.columns.map(column => ({
          id: column.id,
          name: column.name
        }))
      }))
    };
  }
}
