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
import { CreateBoardDto } from './dtos/create-board.dto';
import { EditBoardDto } from './dtos/edit-board.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@GetUser() user: User) {
    return this.boardsService.findAllByUser(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateBoardDto, @GetUser() user: User) {
    return this.boardsService.create(dto, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/update')
  async update(
    @Param('id') boardId: string,
    @Body() dto: EditBoardDto,
    @GetUser() user: User,
  ) {
    return this.boardsService.updateBoard(boardId, dto, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/delete')
  async delete(@Param('id') boardId: string, @GetUser() user: User) {
    return this.boardsService.deleteBoard(boardId, user.id);
  }
}
