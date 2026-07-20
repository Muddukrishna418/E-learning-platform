import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';
import { CourseLogo } from '../course-logo/course-logo';

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [CommonModule, RouterLink, CourseLogo],
  styles: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {
  courses: Course[] = [];
  categories: Set<string> = new Set();
  expandedCategories: { [key: string]: boolean } = {};
  selectedCategory: string | null = null;
  previewCourse: Course | null = null;

  private courseService = inject(CourseService);
  private router = inject(Router);

  getEmojiForCategory(category: string) {
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
    return map[category] ?? '📚';
  }

  ngOnInit(): void {
    this.courses = this.courseService.getCourses();
    this.extractCategories();
  }

  extractCategories(): void {
    this.courses.forEach(course => {
      this.categories.add(course.category);
      this.expandedCategories[course.category] = true;
    });
  }

  toggleCategory(category: string): void {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }

  getCoursesByCategory(category: string): Course[] {
    return this.courses.filter(course => course.category === category);
  }

  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  openPreview(course: Course): void {
    this.previewCourse = course;
  }

  closePreview(): void {
    this.previewCourse = null;
  }

  navigateToCourse(course: Course | null): void {
    if (!course) return;
    this.router.navigate(['/courses', course.id]);
    this.previewCourse = null;
  }
}
