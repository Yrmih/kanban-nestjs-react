import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/users.entity';

import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as User;
  },
);

// O decorator `@GetUser()` é usado para extrair o usuário autenticado do contexto da requisição.
// Ele é criado usando a função `createParamDecorator` do NestJS.
// O decorator pode ser aplicado a métodos de manipuladores de rotas em controladores, permitindo acessar o usuário autenticado diretamente como um parâmetro do método.
