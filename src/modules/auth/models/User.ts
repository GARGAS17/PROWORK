export enum UserRole {
  EMPRESA = 'empresa',
  FREELANCER = 'freelancer',
  ADMIN = 'admin',
}

export interface User {
  id?: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}
