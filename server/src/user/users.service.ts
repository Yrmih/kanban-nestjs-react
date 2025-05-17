import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetProfileOutputDto } from './dtos/get-profile-output.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    // NÃO passar array, só objeto
    const user = this.userRepository.create({
      email: data.email,
      password: data.password,
      name: data.name,
      avatarUrl: data.avatarUrl ?? null, // null permitido na entidade
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getProfile(id: string): Promise<GetProfileOutputDto | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['boards', 'boards.columns'], // garante que columns vêm junto
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
      boards:
        user.boards?.map((board) => ({
          id: board.id,
          name: board.name,
          columns: board.columns || [],
        })) || [],
    };
  }
}
