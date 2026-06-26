import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Course, CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './enroll.html',
  styleUrl: './enroll.scss'
})
export class EnrollComponent implements OnInit {
  course?: Course;
  courseId = '';
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id') || '';
      this.course = this.courseService.getCourseById(this.courseId);
      if (!this.course) {
        this.message = 'The requested course could not be found.';
        this.messageType = 'error';
      }
    });
  }

  enrollNow(): void {
    if (!this.authService.isAuthenticated()) {
      this.message = 'No active session found. Continuing in demo mode and saving your enrollment locally.';
      this.messageType = 'info';
    }

    if (!this.course) {
      this.message = 'Select a valid course before enrolling.';
      this.messageType = 'error';
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.enrollmentService.enroll(this.course.id).subscribe((result) => {
      this.isSubmitting = false;
      this.message = result.message;
      this.messageType = result.success ? 'success' : 'error';

      if (result.success) {
        this.router.navigate(['/courses', this.course?.id], {
          queryParams: { enroll: 'true' }
        });
      }
    });
  }
}

export { EnrollComponent as EnrollPageComponent };
