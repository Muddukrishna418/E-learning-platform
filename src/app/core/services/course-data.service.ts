import { Injectable } from '@angular/core';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  logo: string;
  rating: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [
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

  getCourses(): Course[] {
    return this.courses;
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  getCoursesByCategory(category: string): Course[] {
    return this.courses.filter(course => course.category === category);
  }
}
