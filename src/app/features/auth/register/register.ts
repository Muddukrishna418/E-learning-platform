import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name = '';
  email = '';
  password = '';
  readonly demoEmail = 'newstudent@example.com';
  readonly demoPassword = 'password123';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.authService.register(this.name, this.email, this.password).subscribe((success) => {
      if (success) {
        this.successMessage = 'Registration successful! Redirecting to home...';
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}

export { Register as RegisterComponent };
