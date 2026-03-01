import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { PortfolioData } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-about',
  imports: [CommonModule, CountUpDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  data = input.required<PortfolioData>();

  getParagraphs(text: string): string[] {
    return text.split('\n\n');
  }
}

