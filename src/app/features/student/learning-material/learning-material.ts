import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseContentService, CourseContentItem } from '../../../core/services/course-content.service';
import { CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';

export interface StudyResource {
  title: string;
  url: string;
}

export function parseStudyPoints(value?: string): string[] {
  return (value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getFallbackContent(courseId: string, contentId: string): CourseContentItem | null {
  const fallbackMap: Record<string, Record<string, CourseContentItem>> = {
    '1': {
      '1': {
        id: 1,
        title: 'Welcome Introduction',
        type: 'VIDEO',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Start with the big picture of the course and understand the journey ahead.',
        summary: 'This lesson introduces the course roadmap and explains how each module connects to the final outcome.',
        contentBody: 'You will see the learning path, how to stay organized, and how to use the study material effectively.',
        learningObjectives: 'Understand the course roadmap\nRecognize the main milestones\nKnow how to study with focus',
        keyTakeaways: 'A clear plan improves retention\nThe first lesson sets the tone for the course\nConsistent study beats cramming',
        studyTips: 'Take short notes while you watch\nPause and summarize each section\nReview the summary before moving on',
        resources: 'Course roadmap | /courses/1\nStudy checklist | /courses/1',
        estimatedDuration: '12 min',
        difficulty: 'Beginner',
        orderIndex: 1,
        completed: false
      },
      '2': {
        id: 2,
        title: 'Project Setup',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        description: 'See how the project structure is organized before you build anything.',
        summary: 'This lesson explains the project layout, files, and the recommended workflow for building the app.',
        contentBody: 'You will learn where the main folders live, how the frontend and backend connect, and what to review before coding.',
        learningObjectives: 'Understand the project structure\nIdentify the main application folders\nFollow the recommended workflow',
        keyTakeaways: 'A clear structure speeds up development\nGood organization reduces confusion\nThe workflow matters as much as the code',
        studyTips: 'Review the folder map before coding\nCreate small notes for each section\nPractice the flow one step at a time',
        resources: 'Architecture overview | /courses/1\nDeveloper notes | /courses/1',
        estimatedDuration: '8 min',
        difficulty: 'Beginner',
        orderIndex: 2,
        completed: false
      },
      '3': {
        id: 3,
        title: 'Build Your First API',
        type: 'VIDEO',
        url: 'https://www.w3schools.com/html/movie.mp4',
        description: 'Create your first backend endpoint and connect it with the rest of the application.',
        summary: 'In this lesson you create a simple API flow and learn how to test it with confidence.',
        contentBody: 'You will build your first endpoint, inspect the response, and connect the lesson to the larger application experience.',
        learningObjectives: 'Create a simple backend endpoint\nTest the endpoint successfully\nConnect the flow to the app',
        keyTakeaways: 'Working endpoints are essential\nTesting helps you build with confidence\nSmall iterations lead to stable features',
        studyTips: 'Follow the steps slowly\nRecreate the endpoint from memory\nCheck the response after each change',
        resources: 'API checklist | /courses/1\nPostman guide | /courses/1',
        estimatedDuration: '15 min',
        difficulty: 'Intermediate',
        orderIndex: 3,
        completed: false
      }
    }
  };

  return fallbackMap[courseId]?.[contentId] ?? null;
}

@Component({
  selector: 'app-learning-material',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './learning-material.html',
  styleUrl: './learning-material.scss'
})
export class LearningMaterialComponent implements OnInit {
  courseId = '';
  contentId = '';
  item?: CourseContentItem;
  courseTitle = 'Course';
  loading = false;
  error = '';
  studyPoints: string[] = [];
  resourceLinks: StudyResource[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(CourseContentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('courseId') || '';
      this.contentId = params.get('contentId') || '';
      this.loadMaterial();
    });
  }

  get learningObjectives(): string[] {
    return parseStudyPoints(this.item?.learningObjectives || this.item?.summary);
  }

  get keyTakeaways(): string[] {
    return parseStudyPoints(this.item?.keyTakeaways || this.item?.summary);
  }

  get studyTips(): string[] {
    return parseStudyPoints(this.item?.studyTips || this.item?.summary);
  }

  markCompleted(): void {
    if (!this.item) {
      return;
    }

    this.contentService.markContentComplete(this.courseId, this.item.id).subscribe({
      next: (updated) => {
        this.item = { ...updated, completed: true };
      },
      error: () => {
        if (this.item) {
          this.item = { ...this.item, completed: true };
        }
      }
    });
  }

  private loadMaterial(): void {
    if (!this.courseId || !this.contentId) {
      this.error = 'Learning material could not be opened.';
      return;
    }

    const isEnrolled = this.enrollmentService.getEnrolledCourseIds().includes(this.courseId);
    if (!isEnrolled) {
      this.router.navigate(['/courses', this.courseId]);
      return;
    }

    this.loading = true;
    this.courseService.getCourseByIdFromApi(this.courseId).subscribe((course) => {
      this.courseTitle = course?.title || 'Course';
    });

    this.contentService.getContentById(this.courseId, this.contentId).subscribe({
      next: (material) => {
        this.item = material;
        this.studyPoints = parseStudyPoints(material.summary || material.description);
        this.resourceLinks = this.parseResources(material.resources);
        this.error = '';
        this.loading = false;
      },
      error: () => {
        const fallbackMaterial = getFallbackContent(this.courseId, this.contentId);
        if (fallbackMaterial) {
          this.item = fallbackMaterial;
          this.studyPoints = parseStudyPoints(fallbackMaterial.summary || fallbackMaterial.description);
          this.resourceLinks = this.parseResources(fallbackMaterial.resources);
          this.error = '';
        } else {
          this.error = 'This material is not available for your current enrollment.';
        }
        this.loading = false;
      }
    });
  }

  private parseResources(raw?: string): StudyResource[] {
    if (!raw) {
      return [];
    }

    return raw
      .split(/\n+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const parts = entry.split('|');
        return {
          title: parts[0]?.trim() || 'Resource',
          url: parts[1]?.trim() || '#'
        };
      });
  }
}
