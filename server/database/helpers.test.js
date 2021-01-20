const { generatePhoto } = require('./helpers.js');

describe('generatePhoto', () => {

  it('should return a photo stream object', async (done) => {
    const response = await generatePhoto();
    expect(response.status).toBe(200);
    expect(typeof response).toBe('object');
    expect(response.headers['content-type']).toBe('image/jpeg');
    expect(response.config.responseType).toBe('stream');
    done();
  });

});