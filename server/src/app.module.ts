import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true, // ⚠️ apenas para dev — cuidado em produção
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
