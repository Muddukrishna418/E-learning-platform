import { describe, it, expect, beforeEach } from 'vitest';
import { EnrollmentService } from './enrollment';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(() => {
    localStorage.clear();
    service = new EnrollmentService({} as any);
  });

  it('should store a new enrollment locally when the backend is unavailable', () => {
    service.enroll('course-1').subscribe((result) => {
      expect(result.success).toBe(true);
      expect(result.source).toBe('local');
    });

    const stored = JSON.parse(localStorage.getItem('enrollments') || '[]');
    expect(stored).toContain('course-1');
  });
});
