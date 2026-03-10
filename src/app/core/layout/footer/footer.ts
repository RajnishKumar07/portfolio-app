import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.model';

import { RouterModule } from '@angular/router';

/**
 * Global application footer. 
 * Automatically calculates the current year for copyright text and renders social links.
 */
@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  data = input.required<PortfolioData>();
  currentYear = new Date().getFullYear();
}
