const axios = require('axios');
const { User } = require('./schema.js');
require('dotenv').config();
const { Pool } = require('pg');

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

// const getUserById = async (userId) => {
//   try {
//     console.log('getUserById :', userId);
//     const user = await User.findOne({ userId });
//     return user;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'airbnb',
  password: 'admin82!',
  port: 5432
});

const getUserById = (roomId) => {
  console.log('getUserById called');
  const getQuery = `SELECT r.owner_id as userid, o.joined_date as joinDate, o.reviews_count as reviewsCount, o.is_identity_verified as identityVerified, o.response_rate as responseRate, TRIM(o.profile_pic) as avatarUrl, o.is_super_host as isSuperhost, TRIM(o.name) as name,  TRIM(l.name)  as languages, od.during_stay, od.host_desc as bio, TRIM(rt.description) as responseTime FROM rooms r LEFT JOIN owners o ON r.owner_id = o.owner_id LEFT JOIN owner_language ol ON o.owner_id = ol.ownerid LEFT JOIN languages l ON ol.languageid = l.id LEFT JOIN owner_details od ON o.owner_id = od.ownerid LEFT JOIN response_time rt ON o.response_time_id = rt.id WHERE r.id = 9999997`;

  return new Promise(function (resolve, reject) {
    pool.query(getQuery, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows[0])
    })

  })
  // return pool.connect()
  //   .then(client => {
  //     return client.query(getQuery)
  //       .then(res => {
  //         console.log('Res select user :', res.rows[0]);
  //         return res.rows[0];
  //       })
  //   })
  //   .catch(err => {
  //     client.release();
  //     console.log(err.stack);
  //   })

}

getUserById(100);

const insertLanguages = (languageArray) => {
  const nestedArray = languageArray.map(language => [language]);
  const query1 = format('INSERT INTO LANGUAGES (NAME) VALUES %L returning id', nestedArray);

  return pool.connect()
    .then(client => {
      return client.query(query1)
        .then(res => {
          //console.log('res insert LANGUAGE : ', res.rows);
          return res.rows;
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}


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