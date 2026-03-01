import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email() || !this.password() || !this.confirmPassword()) {
      this.errorMessage.set('Please fill out all fields');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        // Automatically log them in after a successful registration
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
        this.errorMessage.set(err.error?.message || 'Failed to register account. User may already exist.');
      }
    });
  }
}
