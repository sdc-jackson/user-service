const app = require('./app.js');
const supertest = require('supertest');
const request = supertest(app);

describe('Root route', () => {

  it('should return 200 status code', async (done) => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    done();
  });

  it('should send HTML in response', async (done) => {
    const res = await request.get('/');
    expect(res.type).toBe('text/html')
    done();
  });

});
