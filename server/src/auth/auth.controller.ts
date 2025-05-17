import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CookieOptions, Response } from 'express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { AuthConstants } from './constants';
import { GetUserProperties } from './decorators';
import { GetProfileOutputDTO, SignInInputDTO, SingUpInputDTO } from './dto';
import { AtJwtAuthGuard, RtJwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  public async login(@Body() dto: SignInInputDTO, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto.email, dto.password);

    const cookieOptions = this.generateCookieOptions();
    return res.cookie(AuthConstants.REFRESH_TOKEN_KEY, refreshToken, cookieOptions).json({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
    }),
  )
  public async register(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(png|jpg|jpeg)/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          fileIsRequired: false,
          exceptionFactory() {
            throw new BadRequestException(
              'File too large (max 5MB) or invalid file type (png, jpg, jpeg) only',
            );
          },
        }),
    )
    avatar: Express.Multer.File,
    @Body() dto: SingUpInputDTO,
  ): Promise<void> {
    await this.authService.save({ ...dto, avatar });
  }

  @UseGuards(AtJwtAuthGuard)
  @Get('profile')
  public async getProfile(@GetUserProperties('sub') userId: string): Promise<GetProfileOutputDTO> {
    const profile = await this.authService.getProfile(userId);

    // Caso precise mapear boards para garantir a propriedade columns
    const mappedProfile: GetProfileOutputDTO = {
      ...profile,
      boards: profile.boards.map((board) => ({
        id: board.id,
        name: board.name,
        columns: board.columns ?? [], // garante que columns exista como array
      })),
    };

    return mappedProfile;
  }

  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refresh(
    @GetUserProperties() user: { exp: number; sub: string; email: string },
    @Res() res: Response,
  ) {
    if (user.exp * 1000 < Date.now()) throw new ForbiddenException('Token expired');

    const { accessToken, refreshToken } = await this.authService.refreshToken(user);

    return res
      .cookie(AuthConstants.REFRESH_TOKEN_KEY, refreshToken, this.generateCookieOptions())
      .json({ access_token: accessToken, refresh_token: refreshToken });
  }

  @UseGuards(AtJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  public async verifyToken(): Promise<void> {
    return Promise.resolve();
  }

  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  public async logout(
    @GetUserProperties('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userId);

    res.clearCookie(AuthConstants.REFRESH_TOKEN_KEY, {
      ...this.generateCookieOptions(),
      maxAge: 0, // delete cookie
    });
  }

  private generateCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'none',
      maxAge: this.configService.get<number>('MAX_AGE_COOKIE'), // 7 days
      secure: true, // this.configService.get('NODE_ENV') === 'production' // true in production
    };
  }
}
