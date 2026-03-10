import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Experience } from '../experience/experience';
import { Projects } from '../projects/projects';
import { Education } from '../education/education';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { PortfolioService } from '../../services/portfolio.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PortfolioData } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    Header,
    Hero,
    About,
    Experience,
    Skills,
    Projects,
    Education,
    Footer,
    ScrollRevealDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
/**
 * Primary Smart / Container Component for the public-facing application.
 * Retrieves data from `PortfolioService` and strategically drills it down 
 * into to all child presentational components (Hero, About, Experience, etc.) via Signals.
 */
export class HomeComponent implements OnInit {
  // The loaded portfolio data. Null while loading.
  portfolioData = signal<PortfolioData | null>(null);

  constructor(
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || 'default-slug';
      this.loadPortfolio(slug);
    });
  }

  /**
   * Fetches the dynamic portfolio configuration driven by the URL slug.
   * On failure (missing or private portfolio), forcibly redirects back to the builder/root.
   */
  loadPortfolio(slug: string) {
    this.portfolioData.set(null); // Reset while loading
    this.portfolioService.getPortfolio(slug).subscribe({
      next: (res) => {
        this.portfolioData.set(res);
      },
      error: (err) => {
        console.error('Failed to load portfolio, it may be private or not exist.', err);
        // Redirect to a safe fallback like the builder marketing site
        this.router.navigate(['/']); 
      }
    });
  }
}
