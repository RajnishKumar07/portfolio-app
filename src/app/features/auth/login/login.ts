import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

/**
 * Presentational and Container component for User Login.
 * Handles the authentication form state and interfaces with `AuthService` 
 * to securely log the user in and persist the HTTP-Only cookie session.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please fill out all fields');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Dispatch credentials to the backend. The backend will respond with a securely signed HTTP-Only cookie,
    // seamlessly bypassing the need for the frontend to manually manage local storage tokens.
    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to login. Please check credentials.');
      }
    });
  }
}
