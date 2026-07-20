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
}

@Injectable({
  providedIn: 'root'
})
export class MyCoursesService {
  constructor(private http: HttpClient) {}

  getMyCourses(): Observable<MyCourseEnrollment[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!token || token === 'demo-token' || token.split('.').length !== 3) {
      return of([]);
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<MyCourseEnrollment[]>(`${environment.apiUrl}/v1/enrollments/my-courses`, { headers }).pipe(
      map((courses) => courses ?? []),
      catchError(() => of([]))
    );
  }
}
