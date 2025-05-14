import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnDecorator,
  ManyToOne,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('subtasks')
export class SubTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnDecorator()
  title: string;

  @ColumnDecorator({ default: false })
  isDone: boolean;

  @ManyToOne(() => Task, (task) => task.subTasks, { onDelete: 'CASCADE' })
  task: Task;
}
