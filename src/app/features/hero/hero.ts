import { Component, PLATFORM_ID, Inject, OnInit, HostListener, signal, input, DestroyRef, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { interval } from 'rxjs';
import { PortfolioData } from '../../core/models/portfolio.model';

/**
 * Presentational Hero Component.
 * Serves as the primary landing header for the Portfolio. 
 * Features a typewriter-style animation (`interval`) for the job title string.
 */
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
  destroyRef = inject(DestroyRef);
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.scrolled = window.scrollY > 50;
    }
  }
  
  /**
   * Initializes the typewriter animation effect for the title.
   * Leverages Angular `interval` observables and ensures cleanup via `DestroyRef` 
   * to strictly prevent browser memory leaks on navigation.
   */
  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    const info = this.data().personalInfo;
    this.fullTitle = info.title;
    
    if (this.isBrowser) {
        setTimeout(() => {
          const titleChars = this.fullTitle.split('');
          let currentStr = '';
          
          const sub = interval(100).subscribe(i => {
            if (i < titleChars.length) {
              currentStr += titleChars[i];
              this.displayTitle.set(currentStr);
            } else {
              sub.unsubscribe();
            }
          });
          
          this.destroyRef.onDestroy(() => sub.unsubscribe());
        }, 500);
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
