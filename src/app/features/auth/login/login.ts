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

    this.authService.login(this.email, this.password).subscribe((success) => {
      if (success) {
        this.successMessage = 'Login successful! Redirecting to home...';
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}

export { Login as LoginComponent };
