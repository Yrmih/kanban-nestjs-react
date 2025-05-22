import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ORMColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Columns } from '../column/columns.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ORMColumn()
  title: string;

  @ORMColumn({ nullable: true })
  description?: string;

  @ORMColumn({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ORMColumn()
  columnId: number;

  @ManyToOne(() => Columns, (column) => column.tasks)
  @JoinColumn({ name: 'columnId' })
  column: Columns;

  @ORMColumn()
  order: number; //Adiciona esse campo para ordenar as tasks
}
