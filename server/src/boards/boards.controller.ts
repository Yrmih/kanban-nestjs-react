import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('boards')
export class BoardController {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.boards, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column('jsonb', { nullable: true })
  columns?: { id: string; name: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
