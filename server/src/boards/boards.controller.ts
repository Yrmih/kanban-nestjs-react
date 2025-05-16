import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { CreateBoardInputDto } from './dtos/create-board-input.dto';
import { UpdateBoardOutPutDto } from './dtos/update-board-output.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';
import { UpdateBoardInputDto } from './dtos';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.boardsService.findAllByUser(user.id);
  }

  @Post()
  create(@Body() dto: CreateBoardInputDto, @GetUser() user: User) {
    return this.boardsService.create({ ...dto, userId: user.id });
  }

  @Patch(':id/update')
  update(
    @Param('id') boardId: string,
    @Body() dto: UpdateBoardInputDto,
    @GetUser() user: User,
  ): Promise<UpdateBoardOutPutDto> {
    // Passa tudo junto no objeto, conforme service
    return this.boardsService.update({ ...dto, boardId });
  }

  @Delete(':id/delete')
  delete(@Param('id') boardId: string, @GetUser() user: User) {
    // Aqui pode passar só o id, mas se quiser verificar user, terá que alterar service
    return this.boardsService.delete(boardId);
  }
}
