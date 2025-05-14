import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTask } from './entities/subtask.entity';
import { SubTasksService } from './subtasks.service';
import { SubTasksController } from './subtasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubTask])],
  controllers: [SubTasksController],
  providers: [SubTasksService],
  exports: [SubTasksService],
})
export class SubTasksModule {}
