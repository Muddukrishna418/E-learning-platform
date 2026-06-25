import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CourseContentItem {
  id: number;
  title: string;
  type: string;
  url: string;
  description?: string;
  orderIndex: number;
}

@Injectable({ providedIn: 'root' })
export class CourseContentService {
  constructor(private http: HttpClient) {}

  getCourseContent(courseId: string): Observable<CourseContentItem[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<CourseContentItem[]>(`${environment.apiUrl}/v1/enrollments/${courseId}/content`, { headers });
  }
}
