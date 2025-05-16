import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      api_key: configService.get<string>('CLOUDINARY_API_KEY')!,
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET')!,
      secure: process.env.NODE_ENV === 'production',
    });

    return cloudinary;
  },
  inject: [ConfigService],
};
