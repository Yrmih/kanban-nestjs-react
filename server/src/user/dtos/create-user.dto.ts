export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string; // só opcional, sem o null
}
