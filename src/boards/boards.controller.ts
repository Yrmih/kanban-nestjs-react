import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

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
}
// O decorator `@UseGuards(AuthGuard('jwt'))` é usado para proteger as rotas, garantindo que apenas usuários autenticados possam acessá-las.
// O decorator `@GetUser()` é usado para extrair o usuário autenticado do contexto da requisição.
// O decorator `@Body()` é usado para extrair o corpo da requisição, que contém os dados do novo quadro a ser criado.
// O decorator `@Post()` é usado para definir o método HTTP da rota como POST, indicando que ela será usada para criar um novo recurso.
// O decorator `@Get()` é usado para definir o método HTTP da rota como GET, indicando que ela será usada para recuperar recursos existentes.
// O decorator `@Controller('boards')` é usado para definir o prefixo da rota, que neste caso é `/boards`.
// O decorator `@Injectable()` é usado para marcar a classe como um provedor que pode ser injetado em outros componentes do NestJS.
// O decorator `@InjectRepository(Board)` é usado para injetar o repositório do TypeORM para a entidade `Board`, permitindo que você interaja com o banco de dados.
// O decorator `@Body()` é usado para extrair o corpo da requisição, que contém os dados do novo quadro a ser criado.
// O decorator `@GetUser()` é usado para extrair o usuário autenticado do contexto da requisição.
// O decorator `@UseGuards(AuthGuard('jwt'))` é usado para proteger as rotas, garantindo que apenas usuários autenticados possam acessá-las.
// O decorator `@Get()` é usado para definir o método HTTP da rota como GET, indicando que ela será usada para recuperar recursos existentes.
