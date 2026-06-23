import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../core/services/course-data.service';

interface CategorySummary {
  name: string;
  count: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  categories: CategorySummary[] = [];
  private courseService = inject(CourseService);
  private router = inject(Router);

  ngOnInit(): void {
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
}
