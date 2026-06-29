import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';
import { CourseLogo } from '../../../shared/components/course-logo/course-logo';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, CommonModule, CourseLogo],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  courses: Course[] = [];
  allCourses: Course[] = [];
  selectedCategory: string | null = null;
  searchQuery: string | null = null;
  loading = false;
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const search = params['search'];
      this.selectedCategory = category || null;
      this.searchQuery = search ? search.toString() : null;
      this.loadCourses(category);
    });
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    if (!category) {
      this.courses = [...this.allCourses];
      return;
    }

    const normalizedCategory = category.trim().toLowerCase();
    this.courses = this.allCourses.filter((course) =>
      (course.category || '').trim().toLowerCase() === normalizedCategory
    );
  }

  filterBySearch(query: string | null): void {
    if (!query) {
      return;
    }

    const normalizedQuery = query.trim().toLowerCase();
    this.courses = this.courses.filter((course) => {
      const haystack = `${course.title} ${course.description} ${course.category}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }

  private loadCourses(category?: string): void {
    this.loading = true;
    this.courses = [];

    const fallbackCourses = this.courseService.getCourses();
    this.allCourses = fallbackCourses;
    this.filterByCategory(category || null);
    this.filterBySearch(this.searchQuery);
    this.loading = false;
    this.cdr.detectChanges();

    this.courseService.getCoursesFromApi().subscribe({
      next: (courses) => {
        this.allCourses = courses;
        this.filterByCategory(category || null);
        this.filterBySearch(this.searchQuery);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.allCourses = fallbackCourses;
        this.filterByCategory(category || null);
        this.filterBySearch(this.searchQuery);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}


