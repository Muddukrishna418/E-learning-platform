import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {
  courses: Course[] = [];
  categories: Set<string> = new Set();
  expandedCategories: { [key: string]: boolean } = {};
  selectedCategory: string | null = null;

  private courseService = inject(CourseService);

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
}
