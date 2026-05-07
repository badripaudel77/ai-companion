import { Injectable } from '@angular/core';
import { AuthResponse, StoredAuthSession, User } from '../models/auth.models';

const AUTH_STORAGE_KEY = 'my-companion-auth';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  saveSession(response: AuthResponse, user: User): void {
    if (!response.token) {
         return;
    }
    const session: StoredAuthSession = {
        token: response.token,
        user
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  readSession(): StoredAuthSession | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<StoredAuthSession>;
      if (!parsed.token || !parsed.user?.email || !parsed.user?.role) {
            this.clearSession();
            return null;
      }
      if (this.isTokenExpired(parsed.token)) {
            this.clearSession();
            return null;
      }
      return parsed as StoredAuthSession;
    }
    catch {
          this.clearSession();
          return null;
    }
  }

  readToken(): string | null {
      return this.readSession()?.token ?? null;
  }

  hasValidSession(): boolean {
      return this.readSession() !== null;
  }

  clearSession(): void {
      localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private isTokenExpired(token: string): boolean {
    const segments = token.split('.');
    if (segments.length !== 3) {
         return false;
    }
    try {
      const payload = JSON.parse(this.decodeBase64Url(segments[1])) as { exp?: number };
      if (!payload.exp) {
          return false;
      }
      return Date.now() >= payload.exp * 1000;
    } 
    catch {
        return false;
    }
  }

  private decodeBase64Url(value: string): string {
      const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
      return atob(padded);
  }
}
