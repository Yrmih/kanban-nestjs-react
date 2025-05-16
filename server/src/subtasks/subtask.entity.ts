// sub-task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from 'src/tasks/task.entity';

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
  name: string;
}
