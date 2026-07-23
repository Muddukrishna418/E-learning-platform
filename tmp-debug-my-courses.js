const http = require('http');
const body = JSON.stringify({ email: 'test@example.com', password: 'password123' });
const loginOptions = {
  hostname: 'localhost',
  port: 8082,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};
const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('LOGIN_STATUS', res.statusCode);
    console.log('LOGIN_BODY', data);
    try {
      const json = JSON.parse(data);
      const token = json.token;
      if (!token) {
        console.error('NO_TOKEN');
        return;
      }
      const coursesOptions = {
        hostname: 'localhost',
        port: 8082,
        path: '/api/v1/enrollments/my-courses',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const coursesReq = http.request(coursesOptions, (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => (data2 += chunk));
        res2.on('end', () => {
          console.log('COURSES_STATUS', res2.statusCode);
          console.log('COURSES_BODY', data2);
        });
      });
      coursesReq.on('error', (e) => console.error('COURSES_ERROR', e.message));
      coursesReq.end();
    } catch (e) {
      console.error('PARSE_ERROR', e.message);
    }
  });
});
loginReq.on('error', (e) => console.error('LOGIN_ERROR', e.message));
loginReq.write(body);
loginReq.end();