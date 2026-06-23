import { environment } from './enrollment';

describe('Environment config', () => {
  it('should provide an API url', () => {
    expect(environment.apiUrl).toBe('http://localhost:8080/api');
  });
});
