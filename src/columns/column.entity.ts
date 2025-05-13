import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnDecorator,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { Board } from 'src/boards/board.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnDecorator()
  name: string;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' }) // 👈 aqui
  board: Board;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
