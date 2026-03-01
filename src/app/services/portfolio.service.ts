import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolio`;

  constructor(private http: HttpClient) { }

  getPortfolio(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }

  createPortfolio(portfolioData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, portfolioData, { withCredentials: true });
  }
}
