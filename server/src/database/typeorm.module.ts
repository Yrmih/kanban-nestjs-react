import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // NÃO use synchronize quando for usar migrations, para evitar perder dados
        // synchronize: false,
        logging: true,
        migrations: [__dirname + '/../migrations/*{.ts,.js}'], // pasta das migrations
        migrationsRun: true, // faz rodar as migrations automaticamente ao iniciar (opcional)
      }),
    }),
  ],
})
export class DatabaseModule {}
