require('dotenv').config();

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  region: 'us-west-2',
  apiVersion: 'latest',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

S3.listBuckets((err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data.Buckets);
  }
});