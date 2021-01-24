const app = require('./app.js');
const supertest = require('supertest');
const request = supertest(app);

jest.mock('./database/helpers.js');
const { getUserById, getUserNameAndPhoto, getUserSuperhostStatus } = require('./database/helpers.js');

getUserById.mockImplementation((id) => id >= 100 && id <= 199 ? { _id: 101 } : null);
getUserNameAndPhoto.mockImplementation((id) => id >= 100 && id <= 199 ? { name: 'Tom' } : null);
getUserSuperhostStatus.mockImplementation((id) => id >= 100 && id <= 199 ? { isSuperhost: false } : null);

beforeAll(() => process.env.NODE_ENV = 'test');

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
    expect(response.body.name).toBeDefined();
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
    expect(response.body.isSuperhost).toBeDefined();
    done();
  });

  test('returns a 404 for an invalid user id', async (done) => {
    const response = await request.get('/users/2001/super');
    expect(response.status).toBe(404);
    done();
  });

});