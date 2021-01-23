const app = require('./app.js');
const supertest = require('supertest');
const request = supertest(app);

describe('/users/:userId', () => {

  test('returns user information for a given user id', async (done) => {
    const response = await request.get('/users/101');
    expect(response.body._id).toBeDefined();
    done();
  });

  test('returns a 404 for an invalid user id', async (done) => {
    const response = await request.get('/users/2001');
    expect(response.status).toBe(404);
    done();
  });

});

describe('/users/:userId/id', () => {

  test('returns username and avatar url for a given user id', async (done) => {
    const response = await request.get('/users/101/id');
    expect(response.body).toBeDefined();
    done();
  });

  test('returns a 404 for an invalid user id', async (done) => {
    const response = await request.get('/users/2001/id');
    expect(response.status).toBe(404);
    done();
  });

});

describe('/users/:userId/super', () => {

  test('returns superhost status of a user given a user id', async (done) => {
    const response = await request.get('/users/101/super');
    expect(response.body).toBeDefined();
    done();
  });

  test('returns a 404 for an invalid user id', async (done) => {
    const response = await request.get('/users/2001/super');
    expect(response.status).toBe(404);
    done();
  });

});