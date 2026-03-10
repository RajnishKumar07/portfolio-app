import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Angular Service responsible for all HTTP interactions with the NestJS `portfolio-api`.
 * Handles Portfolio CRUD operations and binary media/PDF uploads to Cloudinary.
 * Integrates RxJS Observables heavily for declarative async data flows.
 */
import { PortfolioData } from '../core/models/portfolio.model';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolio`;
  
  // Emit event when portfolio list should be refreshed
  public portfoliosUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  /**
   * Retrieves a specific portfolio entirely by its slug.
   * Uses `withCredentials` to pass HttpOnly JWT cookies to seamlessly bypass the backend `OptionalAuthGuard` if the user is the owner.
   */
  getPortfolio(slug: string): Observable<PortfolioData> {
    // `withCredentials: true` intercepts the outgoing request and forcefully attaches the isolated HttpOnly JWT cookie.
    // If the token matches the portfolio owner, the backend OptionalAuthGuard uses it to grant full access.
    return this.http.get<{ data: PortfolioData } | PortfolioData>(`${this.apiUrl}/${slug}`, { withCredentials: true }).pipe(
      map(res => ('data' in res ? res.data : res) as PortfolioData) 
    );
  }

  /**
   * Creates a new portfolio for the authenticated user and emits a refresh event to siblings (like Sidebar).
   */
  createPortfolio(portfolioData: Partial<PortfolioData>): Observable<PortfolioData> {
    return this.http.post<{ data: PortfolioData } | PortfolioData>(this.apiUrl, portfolioData, { withCredentials: true }).pipe(
      map(res => ('data' in res ? res.data : res) as PortfolioData),
      tap(() => this.portfoliosUpdated$.next())
    );
  }

  /**
   * Gets the list of portfolios exclusively owned by the currently logged-in user.
   */
  getUserPortfolios(): Observable<PortfolioData[]> {
    return this.http.get<{ data: PortfolioData[] } | PortfolioData[]>(`${this.apiUrl}/user/me`, { withCredentials: true }).pipe(
      map(res => ('data' in res ? res.data : res) as PortfolioData[])
    );
  }

  /**
   * Updates an existing portfolio tree utilizing the massive CreatePortfolioDto payload.
   * Emits a refresh notification so sibling components immediately redraw new data.
   */
  updatePortfolio(slug: string, portfolioData: Partial<PortfolioData>): Observable<PortfolioData> {
    return this.http.put<{ data: PortfolioData } | PortfolioData>(`${this.apiUrl}/${slug}`, portfolioData, { withCredentials: true }).pipe(
      map(res => ('data' in res ? res.data : res) as PortfolioData),
      tap(() => this.portfoliosUpdated$.next())
    );
  }

  /**
   * Submits a binary file Blob specifically to the backend `/upload/image` endpoint via FormData.
   * (Supports raw PDFs despite the legacy 'image' endpoint name)
   */
  uploadImage(file: File): Observable<{url: string}> {
    // 1. Wrap the binary File blob in a standard multipart/form-data payload required by the backend Multer interceptor
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ data: { url: string } } | { url: string }>(`${environment.apiUrl}/upload/image`, formData, { withCredentials: true }).pipe(
      map(res => ('data' in res ? res.data : res) as { url: string })
    );
  }

}
