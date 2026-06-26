import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';
import { CourseContentService, CourseContentItem } from '../../../core/services/course-content.service';
import { EnrollmentService } from '../../../core/services/enrollment';
import { CourseLogo } from '../../../shared/components/course-logo/course-logo';

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

  private courseService = inject(CourseService);
  private courseContentService = inject(CourseContentService);
  private enrollmentService = inject(EnrollmentService);
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

  private loadCourse() {
    const shouldOpenContent = this.route.snapshot.queryParamMap.get('enroll') === 'true';

    this.courseService.getCourseByIdFromApi(this.courseId).subscribe((found) => {
      if (found) {
        this.course = found;
        this.outcomes = found.outcomes ?? [
          `Key topics and outcomes for ${found.title}`,
          'Hands-on exercises',
          'Project-based learning'
        ];
        this.lessons = found.lessons ?? [`Introduction to ${found.title}`, 'Core concepts', 'Hands-on project'];
      } else {
        const all = this.courseService.getCourses();
        this.course = all.length ? all[0] : undefined;
        this.courseId = this.course?.id ?? '1';
        this.outcomes = this.course?.outcomes ?? [];
        this.lessons = this.course?.lessons ?? [];
      }

      this.isEnrolled = this.enrollmentService.getEnrolledCourseIds().includes(this.courseId);
      this.accessMessage = this.isEnrolled
        ? 'Loading your learning materials...'
        : 'Enroll to unlock videos and images for this course.';

      if (!this.isEnrolled) {
        this.content = [];
        this.loadingContent = false;
        return;
      }

      this.loadingContent = true;
      this.courseContentService.getCourseContent(this.courseId).subscribe({
        next: (items) => {
          this.content = items;
          this.accessMessage = items.length > 0 ? 'Your enrolled course content is ready.' : 'Your enrollment is active, but no content is available yet.';
          this.loadingContent = false;

          if (shouldOpenContent && items.length > 0) {
            this.openFirstLesson();
          }
        },
        error: () => {
          this.content = this.buildFallbackContent();
          this.accessMessage = 'Your enrollment is active. Preview content is ready for this course.';
          this.loadingContent = false;

          if (shouldOpenContent && this.content.length > 0) {
            this.openFirstLesson();
          }
        }
      });
    });
  }
}
