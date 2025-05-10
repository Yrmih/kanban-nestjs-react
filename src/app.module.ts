import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// Importando o ConfigModule
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
// Importando o módulo de tarefas
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Usando o ConfigModule
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis acessíveis globalmente
      envFilePath: '.env', // Local do arquivo .env
    }),

    // Configurando o TypeORM com a URL do banco de dados da variável de ambiente
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (!dbUrl) throw new Error('DATABASE_URL is not defined');

        return {
          type: 'postgres',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          url: dbUrl,
          entities: [],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TasksModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
