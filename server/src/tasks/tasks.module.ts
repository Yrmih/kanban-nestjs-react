import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule
import { Task } from './task.entity'; // Importa a entidade Task
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // Registra a entidade para injeção do repositório
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
