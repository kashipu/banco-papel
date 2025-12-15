export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  documentNumber: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

