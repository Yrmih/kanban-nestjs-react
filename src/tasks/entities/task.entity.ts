import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TaskStatus = 'pending' | 'in-progress' | 'done';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: TaskStatus;
}
