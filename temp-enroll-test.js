const base='http://localhost:8081';
const email='verify'+Date.now()+'@example.com';
const password='Pass1234!';
async function req(path, opts={}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const res = await fetch(base + path, { headers, ...opts });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), body };
}
(async () => {
  const reg = await req('/api/v1/auth/register', { method: 'POST', body: JSON.stringify({ fullName: 'Verify User', email, password, role: 'STUDENT' }) });
  console.log('REGISTER', reg.status, JSON.stringify(reg.body));
  const login = await req('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  console.log('LOGIN', login.status, JSON.stringify(login.body));
  const token = login.body && login.body.token;
  if (!token) process.exit(0);
  const courses = await req('/api/v1/courses', { method: 'GET' });
  console.log('COURSES', courses.status, JSON.stringify(courses.body));
  const firstCourseId = Array.isArray(courses.body) ? courses.body[0]?.id : (courses.body && courses.body.content && courses.body.content[0]?.id);
  const enroll = await req('/api/v1/enrollments', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify({ courseId: String(firstCourseId || 1) })
  });
  console.log('ENROLL', enroll.status, JSON.stringify(enroll.body));
})();
