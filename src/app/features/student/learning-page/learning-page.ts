import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseContentService, CourseContentItem } from '../../../core/services/course-content.service';
import { CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';
import { MyCoursesService } from '../../../core/services/my-courses';

@Component({
  selector: 'app-learning-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './learning-page.html',
  styleUrl: './learning-page.scss',
})
export class LearningPageComponent implements OnInit {
  courseId = '';
  courseTitle = 'Course';
  lessons: CourseContentItem[] = [];
  selectedLesson?: CourseContentItem;
  safeEmbedUrl: SafeResourceUrl | null = null;
  error = '';
  accessDenied = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(CourseContentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private myCoursesService = inject(MyCoursesService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    console.log('✅ LearningPageComponent loaded');

    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('courseId') || '';
      console.log('📌 Course ID:', this.courseId);

      this.loadLearningPage();
    });
  }

  selectLesson(lesson: CourseContentItem): void {
    if (!lesson) {
      return;
    }

    console.log('🎥 Selected Lesson:', lesson);

    this.selectedLesson = lesson;
    this.safeEmbedUrl = this.buildSafeEmbedUrl(lesson.videoId);

    console.log('🔗 Safe Embed URL:', this.safeEmbedUrl);
    this.cdr.detectChanges();
  }

  markCompleted(lesson: CourseContentItem): void {
    this.contentService.markContentComplete(this.courseId, lesson.id).subscribe({
      next: (updated) => {
        this.lessons = this.lessons.map((entry) =>
          entry.id === updated.id ? { ...entry, completed: updated.completed } : entry
        );
        if (this.selectedLesson?.id === updated.id) {
          this.selectedLesson = { ...this.selectedLesson, completed: updated.completed };
        }
      },
      error: () => {
        if (this.selectedLesson?.id === lesson.id) {
          this.selectedLesson = { ...this.selectedLesson, completed: true };
        }
        this.lessons = this.lessons.map((entry) =>
          entry.id === lesson.id ? { ...entry, completed: true } : entry
        );
      },
    });
  }

  private buildSafeEmbedUrl(rawVideoValue?: string): SafeResourceUrl | null {
    const videoId = this.extractVideoId(rawVideoValue);
    if (!videoId) {
      return null;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractVideoId(rawVideoValue?: string): string | null {
    if (!rawVideoValue) {
      return null;
    }

    const normalized = rawVideoValue.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(normalized)) {
      return normalized;
    }

    const watchMatch = normalized.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
    return watchMatch?.[1] ?? null;
  }

  private loadLearningPage(): void {
    console.log('🚀 loadLearningPage() called');

    if (!this.courseId) {
      this.error = 'Learning page could not be opened.';
      console.log('❌ No courseId found');
      return;
    }

    this.accessDenied = false;
    this.error = '';

    this.myCoursesService.getMyCourses().subscribe((courses) => {
      console.log('📚 My Courses:', courses);

      const isEnrolled = courses.some((course) => String(course.courseId) === this.courseId);
      const hasCachedEnrollment = this.enrollmentService
        .getEnrolledCourseIds()
        .includes(this.courseId);

      console.log('✅ isEnrolled:', isEnrolled);
      console.log('✅ hasCachedEnrollment:', hasCachedEnrollment);

      if (!isEnrolled && !hasCachedEnrollment) {
        console.log('❌ Access Denied');

        this.accessDenied = true;
        this.error = 'Enroll in this course to access the learning page.';
        this.router.navigate(['/courses', this.courseId]);
        return;
      }

      this.courseService.getCourseByIdFromApi(this.courseId).subscribe((course) => {
        console.log('📖 Course Details:', course);

        this.courseTitle = course?.title || 'Course';
      });

      this.contentService.getCourseContent(this.courseId).subscribe({
        next: (items) => {
          console.log('📦 API Response:', items);

          this.lessons = this.sortLessons(items);

          console.log('📋 Lessons:', this.lessons);
          console.log('📊 Lessons Count:', this.lessons.length);

          if (this.lessons.length) {
            const firstVideoLesson = this.lessons.find(
              (lesson) => lesson.type?.toUpperCase() === 'VIDEO'
            );

            const initialLesson = firstVideoLesson ?? this.lessons[0];

            console.log('🎬 First Video Lesson:', firstVideoLesson);
            console.log('⭐ Initial Lesson:', initialLesson);

            this.selectLesson(initialLesson);
            this.error = '';
            this.cdr.detectChanges();
          } else {
            console.log('❌ No lessons returned');

            this.error = 'No lesson content is available for this course yet.';
            this.selectedLesson = undefined;
            this.safeEmbedUrl = null;
          }
        },
        error: (err) => {
          console.error('❌ API Error:', err);

          this.error = 'This learning page is not available right now.';
          this.selectedLesson = undefined;
          this.safeEmbedUrl = null;
        },
      });
    });
  }

  private sortLessons(items: CourseContentItem[]): CourseContentItem[] {
    console.log('🔀 Sorting Lessons:', items);

    return [...items].sort(
      (left, right) => (left.orderIndex ?? 0) - (right.orderIndex ?? 0)
    );
  }
}