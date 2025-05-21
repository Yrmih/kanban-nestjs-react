import { DataSource } from 'typeorm';
import { Task } from '../task/task.entity';
import { Columns } from '../column/columns.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'kanban_db',
  entities: [Task, Columns],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
