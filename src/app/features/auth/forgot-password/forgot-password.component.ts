import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email = signal('');
  otp = signal('');
  newPassword = signal('');
  
  step = signal<1 | 2>(1);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  requestOtp() {
    if (!this.email()) {
      this.errorMessage.set('Please enter your email.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.sendOtp(this.email(), 'RESET_PASSWORD').subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set(2);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to send OTP.');
      }
    });
  }

  onSubmit() {
    if (this.otp().trim().length < 6 || this.newPassword().length < 8) {
      this.errorMessage.set('Please enter the 6-digit OTP and an 8-character new password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.resetPassword({ 
      email: this.email(), 
      otp: this.otp(), 
      newPassword: this.newPassword() 
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Password reset successfully. You can now log in.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid or expired OTP code.');
      }
    });
  }
}
