export interface JwtPayload {
  sub: string;
  email: string;
}
// Essa interface é usada para definir o payload do JWT, que contém informações sobre o usuário autenticado.
// O campo `sub` geralmente representa o ID do usuário, enquanto `email` contém o endereço de e-mail do usuário.
// Essa interface é utilizada em várias partes do código, como na estratégia JWT e no serviço de autenticação, para garantir que o payload do token siga a mesma estrutura.
// Isso ajuda a manter a consistência e a segurança ao lidar com tokens JWT em toda a aplicação.
// A interface `JwtPayload` é uma parte importante do sistema de autenticação, pois define a estrutura dos dados que serão incluídos no token JWT.
