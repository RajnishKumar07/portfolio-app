import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.model';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  data = input.required<PortfolioData>();
  currentYear = new Date().getFullYear();
}
