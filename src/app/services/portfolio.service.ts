import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolio`;

  constructor(private http: HttpClient) { }

  getPortfolio(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`).pipe(
      map(res => res.data || res) // fallback if not wrapped
    );
  }

  createPortfolio(portfolioData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, portfolioData, { withCredentials: true }).pipe(
      map(res => res.data || res)
    );
  }

  getUserPortfolios(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/user/me`, { withCredentials: true }).pipe(
      map(res => res.data || [])
    );
  }

  updatePortfolio(slug: string, portfolioData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${slug}`, portfolioData, { withCredentials: true }).pipe(
      map(res => res.data || res)
    );
  }
}
