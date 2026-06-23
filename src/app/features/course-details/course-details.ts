import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss'
})
export class CourseDetailsComponent {
  readonly course = {
    title: 'UI/UX Design Masterclass',
    category: 'Design',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: '4.9 ★',
    logo: 'UX',
    description: 'Build modern interfaces and improve user experience.',
    outcomes: [
      'Create user-friendly layouts for websites and apps.',
      'Improve product usability with practical design methods.',
      'Build polished interface screens with strong visual hierarchy.'
    ],
    lessons: [
      'Design fundamentals',
      'Wireframes and user flows',
      'Modern UI patterns',
      'Usability and accessibility',
      'Portfolio-ready final project'
    ]
  };
}
