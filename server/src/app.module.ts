import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/typeorm.module';
import { TaskModule } from './task/tasks.module';
import { ColumnsModule } from './column/columns.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, TaskModule, ColumnsModule],
})
export class AppModule {}
