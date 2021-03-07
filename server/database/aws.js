require('dotenv').config();
const AWS = require('aws-sdk');

//configure aws with key and secret
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const S3Bucket = process.env.AWS_BUCKET_NAME;
// const S3 = new AWS.S3({
//   region: process.env.AWS_REGION,
//   apiVersion: 'latest',
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

const S3 = new AWS.S3();//create a new instance of s3
//payload for S3 api

// const uploadParams = {
//   ACL: 'public-read',
//   Body: photo.data,
//   Bucket: S3Bucket,
//   ContentType: 'image/jpeg',
//   Key: `${Date.now()}.jpg`,
// };

const uploadPhotoToS3 = (photo) => {
  const uploadParams = {
    ACL: 'public-read',
    Body: photo.data,
    // Bucket: process.env.AWS_BUCKET_NAME,
    Bucket: 'sdc-airbnb-userphotos',
    ContentType: 'image/jpeg',
    Key: `${Date.now()}.jpg`,
  };

  return new Promise((resolve, reject) => {
    S3.upload(uploadParams, (err, data) => {
      //console.log('Data: ', data)
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

module.exports = {
  S3,
  uploadPhotoToS3
};