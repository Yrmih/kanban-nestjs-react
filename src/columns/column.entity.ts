import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnDecorator,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Board } from 'src/boards/board.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnDecorator()
  name: string;

  @ManyToOne(() => ColumnEntity, (column) => column.board)
  columns: ColumnEntity[];

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
