// task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubTask } from 'src/subtasks/entities/subtask.entity';
import { TaskStatus } from './task-status.enum';
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  columnId: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => SubTask, (subTask) => subTask.task, { cascade: true })
  subTasks: SubTask[];

  // Outros campos tipo statusName, order, createdAt, updatedAt
  @Column()
  statusName: string;

  @Column()
  order: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  statusName: TaskStatus;
}
