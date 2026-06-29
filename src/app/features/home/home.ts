import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../core/services/course-data.service';
import { Auth } from '../../core/services/auth';
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

  isLoggedIn = false;
  userName: string | null = null;

  ngOnInit(): void {
    // react to auth state and load display name
    this.auth.isAuthenticated$.subscribe(v => {
      this.isLoggedIn = !!v;
      try {
        this.userName = this.isLoggedIn && typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
      } catch (e) {
        this.userName = null;
      }
    });

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
