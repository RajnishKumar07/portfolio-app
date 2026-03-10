import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { PortfolioData } from '../../core/models/portfolio.model';

/**
 * Presentational component responsible for rendering the Skills grid layout.
 * Accepts categorized `SkillItem` arrays via Angular Signals.
 */
@Component({
  selector: 'app-skills',
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {
  data = input.required<PortfolioData>();
}
