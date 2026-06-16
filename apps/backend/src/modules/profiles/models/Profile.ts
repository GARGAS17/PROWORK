export interface Profile {
  id: string; // references users.id
  full_name: string;
  bio?: string;
  avatar_url?: string;
  hourly_rate?: number;
  created_at: Date;
  updated_at: Date;
}
