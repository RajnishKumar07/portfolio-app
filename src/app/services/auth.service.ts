import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  id: string;
  email: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  name?: string;
  [key: string]: string | undefined;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

/**
 * Angular Service managing client-side authentication state.
 * Interfaces with the NestJS backend to handle login/logout flows and 
 * reactively broadcasts the session state globally via Angular Signals (`currentUser`).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Manage auth state reactively
  currentUser = signal<AuthResponse | null>(null);
  
  constructor(private http: HttpClient) {}

  register(data: RegisterPayload): Observable<{ message: string; user: AuthResponse }> {
    return this.http.post<{ message: string; user: AuthResponse }>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginPayload): Observable<AuthResponse> {
    // Uses withCredentials from the global interceptor automatically to store the HttpOnly cookie
    return this.http.post<{ data: AuthResponse } | AuthResponse>(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      map(res => 'data' in res ? res.data : res),
      tap(user => {
         // Assuming backend returns the user object explicitly on login
         this.currentUser.set(user);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/logout`, { withCredentials: true }).pipe(
      tap(() => this.currentUser.set(null))
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  checkAuth(): Observable<AuthResponse | null> {
    return this.http.get<{ data: AuthResponse } | AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map(res => 'data' in res ? res.data : res),
      tap(user => {
         this.currentUser.set(user);
      }),
      catchError(err => {
         this.currentUser.set(null);
         return of(null);
      })
    );
  }
}
