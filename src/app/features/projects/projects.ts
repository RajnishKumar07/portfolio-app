import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { PortfolioData } from '../../core/models/portfolio.model';

/**
 * Presentational component for rendering the portfolio Project grid.
 * Integrates `ScrollRevealDirective` for dramatic entrance animations on scroll.
 */
@Component({
  selector: 'app-projects',
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  data = input.required<PortfolioData>();
}
