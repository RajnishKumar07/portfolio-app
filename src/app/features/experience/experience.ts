import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { PortfolioData } from '../../core/models/portfolio.model';

/**
 * Presentational component for displaying a list of professional work experiences.
 * Utilizes the custom `ScrollRevealDirective` to animate entries into view as the user scrolls.
 */
@Component({
  selector: 'app-experience',
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience {
  data = input.required<PortfolioData>();
}
