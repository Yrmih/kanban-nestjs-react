import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnDecorator,
  ManyToOne,
} from 'typeorm';
import { ColumnEntity } from 'src/columns/column.entity'; // Importando a entidade Column

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
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
}
