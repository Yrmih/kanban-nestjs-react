import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  public async saveOrUpdate(data: {
    userId: string;
    token: string;
  }): Promise<void> {
    // Primeiro tenta encontrar o token pelo userId
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { userId: data.userId },
    });

    if (existingToken) {
      // Atualiza o token
      existingToken.token = data.token;
      await this.refreshTokenRepository.save(existingToken);
    } else {
      // Cria um novo token
      const newToken = this.refreshTokenRepository.create({
        userId: data.userId,
        token: data.token,
      });
      await this.refreshTokenRepository.save(newToken);
    }
  }

  public async deleteAllRefreshTokensForUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }
}
