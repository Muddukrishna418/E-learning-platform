import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface MyCourseEnrollment {
  courseId: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorName?: string;
  category?: string;
  progressPercentage?: number;
  enrollmentDate?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MyCoursesService {
  constructor(private http: HttpClient) {}

  getMyCourses(): Observable<MyCourseEnrollment[]> {
    const token = this.getStoredToken();

    if (!token) {
      return of([]);
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<MyCourseEnrollment[]>(`${environment.apiUrl}/v1/enrollments/my-courses`, { headers }).pipe(
      map((courses) => (Array.isArray(courses) ? courses.map((course) => this.normalizeCourse(course)) : [])),
      catchError((error) => {
        console.error('Failed to load my courses from the backend:', error);
        return of([]);
      })
    );
  }

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawToken = localStorage.getItem('authToken')?.trim();
    if (!rawToken) {
      return null;
    }

    return rawToken.startsWith('Bearer ') ? rawToken.slice(7).trim() : rawToken;
  }

  private normalizeCourse(course: Partial<MyCourseEnrollment> | null | undefined): MyCourseEnrollment {
    return {
      courseId: Number(course?.courseId ?? 0),
      title: course?.title ?? 'Untitled course',
      description: course?.description ?? 'Continue learning from your enrolled course.',
      thumbnailUrl: course?.thumbnailUrl,
      instructorName: course?.instructorName ?? 'Your mentor',
      category: course?.category ?? 'Learning path',
      progressPercentage: course?.progressPercentage ?? 0,
      enrollmentDate: course?.enrollmentDate ?? new Date().toISOString(),
      active: course?.active ?? true,
    };
  }
}
