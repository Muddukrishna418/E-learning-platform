import '@angular/compiler';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { MyCoursesService } from './my-courses';

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

describe('MyCoursesService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should send the stored JWT to the my-courses endpoint and map the backend response', () => {
    localStorage.setItem('authToken', 'demo.jwt.token');

    const http = {
      get: vi.fn().mockReturnValue(of([{ courseId: 4, title: 'React Basics', description: 'Learn React', progressPercentage: 40 }]))
    };

    const service = new MyCoursesService(http as any);

    service.getMyCourses().subscribe((courses) => {
      expect(courses).toHaveLength(1);
      expect(courses[0].title).toBe('React Basics');
      expect(courses[0].courseId).toBe(4);
      const options = (http.get as any).mock.calls[0][1];
      expect(options.headers.get('Authorization')).toBe('Bearer demo.jwt.token');
      expect((http.get as any).mock.calls[0][0]).toContain('/api/v1/enrollments/my-courses');
    });
  });
});
