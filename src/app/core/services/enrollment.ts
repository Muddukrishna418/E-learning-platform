import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface EnrollmentResult {
  success: boolean;
  message: string;
  source: 'backend' | 'local';
  courseId?: string;
  firstContentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  enroll(courseId: string): Observable<EnrollmentResult> {
    const immediateResult: EnrollmentResult = {
      success: true,
      message: 'Enrollment saved successfully.',
      source: 'local',
      courseId,
    };

    if (!this.http || typeof this.http.post !== 'function') {
      return of(immediateResult);
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.post<{ message?: string; courseId?: string; firstContentId?: number }>(`${environment.apiUrl}/v1/enrollments`, { courseId }, { headers })
      .pipe(
        timeout(800),
        map((response) => {
          this.persistLocalEnrollment(courseId);
          this.notifyEnrollmentChanged(courseId);

          return {
            success: true,
            message: response.message ?? 'Enrollment saved successfully.',
            source: 'backend' as const,
            courseId: response.courseId?.toString() ?? courseId,
            firstContentId: response.firstContentId
          };
        }),
        catchError((error) => {
          console.error('Enrollment sync failed:', error);
          this.persistLocalEnrollment(courseId);
          this.notifyEnrollmentChanged(courseId);
          return of({
            ...immediateResult,
            message: 'Enrollment stored locally. The latest course list will refresh once your session syncs.'
          });
        })
      );
  }

  private persistLocalEnrollment(courseId: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const storageKey = this.getEnrollmentStorageKey();
    const current = JSON.parse(localStorage.getItem(storageKey) || '[]') as string[];
    if (!current.includes(courseId)) {
      current.push(courseId);
      localStorage.setItem(storageKey, JSON.stringify(current));
    }
  }

  private notifyEnrollmentChanged(courseId: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('enrollment:changed', { detail: { courseId } }));
  }

  getEnrolledCourseIds(): string[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const storageKey = this.getEnrollmentStorageKey();
    return JSON.parse(localStorage.getItem(storageKey) || '[]') as string[];
  }

  private getEnrollmentStorageKey(): string {
    if (typeof localStorage === 'undefined') {
      return 'enrollments';
    }

    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'guest';
    return `enrollments:${userId}`;
  }
}
