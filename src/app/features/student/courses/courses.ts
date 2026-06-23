import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  courses: Course[] = [];
  selectedCategory: string | null = null;
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const allCourses = this.courseService.getCourses();
      
      if (category) {
        this.selectedCategory = category;
        this.courses = allCourses.filter(course => course.category === category);
      } else {
        this.selectedCategory = null;
        this.courses = allCourses;
      }
    });
  }
}


