export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  avatar?: Express.Multer.File;
}
