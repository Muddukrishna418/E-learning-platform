import { Injectable } from '@angular/core';

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
      rating: '4.9 ★'
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
      rating: '4.9 ★'
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
      rating: '4.9 ★'
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
      'AI',
      'Machine Learning',
      'Cloud',
      'Cybersecurity'
    ];
    const logos = ['WEB', 'SEO', 'DATA', 'UX', 'BUS', 'IT', 'PD', 'PHOTO', 'AI', 'ML', 'CLOUD', 'SEC'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    let nextId = this.courses.length + 1;
    for (let i = 0; i < count; i++) {
      const id = (nextId++).toString();
      const cat = categories[i % categories.length];
      const logo = logos[i % logos.length];
      const level = levels[i % levels.length];
      const durationWeeks = 4 + (i % 9); // 4-12 weeks
      // Use demo rating to match Full-Stack Web Development for a consistent showcase
      const rating = '4.9 ★';

      this.courses.push({
        id,
        title: `${cat} Course ${id}`,
        description: `Auto-generated ${cat} course #${id} covering core concepts and practical exercises.`,
        duration: `${durationWeeks} weeks`,
        level,
        category: cat,
        logo,
        rating
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
