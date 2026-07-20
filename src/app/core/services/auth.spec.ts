import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow demo credentials to log in', (done) => {
    service.login('newstudent@example.com', 'password123').subscribe((success) => {
      expect(success).toBeTrue();
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
      done();
    });
  });
});
