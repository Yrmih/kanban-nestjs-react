import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnsupportedMediaTypeException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/user/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import { User } from 'src/user/user.entity';
import { GetProfileOutputDto } from 'src/user/dtos';
import { RegisterUserDto } from './dto/register-user.dto';

interface JwtPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async save(dto: RegisterUserDto): Promise<User> {
    const conflict = await this.usersService.findByEmail(dto.email);
    if (conflict) {
      throw new ConflictException('User already exists');
    }

    const saltRounds = parseInt(this.configService.get('SALT_ROUNDS') ?? '10', 10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    let avatarUrl: string | null = null;
    if (dto.avatar) {
      try {
        const avatar = await this.cloudinaryService.uploadImage(dto.avatar);
        avatarUrl = avatar.secure_url;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new UnsupportedMediaTypeException('Failed to upload avatar');
      }
    }

    return this.usersService.create({
      email: dto.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
      name: dto.name,
      avatarUrl: avatarUrl ?? undefined,
    });
  }

  public async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({ sub: user.id, email: user.email }),
      this.generateRefreshToken({ sub: user.id }),
    ]);

    await this.refreshTokenService.saveOrUpdate({
      userId: user.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  public async getProfile(id: string): Promise<GetProfileOutputDto> {
    const profile = await this.usersService.getProfile(id);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  public async refreshToken(
    user: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({ sub: user.sub, email: user.email }),
      this.generateRefreshToken({ sub: user.sub }),
    ]);

    await this.refreshTokenService.saveOrUpdate({
      userId: user.sub,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  public async logout(userId: string): Promise<void> {
    await this.refreshTokenService.deleteAllRefreshTokensForUser(userId);
  }

  private async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  private generateRefreshToken(payload: Pick<JwtPayload, 'sub'>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }
}
