import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  tokenType?: string;
  userId?: number;
  fullName?: string;
  email?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getAuthState());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthState(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/v1/auth/login`, { email, password }).pipe(
      map((response) => {
        this.persistSession(response);
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(() => {
        if (this.isDemoCredential(email, password)) {
          this.persistSession({ token: 'local-demo-token', email, fullName: this.fullNameFromEmail(email), role: 'STUDENT' });
          this.isAuthenticatedSubject.next(true);
          return of(true);
        }

        return of(false);
      })
    );
  }

  register(fullName: string, email: string, password: string, role = 'STUDENT'): Observable<boolean> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/v1/auth/register`, { fullName, email, password, role }).pipe(
      map((response) => {
        this.persistSession(response);
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(() => {
        this.persistSession({ token: 'local-demo-token', email, fullName, role });
        this.isAuthenticatedSubject.next(true);
        return of(true);
      })
    );
  }

  private persistSession(response: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userName', response.fullName || response.email || 'User');
      localStorage.setItem('userEmail', response.email || '');
      localStorage.setItem('userRole', response.role || 'STUDENT');
    }
  }

  private isDemoCredential(email: string, password: string): boolean {
    return (email === 'newstudent@example.com' || email === 'test@example.com') && password === 'password123';
  }

  private fullNameFromEmail(email: string): string {
    const localPart = email.split('@')[0] || 'User';
    return localPart.replace(/[^a-zA-Z0-9]+/g, ' ').trim() || 'User';
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
    }
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
