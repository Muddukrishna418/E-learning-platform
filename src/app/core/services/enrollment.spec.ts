import '@angular/compiler';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { EnrollmentService } from './enrollment';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  },
  configurable: true,
});

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(() => {
    localStorage.clear();
    service = new EnrollmentService({} as any);
  });

  it('should propagate an enrollment error when the backend request fails', () => {
    const http = {
      post: vi.fn().mockReturnValue(throwError(() => new Error('network-error')))
    };

    const failingService = new EnrollmentService(http as any);

    failingService.enroll('course-1').subscribe({
      next: () => {
        throw new Error('Expected the enrollment request to fail');
      },
      error: (error) => {
        expect(error).toBeDefined();
      }
    });

    expect(localStorage.getItem('enrollments:guest')).toBeNull();
  });

  it('should return a backend success result when the request succeeds', () => {
    const http = {
      post: vi.fn().mockReturnValue(of({ message: 'Enrollment saved successfully.' }))
    };

    const successService = new EnrollmentService(http as any);

    successService.enroll('course-2').subscribe((result) => {
      expect(result.success).toBe(true);
      expect(result.source).toBe('backend');
      expect(result.message).toContain('Enrollment saved successfully');
    });

    expect(localStorage.getItem('enrollments:guest')).toBeNull();
  });
});
