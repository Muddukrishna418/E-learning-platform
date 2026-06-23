import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    // Validate credentials using Auth service
    if (this.authService.login(this.email, this.password)) {
      this.successMessage = 'Login successful! Redirecting to home...';
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 500);
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }
}

export { Login as LoginComponent };
