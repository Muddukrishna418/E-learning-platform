import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course-data.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss'
})
export class CourseDetails implements OnInit {
  courseId = '1';
  course?: Course;
  outcomes: string[] = [];
  lessons: string[] = [];

  private courseService = inject(CourseService);

  constructor(private route: ActivatedRoute) {
    // keep constructor minimal; initialization handled in ngOnInit
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '1';
      this.loadCourse();
    });
  }

  private loadCourse() {
    const found = this.courseService.getCourseById(this.courseId);
    if (found) {
      this.course = found;
      this.outcomes = found.outcomes ?? [
        `Key topics and outcomes for ${found.title}`,
        'Hands-on exercises',
        'Project-based learning'
      ];
      this.lessons = found.lessons ?? [`Introduction to ${found.title}`, 'Core concepts', 'Hands-on project'];
    } else {
      // Fallback to the first available course
      const all = this.courseService.getCourses();
      this.course = all.length ? all[0] : undefined;
      this.courseId = this.course?.id ?? '1';
      this.outcomes = this.course?.outcomes ?? [];
      this.lessons = this.course?.lessons ?? [];
    }
  }
}
