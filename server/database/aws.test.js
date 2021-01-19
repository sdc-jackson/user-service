const { S3, uploadPhotoToS3 } = require('./aws.js');
const { generatePhoto } = require('./helpers.js');
const axios = require('axios');

describe('S3 bucket', () => {

  it('should exist and allow access', async (done) => {
    const response = await S3.headBucket({ Bucket: process.env.AWS_BUCKET_KEY }).promise();
    expect(response).toStrictEqual({});
    done();
  });

  it('should store a photo when uploadPhotoToS3 is called', async (done) => {
    const photo = await generatePhoto();
    const S3Url = await uploadPhotoToS3(photo);
    expect(typeof S3Url).toBe('string');
    done();
  });

});

