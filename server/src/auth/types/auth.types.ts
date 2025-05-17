// Define a estrutura dos dados que estarão presentes no token JWT.
// O campo `sub` geralmente representa o ID do usuário.
// O campo `email` representa o e-mail associado ao usuário.
export interface JwtPayload {
  sub: string;
  email: string;
  // Você pode adicionar outros campos que forem incluídos no JWT
}

// Define o objeto `user` que será anexado à requisição após a autenticação com JWT.
// Essa estrutura representa o usuário autenticado disponível no contexto da requisição.
export interface AuthenticatedUser {
  sub: string;
  email: string;
  role?: string; // Campo opcional para controle de acesso baseado em roles (ex: admin, user, etc.)
}
