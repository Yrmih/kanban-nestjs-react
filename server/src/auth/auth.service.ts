import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { User } from 'src/user/user.entity';
import { GetProfileOutputDto } from 'src/user/dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async save(dto: {
    email: string;
    password: string;
    name: string;
    avatar?: Express.Multer.File;
  }): Promise<User> {
    const conflict = await this.usersService.findByEmail(dto.email);
    if (conflict) throw new ConflictException('User already exists');

    const saltRounds = parseInt(this.configService.get('SALT_ROUNDS'));
    const hash = await bcrypt.hash(dto.password, saltRounds);

    let imageUrl: string | null = null;
    if (dto.avatar) {
      const avatar = await this.cloudinaryService.uploadImage(dto.avatar).catch(() => {
        throw new UnsupportedMediaTypeException('Failed to upload avatar');
      });
      imageUrl = avatar.secure_url;
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: hash,
      name: dto.name,
      avatarUrl: imageUrl ?? undefined,
    });

    return user;
  }

  public async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const credentialsIsValid = await this.validateCredentials(email, password);
    if (!credentialsIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: credentialsIsValid.id,
        email: credentialsIsValid.email,
      }),
      this.generateRefreshToken({
        sub: credentialsIsValid.id,
      }),
    ]);

    await this.refreshTokenService.saveOrUpdate({
      userId: credentialsIsValid.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  public async getProfile(id: string): Promise<GetProfileOutputDto> {
    return await this.usersService.getProfile(id);
  }

  public async refreshToken(user: any) {
    const [newAccessToken, updatedRefreshToken] = await Promise.all([
      this.generateAccessToken({ sub: user.sub, email: user.email }),
      this.generateRefreshToken({ sub: user.sub }),
    ]);

    await this.refreshTokenService.saveOrUpdate({
      userId: user.sub,
      token: updatedRefreshToken,
    });

    return { accessToken: newAccessToken, refreshToken: updatedRefreshToken };
  }

  public async logout(userId: string) {
    await this.refreshTokenService.deleteAllRefreshTokensForUser(userId);
  }

  private async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) return null;

    return user;
  }

  private async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  private async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }
}
