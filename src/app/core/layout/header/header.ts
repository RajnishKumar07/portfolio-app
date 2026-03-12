import { Component, signal, HostListener, input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.model';

/**
 * Global Navigation Header Component.
 * Implements sticky scrolling, dynamic active state highlighting based on 
 * viewport position, and smooth-scrolling anchor links.
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  data = input.required<PortfolioData>();
  @Output() contactClick = new EventEmitter<void>();
  scrolled = signal(false);
  activeSection = signal('hero');

  firstName = computed(() => {
    const name = this.data()?.personalInfo?.name || 'Your Name';
    return name.split(' ')[0] || '';
  });
  
  lastName = computed(() => {
    const name = this.data()?.personalInfo?.name || 'Your Name';
    const parts = name.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  });

  private sections = ['hero', 'about', 'experience', 'skills', 'projects', 'education'];

  /**
   * Tracks user scroll position to toggle the sticky CSS class and determine
   * which section is currently active for navigation highlighting.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);
    const active = this.calculateActiveSection();
    this.activeSection.set(active);
  }

  /**
   * Determines the active section by evaluating scroll position limits.
   */
  private calculateActiveSection(): string {
    if (window.scrollY < 100) return 'hero';
    
    let current = 'hero';
    for (const section of this.sections) {
      current = this.evaluateSectionPosition(section, current);
    }
    return current;
  }

  /**
   * Evaluates if a specific section's anchor threshold has breached the viewport buffer.
   */
  private evaluateSectionPosition(section: string, fallback: string): string {
    const element = document.getElementById(section);
    if (element && element.getBoundingClientRect().top <= 150) {
      return section;
    }
    return fallback;
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
