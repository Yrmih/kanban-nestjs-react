import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly base64FormatString = 'data:image/png;base64,';

  constructor(private readonly configService: ConfigService) {}

  public async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      throw new InternalServerErrorException('File is required');
    }

    const extension = this.extractFileExtension(file);
    const fileToUpload = this.transformFileToUpload(file);

    try {
      const result = await cloudinary.uploader.upload(fileToUpload, {
        format: extension,
        folder: this.configService.get<string>('CLOUDINARY_FOLDER'),
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Cloudinary upload error:', error.message);
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Upload to Cloudinary failed');
    }
  }

  private transformFileToUpload(file: Express.Multer.File): string {
    if (!file) throw new InternalServerErrorException('File is undefined or null');

    const buffer = file.buffer;
    if (!(buffer instanceof Buffer)) {
      throw new InternalServerErrorException('File buffer is missing or invalid');
    }

    const base64Image = buffer.toString('base64');
    return `${this.base64FormatString}${base64Image}`;
  }

  private extractFileExtension(file: Express.Multer.File): string {
    if (!file) throw new InternalServerErrorException('File is undefined or null');

    const mimetype = file.mimetype;
    if (typeof mimetype !== 'string') {
      throw new InternalServerErrorException('Invalid file mimetype');
    }

    const parts = mimetype.split('/');
    if (parts.length !== 2) {
      throw new InternalServerErrorException('Invalid mimetype format');
    }

    return parts[1];
  }
}
