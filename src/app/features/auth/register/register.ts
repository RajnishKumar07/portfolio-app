import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Presentational and Container component for User Registration.
 * Handles form validation (password constraints, confirmation matching) 
 * and automatically logs the user in upon successful DB creation.
 */
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  otp = signal('');
  
  step = signal<1 | 2>(1);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  requestOtp() {
    if (!this.runValidations()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.sendOtp(this.email(), 'REGISTER').subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set(2);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to send OTP. Email may already exist.');
      }
    });
  }

  onSubmit() {
    if (this.otp().trim().length < 6) {
      this.errorMessage.set('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({ email: this.email(), password: this.password(), otp: this.otp() }).subscribe({
      next: () => {
        // Automatically pivot and perform a live login using the verified credentials upon a successful DB write,
        // saving the user from having to manually sign in immediately after registering.
        this.authService.login({ email: this.email(), password: this.password() }).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
             this.isLoading.set(false);
             // If auto-login fails, send them back to login page
             this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid or expired OTP code.');
      }
    });
  }

  /**
   * Executes form validations in a strict sequence, breaking out early
   * and populating the error signal if any fail.
   */
  private runValidations(): boolean {
    if (this.hasEmptyFields()) return false;
    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return false;
    }
    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return false;
    }
    return true;
  }

  private hasEmptyFields(): boolean {
    if (!this.email()) {
      this.errorMessage.set('Please fill out all fields');
      return true;
    }
    if (!this.password() || !this.confirmPassword()) {
      this.errorMessage.set('Please fill out all fields');
      return true;
    }
    return false;
  }
}
