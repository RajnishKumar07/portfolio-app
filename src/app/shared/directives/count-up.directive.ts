import { Directive, ElementRef, input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit, OnDestroy {
  appCountUp = input<number>(0);
  duration = input<number>(2000);
  suffix = input<string>('');
  delay = input<number>(0);

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize with 0
      this.el.nativeElement.textContent = `0${this.suffix()}`;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            setTimeout(() => this.animateCountUp(), this.delay());
            if (this.observer) this.observer.unobserve(this.el.nativeElement);
          }
        });
      }, { threshold: 0.5 });

      this.observer.observe(this.el.nativeElement);
    } else {
      // Server-side rendering fallback
      this.el.nativeElement.textContent = `${this.appCountUp()}${this.suffix()}`;
    }
  }

  private animateCountUp() {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / this.duration(), 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * this.appCountUp());
      
      this.el.nativeElement.textContent = `${currentVal}${this.suffix()}`;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        this.el.nativeElement.textContent = `${this.appCountUp()}${this.suffix()}`;
      }
    };
    window.requestAnimationFrame(step);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
