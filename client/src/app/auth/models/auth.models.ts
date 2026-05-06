export type AuthRole = 'USER' | 'ADMIN';

export interface User {
  id?: number;
  fullname?: string;
  email: string;
  role: AuthRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string | null;
  username: string;
  role: AuthRole;
}

export interface StoredAuthSession {
  token: string;
  user: User;
}
