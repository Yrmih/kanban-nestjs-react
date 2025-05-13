import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnDecorator,
  ManyToOne,
} from 'typeorm';
import { ColumnEntity } from 'src/columns/column.entity'; // Importando a entidade Column
import { User } from 'src/users/users.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnDecorator({ length: 100 })
  title: string;

  @ColumnDecorator({ nullable: true })
  description?: string;

  @ColumnDecorator({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ManyToOne(() => ColumnEntity, (column) => column.tasks, {
    onDelete: 'CASCADE',
    eager: true, // opcional: carrega automaticamente a coluna relacionada
  })
  column: ColumnEntity;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  user: User;
  // opcional: carrega automaticamente o usuário relacionado
}
