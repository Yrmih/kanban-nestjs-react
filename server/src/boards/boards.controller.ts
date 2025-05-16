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
import { User } from 'src/user/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.boardsService.findAllByUser(user.id);
  }

  @Post()
  create(@Body() dto: CreateBoardDto, @GetUser() user: User) {
    return this.boardsService.create(dto, user.id);
  }

  @Patch(':id/update')
  update(
    @Param('id') boardId: string,
    @Body() dto: EditBoardDto,
    @GetUser() user: User,
  ) {
    return this.boardsService.updateBoard(boardId, dto, user.id);
  }

  @Delete(':id/delete')
  delete(@Param('id') boardId: string, @GetUser() user: User) {
    return this.boardsService.deleteBoard(boardId, user.id);
  }
}
