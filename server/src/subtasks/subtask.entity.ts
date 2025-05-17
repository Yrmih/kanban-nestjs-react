import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class SubTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: false })
  isDone: boolean;

  @ManyToOne(() => Task, (task) => task.subTasks)
  task: Task;

  @Column()
  name: string;
}
