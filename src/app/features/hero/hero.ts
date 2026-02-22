import { Component, PLATFORM_ID, Inject, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RESUME_DATA } from '../../core/data/resume.data';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit {
  data = RESUME_DATA;
  isBrowser = false;
  displayTitle = signal('');
  fullTitle = 'Senior Software Engineer';
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
}
