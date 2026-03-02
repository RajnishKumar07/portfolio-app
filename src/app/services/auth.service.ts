import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Manage auth state reactively
  currentUser = signal<AuthResponse | null>(null);
  
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    // Uses withCredentials from the global interceptor automatically to store the HttpOnly cookie
    return this.http.post<any>(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      tap(res => {
         // Assuming backend returns the user object explicitly on login
         this.currentUser.set(res.data || res);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).pipe(
      tap(() => this.currentUser.set(null))
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  checkAuth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(res => {
         this.currentUser.set(res.data || res);
      }),
      catchError(err => {
         this.currentUser.set(null);
         return of(null);
      })
    );
  }
}
