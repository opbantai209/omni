/**
 * Admin Authentication Service
 */

import { storage } from './storage';

const SESSION_KEY = 'global_calc_admin_session_v1';

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  loginTime: string;
}

class AuthService {
  private session: AdminSession;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.session = this.loadSession();
  }

  private loadSession(): AdminSession {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, username: '', loginTime: '' };
    }

    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    return { isAuthenticated: false, username: '', loginTime: '' };
  }

  private saveSession(session: AdminSession): void {
    this.session = session;
    if (typeof window !== 'undefined') {
      if (session.isAuthenticated) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    this.listeners.forEach(fn => fn());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSession(): AdminSession {
    return { ...this.session };
  }

  public login(password: string): boolean {
    const isValid = storage.verifyAdminPassword(password);
    if (isValid) {
      this.saveSession({
        isAuthenticated: true,
        username: 'Administrator',
        loginTime: new Date().toISOString(),
      });
      return true;
    }
    return false;
  }

  public logout(): void {
    this.saveSession({
      isAuthenticated: false,
      username: '',
      loginTime: '',
    });
  }
}

export const auth = new AuthService();
