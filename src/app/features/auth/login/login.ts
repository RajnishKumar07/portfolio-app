import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

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
