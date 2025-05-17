import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from '../user/user.entity';
import { Board } from '../boards/board.entity';
import { Task } from '../tasks/task.entity';
import { SubTask } from '../subtasks/subtask.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // migrations são para isso
  logging: true,
  entities: [User, Board, Task, SubTask, RefreshToken],
  migrations: ['src/database/migrations/*.ts'], // <-- caminho para as migrations
  migrationsRun: false, // controla se executa migrations automaticamente (geralmente false)
});
