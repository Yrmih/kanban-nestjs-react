import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importando o módulo de tarefas e a entidade Task
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    // Configurações globais do .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configurando o TypeORM com o banco de dados PostgreSQL
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (!dbUrl) throw new Error('DATABASE_URL is not defined');

        return {
          type: 'postgres',
          url: dbUrl,
          entities: [Task], // <-- Aqui adicionei a entidade Task
          synchronize: true, // Não usar em produção!
        };
      },
      inject: [ConfigService],
    }),

    TasksModule,
  ],
})
export class AppModule {}
