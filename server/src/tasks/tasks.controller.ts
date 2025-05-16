import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.input.dto';
import { UpdateTaskInputDto } from './dto/update-task-status.dto';
import { UpdateTasksOrderDto } from './dto/update-tasks-order';

//  CreateTaskDto,
//   UpdateTaskInputDto,
//   UpdateTasksOrderDto,

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() data: CreateTaskDto) {
    return this.tasksService.createTask(data);
  }

  // Pega todas as tasks do board (ex: /tasks/board/:boardId)
  @Get('board/:boardId')
  async getTasks(@Param('boardId', ParseUUIDPipe) boardId: string) {
    return this.tasksService.getTasks(boardId);
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateTaskInputDto,
  ) {
    return this.tasksService.updateTask({ id, ...data });
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseUUIDPipe) id: string) {
    await this.tasksService.deleteTask(id);
    return { message: 'Task deleted successfully' };
  }

  // Atualizar ordem e coluna da task (drag and drop)
  @Put(':id/order')
  async updateTaskOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateTasksOrderDto,
  ) {
    await this.tasksService.updateTaskOrder({ id, ...data });
    return { message: 'Task order updated successfully' };
  }

  // Mudar status da task (mover coluna)
  @Put(':id/status/:columnId')
  async changeStatusTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
  ) {
    await this.tasksService.changeStatusTask(id, columnId);
    return { message: 'Task status changed successfully' };
  }
}
