// src/subtasks/subtasks.controller.ts
import { Controller, Patch, Param, Body } from '@nestjs/common';
import { SubTasksService } from './subtasks.service';
import { UpdateSubTaskStatusDto } from './dtos/update-subtask-status.dto';

@Controller('subtasks')
export class SubTasksController {
  constructor(private readonly subTasksService: SubTasksService) {}

  @Patch(':id/change-status')
  changeStatus(@Param('id') id: string, @Body() dto: UpdateSubTaskStatusDto) {
    return this.subTasksService.changeStatus(id, dto);
  }
}
