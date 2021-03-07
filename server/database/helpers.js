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

//insert UserInfo
//http://localhost:5007/users/insertUser
const insertUserInfo = (userInfoObj) => {
  //check user exists, if not, insert
  const userDetails = new User(userInfoObj);
  //find and modify
  return User.find({ name: userInfoObj.name }).select("userId")
    .then(userId => {
      console.log('UserId ', userId);
      return userDetails.save();
    })
    .then(userAdded => {
      console.log('User added: ' + userAdded)
      return ('user added');
    })
    .catch(err => handleError(err))

};

//update UserInfo
const updateUserInfo = (userInfoObj) => {
  //condition,update, options, callback
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
      console.log('results : ', results);
      console.log('User updated');
      return (results);
    })
    .catch(err => console.log(err))

}

const deleteUserInfo = (userid) => {
  return User.deleteMany({ userId: userid })
    .then(result => {
      console.log('Data Deleted: ', result);
      return result;
    })
    .catch(err => {
      console.log('err occurred: ', err);
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