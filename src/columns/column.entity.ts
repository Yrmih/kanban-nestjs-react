import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnDecorator,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnDecorator()
  name: string;

  @ManyToOne(() => ColumnEntity, (column) => column)
  columns: ColumnEntity[];

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
  board: any;
}
