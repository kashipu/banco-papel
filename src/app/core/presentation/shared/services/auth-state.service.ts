import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../domain/entities/user.entity';
import { MockAuthRepository } from '../../../infrastructure/repositories/mock-auth.repository';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly authRepo = inject(MockAuthRepository);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    this._isLoading.set(true);
    try {
      const user = await this.authRepo.getCurrentUser();
      this._currentUser.set(user);
    } catch (error) {
      this._currentUser.set(null);
    } finally {
      this._isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<void> {
    this._isLoading.set(true);
    try {
      const response = await this.authRepo.login({ email, password });
      this._currentUser.set(response.user);
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    this._isLoading.set(true);
    try {
      await this.authRepo.logout();
      this._currentUser.set(null);
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this._isLoading.set(false);
    }
  }
}

