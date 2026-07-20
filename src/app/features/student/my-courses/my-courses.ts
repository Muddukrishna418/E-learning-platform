import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';
import { MyCoursesService, MyCourseEnrollment } from '../../../core/services/my-courses';
import { CourseLogo } from '../../../shared/components/course-logo/course-logo';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, RouterLink, CourseLogo, DatePipe],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss',
})
export class MyCourses implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private myCoursesService = inject(MyCoursesService);

  courses: MyCourseEnrollment[] = [];
  featuredCourse?: MyCourseEnrollment;
  totalProgress = 0;
  completedCount = 0;
  studyStreak = 7;
  upcomingLessons = 0;
  certificateCount = 1;

  private readonly handleStorageSync = (event: StorageEvent): void => {
    if (event.key === 'enrollments') {
      this.loadCourses();
    }
  };

  private readonly handleEnrollmentChanged = (): void => {
    this.loadCourses();
  };

  ngOnInit(): void {
    this.loadCourses();
    window.addEventListener('storage', this.handleStorageSync);
    window.addEventListener('enrollment:changed', this.handleEnrollmentChanged);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageSync);
    window.removeEventListener('enrollment:changed', this.handleEnrollmentChanged);
  }

  private loadCourses(): void {
    this.myCoursesService.getMyCourses().subscribe((courses) => {
      this.courses = courses.length > 0 ? courses : this.getFallbackCourses();
      this.featuredCourse = this.courses.find((course) => (course.progressPercentage || 0) < 80) ?? this.courses[0];
      this.totalProgress = Math.round(this.courses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0) / Math.max(this.courses.length, 1));
      this.completedCount = this.courses.filter((course) => (course.progressPercentage || 0) >= 80).length;
      this.upcomingLessons = this.courses.length > 0 ? Math.max(3, this.courses.length) : 0;
    });
  }

  private getFallbackCourses(): MyCourseEnrollment[] {
    const enrolledIds = this.enrollmentService.getEnrolledCourseIds();
    const fallback = this.courseService.getCourses()
      .filter((course) => enrolledIds.includes(course.id))
      .map((course, index) => ({
        courseId: Number(course.id),
        title: course.title,
        description: course.description,
        thumbnailUrl: course.logoUrl,
        instructorName: 'Your mentor',
        category: course.category,
        progressPercentage: [24, 46, 63, 78, 89][index % 5],
        enrollmentDate: new Date().toISOString(),
      }));

    return fallback.length > 0 ? fallback : [
      {
        courseId: 1,
        title: 'Full-Stack Web Development',
        description: 'Learn modern web technologies from scratch and build complete products.',
        thumbnailUrl: '',
        instructorName: 'Sarah Lee',
        category: 'Development',
        progressPercentage: 72,
        enrollmentDate: new Date().toISOString(),
      }
    ];
  }

  getProgressLabel(progress: number): string {
    return progress >= 80 ? 'On track' : progress >= 50 ? 'Good progress' : 'Just started';
  }
}
