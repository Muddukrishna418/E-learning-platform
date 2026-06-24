import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { CourseService } from '../../../core/services/course-data.service';

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
  totalCourses = 0;
  categoriesCount = 0;

  constructor(
    private router: Router,
    private authService: Auth
    , private courseService: CourseService
  ) {
    const courses = this.courseService.getCourses();
    this.totalCourses = courses.length;
    this.categoriesCount = new Set(courses.map(c => c.category)).size;
  }

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
      // store a simple display name for the user (derived from email)
      try {
        const namePart = this.email.split('@')[0] || 'Student';
        const displayName = namePart.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userName', displayName);
        }
      } catch (e) {
        // ignore storage errors
      }
      // Navigate to the home route after successful login
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }
}

export { Login as LoginComponent };
