import { getFallbackContent, parseStudyPoints } from './learning-material';

describe('parseStudyPoints', () => {
  it('parses bullet points and removes empty entries', () => {
    expect(parseStudyPoints('Understand the lesson\nPractice the flow\n')).toEqual([
      'Understand the lesson',
      'Practice the flow'
    ]);
  });
});

describe('getFallbackContent', () => {
  it('returns a fallback lesson when the backend is unavailable', () => {
    const material = getFallbackContent('1', '1');

    expect(material?.title).toBe('Welcome Introduction');
    expect(material?.type).toBe('VIDEO');
  });
});
