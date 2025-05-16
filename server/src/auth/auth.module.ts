import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { UsersModule } from 'src/user/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, RtJwtStrategy } from './strategies';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    CloudinaryModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, RefreshTokenService, JwtStrategy, RtJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
