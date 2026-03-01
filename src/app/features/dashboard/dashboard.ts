import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = signal(true);
  userPortfolios = signal<any[]>([]);

  constructor(
    public authService: AuthService, 
    private router: Router,
    private portfolioService: PortfolioService
  ) {}

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
