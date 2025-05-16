export class GetProfileOutputDto {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  boards: {
    id: string;
    name: string;
    columns: {
      id: string;
      name: string;
    }[];
  }[];
}
