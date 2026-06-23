import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.successMessage = 'Signup page is connected successfully.';
  }
}

export { Register as RegisterComponent };
