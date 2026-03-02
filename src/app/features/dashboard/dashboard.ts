import { Component, signal, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = signal(true);
  userPortfolios = signal<any[]>([]);
  activeSlug = signal<string | null>(null);
  private destroyRef = inject(DestroyRef);

  constructor(
    public authService: AuthService, 
    private router: Router,
    private portfolioService: PortfolioService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      const match = url.match(/\/dashboard\/edit\/([^\/]+)/);
      if (match && match[1]) {
        this.activeSlug.set(match[1]);
      } else {
        this.activeSlug.set(null);
      }
    });

    // Also check current url initially
    const url = this.router.url;
    const match = url.match(/\/dashboard\/edit\/([^\/]+)/);
    if (match && match[1]) {
      this.activeSlug.set(match[1]);
    }
  }

  ngOnInit() {
    this.portfolioService.getUserPortfolios().subscribe({
      next: (portfolios) => this.userPortfolios.set(portfolios),
      error: (err) => console.error('Failed to fetch user portfolios', err)
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }
}
