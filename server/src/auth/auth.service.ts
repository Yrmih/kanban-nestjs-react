import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity'; // Certifique-se de que esse tipo existe

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto): Promise<{ user: User; accessToken: string }> {
    const hashedPassword: string = await bcrypt.hash(dto.password, 10);

    const user: User = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto): Promise<{ user: User; accessToken: string }> {
    const user: User | null = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid: boolean = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
