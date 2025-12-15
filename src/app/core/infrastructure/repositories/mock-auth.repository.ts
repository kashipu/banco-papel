import { Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginCredentials, AuthResponse, User } from '../../domain/entities/user.entity';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthRepository implements AuthRepository {
  private readonly mockUsers: User[] = [
    {
      id: '1',
      email: 'usuario@banco.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+1234567890',
      documentNumber: '12345678',
      createdAt: new Date('2020-01-01')
    }
  ];

  private readonly mockPasswords: Record<string, string> = {
    'usuario@banco.com': 'password123'
  };

  constructor(private storage: StorageService) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.mockUsers.find(u => u.email === credentials.email);
    const password = this.mockPasswords[credentials.email];

    if (!user || password !== credentials.password) {
      throw new Error('Credenciales inválidas');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const response: AuthResponse = { user, token };

    this.storage.setToken(token);
    this.storage.setUser(user);

    return response;
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.storage.clear();
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.storage.getToken();
    if (!token) {
      return null;
    }

    const user = this.storage.getUser<User>();
    if (!user) {
      return null;
    }

    // Verificar que el usuario existe en nuestros datos mock
    return this.mockUsers.find(u => u.id === user.id) || null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = this.storage.getToken();
    const user = await this.getCurrentUser();
    return !!token && !!user;
  }
}

