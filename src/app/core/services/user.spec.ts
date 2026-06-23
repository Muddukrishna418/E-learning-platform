import { User } from './user';

describe('User', () => {
  it('should describe a user model', () => {
    const user: User = {
      name: 'Student User',
      email: 'student@example.com',
      role: 'student',
    };

    expect(user.email).toBe('student@example.com');
  });
});
