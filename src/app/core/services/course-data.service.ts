import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  logo: string;
  logoUrl?: string;
  rating: string;
  price: number;
  students: number;
  lessonsCount: number;
  outcomes?: string[];
  lessons?: string[];
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
      logoUrl: 'assets/logos/1.svg',
      rating: '4.9 ★',
      price: 4999,
      students: 2840,
      lessonsCount: 12,
      outcomes: [
        'Build full-stack applications with Angular and Node.js',
        'Connect frontends to REST APIs',
        'Deploy apps to cloud platforms'
      ],
      lessons: ['Frontend fundamentals', 'Backend basics', 'APIs and integration', 'Testing and deployment']
    },
    {
      id: '2',
      title: 'Digital Marketing Strategy',
      description: 'Master SEO, content, and campaign planning.',
      duration: '6 weeks',
      level: 'Intermediate',
      category: 'Marketing',
      logo: 'SEO',
      logoUrl: 'assets/logos/2.svg',
      rating: '4.9 ★',
      price: 3499,
      students: 1985,
      lessonsCount: 9
    },
    {
      id: '3',
      title: 'Data Analytics Basics',
      description: 'Understand dashboards, metrics, and insights.',
      duration: '5 weeks',
      level: 'Beginner',
      category: 'Data',
      logo: 'DATA',
      logoUrl: 'assets/logos/3.svg',
      rating: '4.9 ★',
      price: 2999,
      students: 1560,
      lessonsCount: 8
    },
    {
      id: '4',
      title: 'UI/UX Design Masterclass',
      description: 'Create beautiful, user-friendly interfaces.',
      duration: '7 weeks',
      level: 'Intermediate',
      category: 'Design',
      logo: 'UX',
      logoUrl: 'assets/logos/4.svg',
      rating: '4.9 ★',
      price: 3899,
      students: 1745,
      lessonsCount: 10
    }
    ,
    {
      id: '5',
      title: 'Introduction to Artificial Intelligence',
      description: 'Foundations of AI: agents, search, reasoning, and ethics.',
      duration: '6 weeks',
      level: 'Beginner',
      category: 'AI',
      logo: 'AI',
      logoUrl: 'assets/logos/5.svg',
      rating: '4.9 ★',
      price: 4299,
      students: 2130,
      lessonsCount: 11,
      outcomes: [
        'Understand core AI concepts',
        'Implement simple search and reasoning agents',
        'Discuss AI ethics and impacts'
      ],
      lessons: ['AI overview', 'Search & planning', 'Knowledge representation', 'Ethics in AI']
    },
    {
      id: '6',
      title: 'Machine Learning Basics',
      description: 'Supervised and unsupervised learning fundamentals.',
      duration: '7 weeks',
      level: 'Beginner',
      category: 'Machine Learning',
      logo: 'ML',
      logoUrl: 'assets/logos/6.svg',
      rating: '4.9 ★',
      price: 4499,
      students: 2310,
      lessonsCount: 13,
      outcomes: [
        'Understand supervised and unsupervised learning techniques',
        'Train and evaluate simple ML models',
        'Apply basic feature engineering and model selection'
      ],
      lessons: [
        'Introduction to machine learning',
        'Regression and classification',
        'Model evaluation and validation',
        'Unsupervised learning basics',
        'Feature engineering and pipelines'
      ]
    },
    {
      id: '7',
      title: 'Deep Learning Fundamentals',
      description: 'Neural networks, training, and model evaluation.',
      duration: '8 weeks',
      level: 'Intermediate',
      category: 'Machine Learning',
      logo: 'DL',
      logoUrl: 'assets/logos/7.svg',
      rating: '4.9 ★',
      price: 5299,
      students: 2485,
      lessonsCount: 14,
      outcomes: [
        'Build and train neural networks',
        'Understand optimization and regularization',
        'Work with frameworks like TensorFlow or PyTorch'
      ],
      lessons: [
        'Neural network basics',
        'Backpropagation and optimization',
        'CNNs and RNNs overview',
        'Transfer learning and fine-tuning',
        'Model debugging and deployment'
      ]
    },
    {
      id: '8',
      title: 'NLP with Transformers',
      description: 'Modern natural language processing using transformer models.',
      duration: '6 weeks',
      level: 'Intermediate',
      category: 'AI',
      logo: 'NLP',
      logoUrl: 'assets/logos/8.svg',
      rating: '4.9 ★',
      price: 5099,
      students: 2380,
      lessonsCount: 12,
      outcomes: [
        'Understand transformer architectures',
        'Fine-tune pre-trained language models',
        'Build NLP pipelines for common tasks'
      ],
      lessons: [
        'Text preprocessing and tokenization',
        'Attention mechanisms and transformers',
        'Fine-tuning BERT/GPT-style models',
        'Sequence generation and summarization',
        'Evaluation and deployment'
      ]
    },
    {
      id: '9',
      title: 'Computer Vision Essentials',
      description: 'Image processing and core CV techniques.',
      duration: '6 weeks',
      level: 'Beginner',
      category: 'AI',
      logo: 'CV',
      logoUrl: 'assets/logos/9.svg',
      rating: '4.9 ★',
      price: 4799,
      students: 2215,
      lessonsCount: 11,
      outcomes: [
        'Apply image preprocessing and augmentation',
        'Train convolutional networks for vision tasks',
        'Implement basic detection and segmentation pipelines'
      ],
      lessons: [
        'Image fundamentals and preprocessing',
        'Convolutional neural networks',
        'Data augmentation and regularization',
        'Object detection basics',
        'Deploying vision models'
      ]
    },
    {
      id: '10',
      title: 'Reinforcement Learning Intro',
      description: 'Learn agents, environments, and reward-driven training.',
      duration: '6 weeks',
      level: 'Advanced',
      category: 'AI',
      logo: 'RL',
      logoUrl: 'assets/logos/10.svg',
      rating: '4.9 ★',
      price: 5599,
      students: 2670,
      lessonsCount: 15,
      outcomes: [
        'Understand RL problem framing and MDPs',
        'Implement value and policy-based algorithms',
        'Evaluate and tune RL agents'
      ],
      lessons: [
        'RL fundamentals and MDPs',
        'Value-based methods (Q-learning)',
        'Policy gradients and actor-critic',
        'Introduction to deep RL',
        'Benchmarking and environment design'
      ]
    }
  ];

  constructor(private http: HttpClient) {
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
      'AI',
      'Machine Learning',
      'Cloud',
      'Cybersecurity'
    ];
    const logos = ['WEB', 'SEO', 'DATA', 'UX', 'BUS', 'IT', 'PD', 'PHOTO', 'AI', 'ML', 'CLOUD', 'SEC'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    let nextId = this.courses.length + 1;

    // Topic templates per category for meaningful course titles
    const topicsMap: { [key: string]: string[] } = {
      Development: [
        'Python for Developers',
        'JavaScript Deep Dive',
        'Full-Stack with Node & Angular',
        'React & Redux',
        'TypeScript Mastery',
        'Backend with Django',
        'Mobile Apps with Flutter',
        'DevOps & CI/CD',
        'Testing & TDD',
        'Game Development with Unity'
      ],
      Marketing: [
        'Content Marketing Strategy',
        'SEO Fundamentals',
        'Social Media Advertising',
        'Email Marketing Essentials',
        'PPC & Google Ads',
        'Brand Strategy',
        'Growth Hacking'
      ],
      Data: [
        'Data Analysis with Python',
        'SQL for Data Analysis',
        'Data Visualization with Power BI',
        'Statistics for Data Science',
        'Big Data Basics'
      ],
      Design: [
        'UI Design Fundamentals',
        'UX Research Methods',
        'Figma for Designers',
        'Interaction Design'
      ],
      Business: [
        'Entrepreneurship 101',
        'Product Management Basics',
        'Lean Startup',
        'Financial Modeling'
      ],
      IT: [
        'Networking Fundamentals',
        'Linux Administration',
        'Windows Server Basics',
        'Cloud Infrastructure'
      ],
      'Personal Development': [
        'Productivity Hacks',
        'Communication Skills',
        'Career Development'
      ],
      Photography: [
        'Photography Fundamentals',
        'Portrait Photography',
        'Landscape Photography'
      ],
      AI: [
        'Intro to AI',
        'AI for Business',
        'Applied AI Projects'
      ],
      'Machine Learning': [
        'Intro to Machine Learning',
        'Supervised Learning',
        'Model Deployment',
        'Feature Engineering'
      ],
      Cloud: [
        'AWS Fundamentals',
        'Azure Essentials',
        'Google Cloud Overview'
      ],
      Cybersecurity: [
        'Cybersecurity Fundamentals',
        'Network Security',
        'Ethical Hacking Basics'
      ]
    };

    const perCategoryCount: { [key: string]: number } = {};

    for (let i = 0; i < count; i++) {
      const id = (nextId++).toString();
      const cat = categories[i % categories.length];
      const logo = logos[i % logos.length];
      const level = levels[i % levels.length];
      const durationWeeks = 4 + (i % 9); // 4-12 weeks
      const rating = '4.9 ★';
      const price = 1999 + ((i % 8) * 599);
      const students = 900 + (i * 137);
      const lessonsCount = 4 + (i % 7);

      // Assign a per-course logo file so autogenerated courses have unique logos
      const logoUrl = `assets/logos/${id}.svg`;

      // Decide a descriptive title for the category
      perCategoryCount[cat] = (perCategoryCount[cat] || 0) + 1;
      const topics = topicsMap[cat] || [`${cat} Fundamentals`, `${cat} Advanced`];
      const topicIndex = (perCategoryCount[cat] - 1) % topics.length;
      const repeatGroup = Math.floor((perCategoryCount[cat] - 1) / topics.length);
      const suffix = repeatGroup > 0 ? ` - Part ${repeatGroup + 1}` : '';
      const title = `${topics[topicIndex]}${suffix}`;

      const description = `In-depth ${title}: practical lessons and projects to build real skills in ${cat}.`;

      const outcomes = [
        `Gain practical skills in ${title}`,
        `Build a hands-on project using ${title} techniques`,
        `Prepare to apply ${title} concepts in real scenarios`
      ];

      const lessons = [
        `Introduction to ${title}`,
        `${title} core concepts and fundamentals`,
        `Hands-on project: build a ${title.toLowerCase()}`,
        `Next steps and further learning`
      ];

      this.courses.push({
        id,
        title,
        description,
        duration: `${durationWeeks} weeks`,
        level,
        category: cat,
        logo,
        logoUrl,
        rating,
        price,
        students,
        lessonsCount,
        outcomes,
        lessons
      });
    }
  }

  getCourses(): Course[] {
    return this.courses;
  }

  private inferCategory(course: Partial<Course> | any): string {
    const explicitCategory = `${course?.category ?? course?.categoryName ?? ''}`.trim();
    if (explicitCategory) {
      return explicitCategory;
    }

    const haystack = `${course?.title ?? ''} ${course?.description ?? ''}`.toLowerCase();
    const categoryHints: Array<[string, string[]]> = [
      ['Development', ['web development', 'developer', 'javascript', 'angular', 'spring', 'frontend', 'backend', 'react', 'node', 'typescript', 'full-stack', 'python', 'java', 'mobile', 'devops', 'testing', 'game', 'flutter', 'django']],
      ['Marketing', ['marketing', 'seo', 'social media', 'advertising', 'campaign', 'brand', 'growth', 'email', 'ppc', 'content marketing']],
      ['Data', ['data', 'analytics', 'dashboard', 'reporting', 'metrics', 'statistics', 'sql', 'database']],
      ['Design', ['design', 'ux', 'ui', 'interface', 'wireframe', 'user experience', 'visual']],
      ['AI', ['artificial intelligence', 'ai', 'nlp', 'transformers', 'vision', 'deep learning', 'reinforcement']],
      ['Machine Learning', ['machine learning', 'neural', 'classification', 'regression', 'model']],
      ['Cloud', ['cloud', 'aws', 'azure', 'docker', 'kubernetes']],
      ['Cybersecurity', ['security', 'cyber', 'ethical hacking', 'penetration', 'network']],
      ['Photography', ['photography', 'photo', 'camera', 'editing']],
      ['Business', ['business', 'leadership', 'management', 'strategy']],
      ['IT', ['it', 'systems', 'networking', 'infrastructure', 'support']],
      ['Personal Development', ['personal', 'communication', 'productivity', 'career', 'mindset']]
    ];

    const matchedCategory = categoryHints.find(([, keywords]) => keywords.some((keyword) => haystack.includes(keyword)));
    return matchedCategory?.[0] ?? 'Development';
  }

  private normalizeCourse(course: Partial<Course> | any, fallback?: Course): Course {
    const normalizedId = course?.id?.toString() ?? fallback?.id ?? '';
    const normalizedTitle = course?.title ?? fallback?.title ?? 'Untitled Course';
    const normalizedDescription = course?.description ?? fallback?.description ?? 'A practical course designed to build valuable skills.';
    const normalizedDuration = course?.duration ?? fallback?.duration ?? 'Self-paced';
    const normalizedLevel = course?.level ?? fallback?.level ?? 'Beginner';
    const normalizedCategory = this.inferCategory(course) ?? fallback?.category ?? 'Development';
    const normalizedLogo = course?.logo ?? fallback?.logo ?? normalizedTitle.slice(0, 3).toUpperCase();
    const normalizedLogoUrl = course?.logoUrl ?? course?.thumbnailUrl ?? fallback?.logoUrl;
    const normalizedRating = course?.rating ?? (typeof course?.averageRating === 'number' ? `${course.averageRating.toFixed(1)} ★` : fallback?.rating ?? '4.8 ★');
    const normalizedPrice = Number(course?.price ?? course?.amount ?? fallback?.price ?? 2999);
    const normalizedStudents = Number(course?.students ?? course?.enrolledStudents ?? fallback?.students ?? 1200);
    const normalizedLessonsCount = Number(course?.lessonsCount ?? course?.lessonCount ?? fallback?.lessonsCount ?? (course?.lessons ?? fallback?.lessons)?.length ?? 6);

    return {
      id: normalizedId,
      title: normalizedTitle,
      description: normalizedDescription,
      duration: normalizedDuration,
      level: normalizedLevel,
      category: normalizedCategory,
      logo: normalizedLogo,
      logoUrl: normalizedLogoUrl,
      rating: normalizedRating,
      price: normalizedPrice,
      students: normalizedStudents,
      lessonsCount: normalizedLessonsCount,
      outcomes: course?.outcomes ?? fallback?.outcomes,
      lessons: course?.lessons ?? fallback?.lessons,
    };
  }

  getCoursesFromApi(): Observable<Course[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<Partial<Course>[] | { content?: Partial<Course>[] }>(`${environment.apiUrl}/v1/courses`, { headers }).pipe(
      timeout(8000),
      map((response) => {
        const courses = Array.isArray(response) ? response : response?.content ?? [];
        const normalizedCourses = courses.map((course) => this.normalizeCourse(course));
        return normalizedCourses.length > 0 ? normalizedCourses : this.courses;
      }),
      catchError(() => of(this.courses))
    );
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  getCourseByIdFromApi(id: string): Observable<Course | undefined> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<Partial<Course> | any>(`${environment.apiUrl}/v1/courses/${id}`, { headers }).pipe(
      timeout(8000),
      map((course) => {
        if (!course) {
          return this.getCourseById(id);
        }

        return this.normalizeCourse(course, this.getCourseById(id));
      }),
      catchError(() => of(this.getCourseById(id)))
    );
  }

  getCoursesByCategory(category: string): Course[] {
    return this.courses.filter(course => course.category === category);
  }
}
