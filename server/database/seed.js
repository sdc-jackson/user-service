require('dotenv').config();
const axios = require('axios');
const AWS = require('./aws.js')

const generatePhoto = async () => {
  const photo = await axios({
    url: 'https://picsum.photos/50',
    method: 'GET',
    responseType: 'stream'
  });
  return photo;
};