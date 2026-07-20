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
  completed?: boolean;
  summary?: string;
  contentBody?: string;
  learningObjectives?: string;
  keyTakeaways?: string;
  studyTips?: string;
  resources?: string;
  estimatedDuration?: string;
  difficulty?: string;
}

@Injectable({ providedIn: 'root' })
export class CourseContentService {
  constructor(private http: HttpClient) {}

  getCourseContent(courseId: string): Observable<CourseContentItem[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<CourseContentItem[]>(`${environment.apiUrl}/v1/enrollments/${courseId}/content`, { headers });
  }

  getContentById(courseId: string, contentId: string): Observable<CourseContentItem> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<CourseContentItem>(`${environment.apiUrl}/v1/enrollments/${courseId}/content/${contentId}`, { headers });
  }

  markContentComplete(courseId: string, contentId: number): Observable<CourseContentItem> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.post<CourseContentItem>(`${environment.apiUrl}/v1/enrollments/${courseId}/content/${contentId}/complete`, {}, { headers });
  }
}
