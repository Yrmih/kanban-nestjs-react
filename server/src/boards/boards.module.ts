import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from './board.entity'; // Ajuste o caminho conforme necessário

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardsService],
})
export class BoardsModule {}
