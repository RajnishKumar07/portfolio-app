import { Directive, ElementRef, OnInit, OnDestroy, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]'
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private hasRevealed = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Base classes for the reveal effect
      this.renderer.addClass(this.el.nativeElement, 'block');
      this.renderer.addClass(this.el.nativeElement, 'opacity-0');
      this.renderer.addClass(this.el.nativeElement, 'translate-y-12');
      this.renderer.addClass(this.el.nativeElement, 'blur-[4px]');
      this.renderer.addClass(this.el.nativeElement, 'transition-all');
      this.renderer.addClass(this.el.nativeElement, 'duration-1000');
      this.renderer.addClass(this.el.nativeElement, 'ease-out');
      // For children stagger orchestration, we add a class that children can hook into
      this.renderer.addClass(this.el.nativeElement, 'group/reveal');
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasRevealed) {
            this.hasRevealed = true;
            // Trigger animation
            this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
            this.renderer.removeClass(this.el.nativeElement, 'translate-y-12');
            this.renderer.removeClass(this.el.nativeElement, 'blur-[4px]');
            this.renderer.addClass(this.el.nativeElement, 'opacity-100');
            this.renderer.addClass(this.el.nativeElement, 'translate-y-0');
            this.renderer.addClass(this.el.nativeElement, 'blur-none');
            // Mark as revealed for children to start their transitions
            this.renderer.addClass(this.el.nativeElement, 'is-revealed');
            
            // Stop observing once revealed
            if (this.observer) {
               this.observer.unobserve(this.el.nativeElement);
            }
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px'
      });

      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
