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
      catchError((error) => {
        console.error('Login failed:', error);
        this.clearSession();
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
      catchError((error) => {
        console.error('Registration failed:', error);
        return of(false);
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
      if (response.userId) {
        localStorage.setItem('userId', String(response.userId));
      }
    }
  }

  private clearSession(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
    }
    this.isAuthenticatedSubject.next(false);
  }

  logout(): void {
    this.clearSession();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
