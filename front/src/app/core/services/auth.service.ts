import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(login: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, { username: login, password }).pipe(
      tap(r => {
        localStorage.setItem(this.TOKEN_KEY, r.token);
        this.isLoggedIn$.next(this.hasValidToken());
      })
    );
  }

  signup(email: string, username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/auth/signup`, { email, username, password }).pipe(
      tap(r => {
        localStorage.setItem(this.TOKEN_KEY, r.token);
        this.isLoggedIn$.next(this.hasValidToken());
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn$.next(false);
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.token;
    if (!token) return false;

    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      const now = Date.now() / 1000;
      return now < payload.exp;
    } catch {
      return false;
    }
  }
}
