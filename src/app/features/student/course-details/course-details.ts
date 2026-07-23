import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';
import { CourseContentService, CourseContentItem } from '../../../core/services/course-content.service';
import { EnrollmentService } from '../../../core/services/enrollment';
import { PaymentService } from '../../../core/services/payment';
import { CourseLogo } from '../../../shared/components/course-logo/course-logo';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink, CommonModule, CourseLogo],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss'
})
export class CourseDetails implements OnInit {
  courseId = '1';
  course?: Course;
  outcomes: string[] = [];
  lessons: string[] = [];
  content: CourseContentItem[] = [];
  loadingContent = false;
  isEnrolled = false;
  accessMessage = '';
  relatedCourses: Course[] = [];
  enrollmentMessage = '';
  enrollmentMessageType: 'success' | 'error' | 'info' = 'info';
  enrolling = false;

  private courseService = inject(CourseService);
  private courseContentService = inject(CourseContentService);
  private enrollmentService = inject(EnrollmentService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  getEmojiForCategory(category?: string) {
    const map: { [k: string]: string } = {
      Development: '🧑‍💻',
      Marketing: '📈',
      Data: '📊',
      Design: '🎨',
      AI: '🤖',
      'Machine Learning': '🧠',
      Photography: '📷',
      'Personal Development': '🌱',
      Business: '💼',
      Cloud: '☁️',
      Cybersecurity: '🔒',
      IT: '🖥️'
    };
    return category ? map[category] ?? '📚' : '📚';
  }

  constructor(private route: ActivatedRoute) {
    // keep constructor minimal; initialization handled in ngOnInit
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '1';
      this.loadCourse();
    });
  }

  enrollNow(): void {
    if (!this.course) {
      this.enrollmentMessage = 'Unable to enroll because the selected course was not found.';
      this.enrollmentMessageType = 'error';
      return;
    }

    this.enrollmentMessage = '';
    this.enrollmentMessageType = 'info';
    this.enrolling = true;

    this.paymentService.purchaseCourse(this.course.id, `card:${this.course.id}`, 'card')
      .pipe(
        switchMap(() => this.enrollmentService.enroll(this.course!.id))
      )
      .subscribe({
        next: (result) => {
          this.enrolling = false;
          this.enrollmentMessage = result.success ? 'Payment Successful and enrollment saved.' : (result.message || 'Enrollment could not be completed at the moment.');
          this.enrollmentMessageType = result.success ? 'success' : 'error';

          if (result.success) {
            this.isEnrolled = true;
            this.accessMessage = 'Your course enrollment is active. Your learning materials are ready.';
            this.notifyEnrollmentChanged();
            this.router.navigate(['/my-courses']);
          }
        },
        error: (error) => {
          this.enrolling = false;
          const fallbackMessage = error?.error?.message || error?.message || 'The payment or enrollment request could not be completed. Please try again.';
          this.enrollmentMessage = fallbackMessage;
          this.enrollmentMessageType = 'error';
        }
      });
  }

  private loadRelatedCourses(category?: string): void {
    if (!category) {
      this.relatedCourses = [];
      return;
    }

    this.relatedCourses = this.courseService.getCourses()
      .filter((course) => course.category === category && course.id !== this.courseId)
      .slice(0, 3);
  }

  private loadCourseContent(openContent: boolean): void {
    if (!this.courseId) {
      return;
    }

    this.loadingContent = true;
    this.courseContentService.getCourseContent(this.courseId).subscribe({
      next: (items) => {
        this.content = items;
        this.accessMessage = items.length > 0 ? 'Your enrolled course content is ready.' : 'Your enrollment is active, but no content is available yet.';
        this.loadingContent = false;

        if (openContent && items.length > 0) {
          this.openFirstLesson();
        }
      },
      error: () => {
        this.content = this.buildFallbackContent();
        this.accessMessage = 'Your enrollment is active. Preview content is ready for this course.';
        this.loadingContent = false;

        if (openContent && this.content.length > 0) {
          this.openFirstLesson();
        }
      }
    });
  }

  private buildFallbackContent(): CourseContentItem[] {
    const title = this.course?.title || 'this course';
    return [
      {
        id: 1,
        title: `Welcome to ${title}`,
        type: 'VIDEO',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'A guided introduction to the course journey.',
        orderIndex: 1
      },
      {
        id: 2,
        title: `Project setup for ${title}`,
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        description: 'A quick look at the resources you will use.',
        orderIndex: 2
      }
    ];
  }

  markAsCompleted(item: CourseContentItem): void {
    if (!this.isEnrolled) {
      return;
    }

    this.courseContentService.markContentComplete(this.courseId, item.id).subscribe({
      next: (updatedItem) => {
        this.content = this.content.map((entry) => entry.id === updatedItem.id ? { ...entry, completed: updatedItem.completed } : entry);
      },
      error: () => {
        this.content = this.content.map((entry) => entry.id === item.id ? { ...entry, completed: true } : entry);
      }
    });
  }

  openFirstLesson(): void {
    if (!this.content.length) {
      return;
    }

    const firstItem = this.content[0];
    this.router.navigate(['/courses', this.courseId, 'content', firstItem.id]);
  }

  private notifyEnrollmentChanged(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('enrollment:changed', { detail: { courseId: this.courseId } }));
  }

  private loadCourse() {
    const shouldOpenContent = this.route.snapshot.queryParamMap.get('enroll') === 'true';
    const fallbackCourse = this.courseService.getCourseById(this.courseId);

    this.course = fallbackCourse;
    this.outcomes = fallbackCourse?.outcomes ?? [];
    this.lessons = fallbackCourse?.lessons ?? [];
    this.loadRelatedCourses(fallbackCourse?.category);
    this.isEnrolled = this.enrollmentService.getEnrolledCourseIds().includes(this.courseId);
    this.accessMessage = this.isEnrolled
      ? 'Loading your learning materials...'
      : 'Enroll to unlock videos and images for this course.';

    this.courseService.getCourseByIdFromApi(this.courseId).subscribe((found) => {
      if (found) {
        this.course = found;
        this.outcomes = found.outcomes ?? [
          `Key topics and outcomes for ${found.title}`,
          'Hands-on exercises',
          'Project-based learning'
        ];
        this.lessons = found.lessons ?? [`Introduction to ${found.title}`, 'Core concepts', 'Hands-on project'];
        this.loadRelatedCourses(found.category);
      }

      if (!this.course) {
        this.enrollmentMessage = 'The selected course could not be found.';
        this.enrollmentMessageType = 'error';
        this.content = [];
        this.loadingContent = false;
        return;
      }

      if (!this.isEnrolled) {
        this.content = [];
        this.loadingContent = false;
        return;
      }

      this.loadCourseContent(shouldOpenContent);
    });
  }
}
