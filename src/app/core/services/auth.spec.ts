import { describe, it, expect, beforeEach, vi } from 'vitest';
import { throwError } from 'rxjs';
import { Auth } from './auth';

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

describe('Auth', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('should not create a fake authenticated session when the backend rejects login', async () => {
    const http = {
      post: vi.fn().mockReturnValue(throwError(() => new Error('Unauthorized')))
    };

    const service = new Auth(http as any);

    await new Promise<void>((resolve) => {
      service.login('newstudent@example.com', 'password123').subscribe((success) => {
        expect(success).toBe(false);
        expect(localStorage.getItem('isAuthenticated')).toBeNull();
        expect(localStorage.getItem('authToken')).toBeNull();
        resolve();
      });
    });
  });
});
