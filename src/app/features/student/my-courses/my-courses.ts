import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MyCoursesService, MyCourseEnrollment } from '../../../core/services/my-courses';
import { CourseLogo } from '../../../shared/components/course-logo/course-logo';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, RouterLink, CourseLogo, DatePipe],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss',
})
export class MyCourses implements OnInit, OnDestroy {
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
      this.courses = courses;
      this.featuredCourse = this.courses.find((course) => (course.progressPercentage || 0) < 80) ?? this.courses[0];
      this.totalProgress = Math.round(this.courses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0) / Math.max(this.courses.length, 1));
      this.completedCount = this.courses.filter((course) => (course.progressPercentage || 0) >= 80).length;
      this.upcomingLessons = this.courses.length > 0 ? Math.max(3, this.courses.length) : 0;
    });
  }

  getProgressLabel(progress: number): string {
    return progress >= 80 ? 'On track' : progress >= 50 ? 'Good progress' : 'Just started';
  }
}
