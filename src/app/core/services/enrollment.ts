import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.post<{ message?: string; courseId?: string; firstContentId?: number }>(`${environment.apiUrl}/v1/enrollments`, { courseId }, { headers })
      .pipe(
        map((response) => {
          this.persistEnrollment(courseId);
          this.notifyEnrollmentChanged(courseId);

          return {
            success: true,
            message: response.message ?? 'Enrollment saved successfully.',
            source: 'backend' as const,
            courseId: response.courseId?.toString() ?? courseId,
            firstContentId: response.firstContentId
          };
        })
      );
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

    const raw = localStorage.getItem('enrolledCourseIds');
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((courseId) => String(courseId)) : [];
    } catch {
      return [];
    }
  }

  private persistEnrollment(courseId: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const current = this.getEnrolledCourseIds();
    if (current.includes(courseId)) {
      return;
    }

    localStorage.setItem('enrolledCourseIds', JSON.stringify([...current, courseId]));
  }
}
