import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../core/services/course-data.service';
import { Auth } from '../../core/services/auth';
import { MyCoursesService, MyCourseEnrollment } from '../../core/services/my-courses';
import { EnrollmentService } from '../../core/services/enrollment';
import { CourseLogo } from '../../shared/components/course-logo/course-logo';

interface CategorySummary {
  name: string;
  count: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule, CourseLogo],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  categories: CategorySummary[] = [];
  searchResults: Course[] = [];
  searchTerm = '';
  hasSearched = false;
  private courseService = inject(CourseService);
  private router = inject(Router);
  private auth = inject(Auth);
  private myCoursesService = inject(MyCoursesService);
  private enrollmentService = inject(EnrollmentService);

  isLoggedIn = false;
  userName: string | null = null;
  myCourses: MyCourseEnrollment[] = [];

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(v => {
      this.isLoggedIn = !!v;
      try {
        this.userName = this.isLoggedIn && typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
      } catch (e) {
        this.userName = null;
      }

      if (this.isLoggedIn) {
        this.loadMyCourses();
      } else {
        this.myCourses = [];
      }
    });

    window.addEventListener('enrollment:changed', this.refreshOnEnrollmentChange.bind(this));

    const courses = this.courseService.getCourses();
    const categoryMap = new Map<string, number>();
    
    courses.forEach(course => {
      const count = categoryMap.get(course.category) || 0;
      categoryMap.set(course.category, count + 1);
    });

    this.categories = Array.from(categoryMap, ([name, count]) => ({ name, count }));
  }

  exploreCategory(categoryName: string): void {
    this.router.navigate(['/courses'], { queryParams: { category: categoryName } });
  }

  searchCourses(): void {
    const term = this.searchTerm.trim();
    this.hasSearched = true;

    if (!term) {
      this.router.navigate(['/courses']);
      return;
    }

    this.router.navigate(['/courses'], { queryParams: { search: term } });
  }

  private loadMyCourses(): void {
    this.myCoursesService.getMyCourses().subscribe((courses) => {
      if (courses.length > 0) {
        this.myCourses = courses;
        return;
      }

      this.myCourses = this.getFallbackMyCourses();
    });
  }

  private refreshOnEnrollmentChange(): void {
    this.loadMyCourses();
  }

  private getFallbackMyCourses(): MyCourseEnrollment[] {
    const enrolledIds = this.enrollmentService.getEnrolledCourseIds();
    const courses = this.courseService.getCourses();

    return courses
      .filter((course) => enrolledIds.includes(course.id))
      .map((course) => ({
        courseId: Number(course.id),
        title: course.title,
        description: course.description,
        thumbnailUrl: course.logoUrl,
        instructorName: 'Your mentor',
        category: course.category,
        progressPercentage: 18,
        enrollmentDate: new Date().toISOString(),
      }));
  }

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
}
