import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
// Importando o módulo de tarefas e a entidade Task
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    ColumnsModule,
    TasksModule,
    BoardsModule,
    UsersModule,
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
          autoLoadEntities: true,
          synchronize: true, // Não usar em produção!
        };
      },
      inject: [ConfigService],
    }),

    TasksModule,
  ],
})
export class AppModule {}
