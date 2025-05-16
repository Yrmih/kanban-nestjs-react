import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, GetProfileOutputDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<void> {
    const user = this.userRepository.create({
      email: data.email,
      password: data.password,
      name: data.name,
      avatarUrl: data.avatarUrl ?? null,
    });

    await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async getProfile(id: string): Promise<GetProfileOutputDto | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        boards: {
          columns: true,
        },
      },
    });

    if (!user) return null;

    // Ajustar para só retornar os campos esperados no GetProfileOutputDto
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      boards: user.boards.map((board) => ({
        id: board.id,
        name: board.name,
        columns: board.columns.map((column) => ({
          id: column.id,
          name: column.name,
        })),
      })),
    };
  }
}
