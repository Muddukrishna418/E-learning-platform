import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getAuthState());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private mockEmail = 'test@example.com';
  private mockPassword = 'password123';

  constructor() {}

  private getAuthState(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  login(email: string, password: string): boolean {
    if (email === this.mockEmail && password === this.mockPassword) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
      }
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userName');
    }
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
