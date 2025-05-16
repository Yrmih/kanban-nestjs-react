import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { SubTask } from './subtask.entity';
import { Column as ColumnEntity } from './column.entity';

@Entity('tasks')
@Index(['columnId', 'id'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  statusName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  order: number;

  @ManyToOne(() => ColumnEntity, column => column.tasks, { onDelete: 'CASCADE' })
  column: ColumnEntity;

  @Column()
  columnId: string;

  @OneToMany(() => SubTask, subtask => subtask.task)
  subtasks: SubTask[];
}
