import { Component, PLATFORM_ID, Inject, OnInit, HostListener, signal, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioData } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit {
  data = input.required<PortfolioData>();
  isBrowser = false;
  displayTitle = signal('');
  fullTitle = '';
  scrolled = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.scrolled = window.scrollY > 50;
    }
  }
  
  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Dynamically set title from the API data instead of a static string
    const info = this.data().personalInfo;
    this.fullTitle = info.role || (info.title.includes(' | ') ? info.title.split(' | ')[0] : info.title);
    
    if (this.isBrowser) {
        let i = 0;
        const speed = 100;
        const typeWriter = () => {
          if (i < this.fullTitle.length) {
            this.displayTitle.update(val => val + this.fullTitle.charAt(i));
            i++;
            setTimeout(typeWriter, speed);
          }
        };
        setTimeout(typeWriter, 500); // initial delay
    } else {
        this.displayTitle.set(this.fullTitle);
    }
  }

  scrollTo(sectionId: string) {
    if (this.isBrowser) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
