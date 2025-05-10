import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;
}
