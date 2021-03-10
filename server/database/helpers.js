const axios = require('axios');
const { User } = require('./schema.js');

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
    console.log('getUserById :', userId);
    const user = await User.findOne({ userId });
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getUserNameAndPhoto = async (userId) => {
  try {
    const { name, avatarUrl } = await User.findOne({ userId }, 'name avatarUrl');
    return { name, avatarUrl };
  } catch (err) {
    return null;
  }
};

const getUserSuperhostStatus = async (userId) => {
  try {
    const { isSuperhost } = await User.findOne({ userId }, 'isSuperhost');
    return { isSuperhost };
  } catch (err) {
    return null;
  }
};

//SDC
//tested using Postman
//insert UserInfo based on username
//http://localhost:5007/users/insertUser
const insertUserInfo = (userInfoObj) => {
  //check user exists, if not, insert
  const userDetails = new User(userInfoObj);
  return User.findOne({ name: userInfoObj.name })
    .then(result => {
      if (!result) {
        return userDetails.save();
      } else {
        return ('Username already exists, not added');
      }

    })
    .catch(err => console.log(err))

};

//update UserInfo based on userID
const updateUserInfo = (userInfoObj) => {

  return User.updateMany({ userId: userInfoObj.userId },
    {
      name: userInfoObj.name,
      joinDate: userInfoObj.joinDate,
      bio: userInfoObj.bio,
      avatarUrl: userInfoObj.avatarUrl,
      isSuperhost: userInfoObj.isSuperhost,
      identityVerified: userInfoObj.identityVerified,
      languages: userInfoObj.languages,
      responseRate: userInfoObj.responseRate,
      responseTime: userInfoObj.responseTime
    })
    .then(results => {
      return (results);
    })
    .catch(err => console.log(err))

}

//delete user based on userid
const deleteUserInfo = (userid) => {
  return User.deleteMany({ userId: userid })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    })
}

module.exports = {
  generatePhoto,
  getUserById,
  getUserNameAndPhoto,
  getUserSuperhostStatus,
  insertUserInfo,
  updateUserInfo,
  deleteUserInfo
};