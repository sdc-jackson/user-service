const axios = require('axios');
const { mongoose, User } = require('./schema.js');

const generatePhoto = async () => {
  try {
    const photo = await axios({
      url: 'https://picsum.photos/75',
      method: 'GET',
      responseType: 'stream'
    });
    return photo;
  } catch (err) {
    console.error(err);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.find({ userId });
    return user;
  } catch (err) {
    return new Error({ message: err });
  }
};

module.exports = {
  generatePhoto,
  getUserById
};