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

  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      email: data.email,
      password: data.password,
      name: data.name,
      ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
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
      // relations: { boards: { columns: true } }, // <- descomente quando tiver Board
    });

    if (!user) return null;

    const { name, email, avatarUrl } = user;

    return {
      id: user.id,
      name,
      email,
      avatarUrl,
      boards: [], // <- substituir quando a entidade `Board` estiver pronta
    };
  }
}
