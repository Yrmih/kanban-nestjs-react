import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

/**
 * Representa uma coluna do Kanban (ex: To Do, In Progress, Done)
 */
@Entity('columns')
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
