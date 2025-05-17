import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { UsersService } from 'src/user/users.service';
import { AuthConstants } from '../constants';
import { JwtPayload } from '../types/auth.types';
import { AuthenticatedUser } from '../types/auth.types';

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, AuthConstants.RT_JWT_KEY) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    const options: StrategyOptionsWithRequest = {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      jwtFromRequest: RtJwtStrategy.ExtractJwt,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET') ?? '',
      passReqToCallback: true,
      ignoreExpiration: true,
    };

    super(options);
  }

  public async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<(AuthenticatedUser & { refreshToken: string | null }) | null> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) return null;

    const refreshToken: string | null = RtJwtStrategy.ExtractJwt(req);

    return {
      ...payload,
      refreshToken,
    };
  }

  static ExtractJwt(req: Request): string | null {
    const cookies = req.cookies as Record<string, string> | undefined;
    return cookies?.refresh_token ?? null;
  }
}
