import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
  }

  setUser(user: unknown): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser<T>(): T | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? (JSON.parse(userData) as T) : null;
    }
    return null;
  }

  removeUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}

