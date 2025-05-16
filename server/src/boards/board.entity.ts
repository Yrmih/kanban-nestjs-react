// src/boards/board.entity.ts
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
export class Board {
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

  @Column({ nullable: true })
  coverUrl?: string; // <- nova coluna para armazenar a imagem da capa

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
