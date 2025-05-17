import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { SaveOrUpdateRefreshTokenDto } from './dtos/save-or-update-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  // Usa o DTO tipado aqui
  public async saveOrUpdate(data: SaveOrUpdateRefreshTokenDto): Promise<void> {
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { userId: data.userId },
    });

    if (existingToken) {
      existingToken.token = data.token;
      await this.refreshTokenRepository.save(existingToken);
    } else {
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
