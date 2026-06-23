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

  constructor() {
    // Ensure there are at least 50 additional auto-generated courses
    this.generateAdditionalCourses(50);
  }

  private generateAdditionalCourses(count: number) {
    const categories = [
      'Development',
      'Marketing',
      'Data',
      'Design',
      'Business',
      'IT',
      'Personal Development',
      'Photography',
      'Music',
      'Language'
    ];
    const logos = ['WEB', 'SEO', 'DATA', 'UX', 'BUS', 'IT', 'PD', 'PHOTO', 'MUS', 'LANG'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    let nextId = this.courses.length + 1;
    for (let i = 0; i < count; i++) {
      const id = (nextId++).toString();
      const cat = categories[i % categories.length];
      const logo = logos[i % logos.length];
      const level = levels[i % levels.length];
      const durationWeeks = 4 + (i % 9); // 4-12 weeks
      const rating = (4.5 + (i % 6) * 0.1).toFixed(1);

      this.courses.push({
        id,
        title: `${cat} Course ${id}`,
        description: `Auto-generated ${cat} course #${id} covering core concepts and practical exercises.`,
        duration: `${durationWeeks} weeks`,
        level,
        category: cat,
        logo,
        rating: `${rating} ★`
      });
    }
  }

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
