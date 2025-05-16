import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { ColumnEntity } from 'src/columns/column.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.boards, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => ColumnEntity, (column: ColumnEntity) => column.board, {
    cascade: true,
  })
  columns: ColumnEntity[];
  static columns: { board: Board; id?: string; name: string; }[];
}
