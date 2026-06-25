import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface EnrollmentResult {
  success: boolean;
  message: string;
  source: 'backend' | 'local';
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  enroll(courseId: string): Observable<EnrollmentResult> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    if (!this.http || typeof this.http.post !== 'function') {
      this.persistLocalEnrollment(courseId);
      return of({
        success: true,
        message: 'Enrollment saved locally while the backend is unavailable.',
        source: 'local'
      });
    }

    return this.http.post<{ message?: string }>(`${environment.apiUrl}/v1/enrollments`, { courseId }, { headers }).pipe(
      map(() => ({
        success: true,
        message: 'Enrollment saved successfully.',
        source: 'backend' as const
      })),
      catchError(() => {
        this.persistLocalEnrollment(courseId);
        return of({
          success: true,
          message: 'Enrollment saved locally while the backend is unavailable.',
          source: 'local' as const
        });
      })
    );
  }

  private persistLocalEnrollment(courseId: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const current = JSON.parse(localStorage.getItem('enrollments') || '[]') as string[];
    if (!current.includes(courseId)) {
      current.push(courseId);
      localStorage.setItem('enrollments', JSON.stringify(current));
    }
  }

  getEnrolledCourseIds(): string[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    return JSON.parse(localStorage.getItem('enrollments') || '[]') as string[];
  }
}
