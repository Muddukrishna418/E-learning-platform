import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface CourseDetail {
  title: string;
  category: string;
  duration: string;
  level: string;
  logo: string;
  rating: string;
  description: string;
  outcomes: string[];
  lessons: string[];
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss'
})
export class CourseDetails {
  courseId = '1';

  private readonly courseMap: Record<string, CourseDetail> = {
    '1': {
      title: 'Full-Stack Web Development',
      category: 'Development',
      logo: 'WEB',
      duration: '8 weeks',
      level: 'Beginner',
      rating: '4.9 ★',
      description: 'Build complete web applications using modern frontend and backend tools.',
      outcomes: [
        'Create responsive user interfaces with HTML, CSS, and Angular.',
        'Connect a frontend app to APIs and manage data flow.',
        'Deploy and maintain a production-ready web project.'
      ],
      lessons: [
        'HTML, CSS, and responsive layouts',
        'JavaScript fundamentals and TypeScript',
        'Angular components and routing',
        'API integration and state management',
        'Testing, deployment, and best practices'
      ]
    },
    '2': {
      title: 'Digital Marketing Strategy',
      category: 'Marketing',
      logo: 'SEO',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: '4.8 ★',
      description: 'Learn how to plan campaigns, improve SEO, and grow brand reach online.',
      outcomes: [
        'Create effective content and campaign strategy.',
        'Track performance with analytics tools.',
        'Improve conversion with better audience targeting.'
      ],
      lessons: [
        'Brand positioning and messaging',
        'SEO basics and keyword strategy',
        'Paid ads and retargeting',
        'Email marketing and funnel design',
        'Analytics dashboard reporting'
      ]
    },
    '3': {
      title: 'Data Analytics Basics',
      category: 'Data',
      logo: 'DATA',
      duration: '5 weeks',
      level: 'Beginner',
      rating: '4.7 ★',
      description: 'Understand how to interpret data, build reports, and support decision-making.',
      outcomes: [
        'Read and analyze dashboards confidently.',
        'Use spreadsheets and BI tools for reporting.',
        'Identify trends and communicate insights clearly.'
      ],
      lessons: [
        'Data cleaning and preparation',
        'Charts, metrics, and KPIs',
        'Excel and dashboard basics',
        'Reporting and presentation skills',
        'Data-driven decision making'
      ]
    },
    '4': {
      title: 'UI/UX Design Masterclass',
      category: 'Design',
      logo: 'UX',
      duration: '7 weeks',
      level: 'Intermediate',
      rating: '4.9 ★',
      description: 'Master the process of designing interfaces that are both beautiful and usable.',
      outcomes: [
        'Create wireframes and interactive prototypes.',
        'Apply user-centered design principles.',
        'Improve accessibility and usability in products.'
      ],
      lessons: [
        'User research and empathy mapping',
        'Information architecture',
        'Wireframing and prototyping',
        'Visual design and design systems',
        'Usability testing and iteration'
      ]
    }
  };

  constructor(private route: ActivatedRoute) {
    this.courseId = this.route.snapshot.paramMap.get('id') || '1';
  }

  get course(): CourseDetail {
    return this.courseMap[this.courseId] || this.courseMap['1'];
  }
}
