import { Component, signal, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  data = input.required<PortfolioData>();
  scrolled = signal(false);
  activeSection = signal('hero');

  private sections = ['hero', 'about', 'experience', 'skills', 'projects', 'education'];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);

    // Find the current active section
    let current = 'hero';
    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (element) {
        // Trigger slightly before reaching the exact section
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150) {
          current = section;
        }
      }
    }
    
    // Default to hero if at very top
    if (window.scrollY < 100) {
      current = 'hero';
    }

    this.activeSection.set(current);
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
