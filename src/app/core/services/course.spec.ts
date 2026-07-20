import { Course } from './course';

describe('Course', () => {
  it('should describe a course model', () => {
    const course: Course = {
      title: 'Full-Stack Web Development',
      description: 'Learn modern web technologies from scratch.',
      price: 999,
    };

    expect(course.title).toBe('Full-Stack Web Development');
  });
});
