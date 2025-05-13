import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity'; // Certifique-se de importar corretamente

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private handleError(error: unknown, customMessage: string): never {
    if (error instanceof Error) {
      throw new UnauthorizedException(`${customMessage}: ${error.message}`);
    }
    throw new UnauthorizedException(customMessage);
  }

  async register(dto: RegisterDto) {
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    } catch (error: unknown) {
      this.handleError(error, 'Password hashing failed');
    }

    // Certifique-se de que o tipo de 'user' é 'User' para evitar problemas de tipagem
    const user: User = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto) {
    let user: User | null; // Tipagem explícita do 'user' como User ou null
    try {
      user = await this.usersService.findByEmail(dto.email);
    } catch (error: unknown) {
      this.handleError(error, 'User not found');
    }

    if (!user) throw new UnauthorizedException('Invalid credentials');

    let passwordValid: boolean;
    try {
      passwordValid = await bcrypt.compare(dto.password, user.password);
    } catch (error: unknown) {
      this.handleError(error, 'Password comparison failed');
    }

    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email }; // 'sub' deve ser string
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
