import { createParamDecorator } from '@nestjs/common';

export const GetUserProperties = createParamDecorator(
  (data: string | undefined, req) => {
    const request = req.switchToHttp().getRequest();
    const user = request.user;
    return data ? user && user?.[data] : user;
  },
);


// O decorator `@GetUser()` é usado para extrair o usuário autenticado do contexto da requisição.
// Ele é criado usando a função `createParamDecorator` do NestJS.
// O decorator pode ser aplicado a métodos de manipuladores de rotas em controladores, permitindo acessar o usuário autenticado diretamente como um parâmetro do método.
