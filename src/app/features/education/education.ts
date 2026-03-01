import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { PortfolioData } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-education',
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './education.html',
  styleUrl: './education.scss'
})
export class Education {
  data = input.required<PortfolioData>();
}
