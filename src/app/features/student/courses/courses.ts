import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  logo: string;
  rating: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  readonly courses: Course[] = [
    {
      id: '1',
      title: 'Full-Stack Web Development',
      description: 'Learn modern web technologies from scratch.',
      duration: '8 weeks',
      level: 'Beginner',
      category: 'Development',
      logo: 'WEB',
      rating: '4.9 ★'
    },
    {
      id: '2',
      title: 'Digital Marketing Strategy',
      description: 'Master SEO, content, and campaign planning.',
      duration: '6 weeks',
      level: 'Intermediate',
      category: 'Marketing',
      logo: 'SEO',
      rating: '4.8 ★'
    },
    {
      id: '3',
      title: 'Data Analytics Basics',
      description: 'Understand dashboards, metrics, and insights.',
      duration: '5 weeks',
      level: 'Beginner',
      category: 'Data',
      logo: 'DATA',
      rating: '4.7 ★'
    },
    {
      id: '4',
      title: 'UI/UX Design Masterclass',
      description: 'Create beautiful, user-friendly interfaces.',
      duration: '7 weeks',
      level: 'Intermediate',
      category: 'Design',
      logo: 'UX',
      rating: '4.9 ★'
    }
  ];
}


