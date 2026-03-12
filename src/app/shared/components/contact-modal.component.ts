import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
          (click)="closeModal()"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
          <div class="p-6 sm:p-8 flex-1 overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-white">Let's Talk</h2>
              <button 
                (click)="closeModal()"
                class="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            @if (successMessage()) {
              <div class="bg-teal-500/10 border border-teal-500/50 text-teal-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p>{{ successMessage() }}</p>
              </div>
              <button 
                (click)="closeModal()"
                class="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Close
              </button>
            } @else {
              @if (errorMessage()) {
                <div class="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
                  {{ errorMessage() }}
                </div>
              }

              <form (ngSubmit)="onSubmit()" class="space-y-4">
                <div class="space-y-1.5">
                  <label for="visitorEmail" class="text-sm font-medium text-neutral-300">Your Email</label>
                  <input 
                    type="email" 
                    id="visitorEmail" 
                    name="visitorEmail"
                    [(ngModel)]="visitorEmail" 
                    class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="you@example.com"
                    required
                  >
                </div>

                <div class="space-y-1.5">
                  <label for="message" class="text-sm font-medium text-neutral-300">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    [(ngModel)]="message" 
                    rows="4"
                    class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                    placeholder="How can I help you?"
                    required
                    maxlength="1000"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  [disabled]="isLoading() || !visitorEmail() || !message()"
                  class="w-full mt-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  @if (isLoading()) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  } @else {
                    Send Message
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ContactModalComponent {
  isOpen = input(false);
  portfolioSlug = input('');
  close = output<void>();

  visitorEmail = signal('');
  message = signal('');
  
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private http: HttpClient) {}

  closeModal() {
    this.close.emit();
    // Reset state after a short delay to allow animation
    setTimeout(() => {
      this.visitorEmail.set('');
      this.message.set('');
      this.errorMessage.set('');
      this.successMessage.set('');
    }, 300);
  }

  onSubmit() {
    if (!this.visitorEmail() || !this.message() || !this.portfolioSlug()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.post(`${environment.apiUrl}/portfolio/${this.portfolioSlug()}/contact`, {
      visitorEmail: this.visitorEmail(),
      message: this.message()
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Your message has been successfully sent!');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to send message. Please try again later.');
      }
    });
  }
}
