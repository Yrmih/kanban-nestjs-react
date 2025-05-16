import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // importa ConfigModule para acessar as variáveis de ambiente
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // ou 'mysql', 'mariadb', etc conforme seu banco
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // onde suas entidades estão
        synchronize: true, // cuidado em produção, use migrations em produção
        logging: true, // para logar queries, similar ao Prisma
      }),
    }),
  ],
})
export class DatabaseModule {}
