import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Unique
} from 'typeorm';
import { Board } from './board.entity';
import { Task } from './task.entity';

@Entity('columns')
@Unique(['name', 'id'])
export class Column {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Board, board => board.columns, { onDelete: 'CASCADE' })
  board: Board;

  @Column()
  boardId: string;

  @OneToMany(() => Task, task => task.column)
  tasks: Task[];
}
