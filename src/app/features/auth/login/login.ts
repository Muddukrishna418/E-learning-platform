import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  readonly mockEmail = 'student@example.com';
  readonly mockPassword = 'password123';
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.successMessage = 'Login page is connected successfully.';
    this.router.navigate(['/']);
  }
}

export { Login as LoginComponent };
