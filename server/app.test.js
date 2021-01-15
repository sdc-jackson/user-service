const app = require('./app.js');
const supertest = require('supertest');
const request = supertest(app);

test('Root route should return 200 status code.', async (done) => {
  const res = await request.get('/');
  expect(res.status).toBe(200);
  done();
});