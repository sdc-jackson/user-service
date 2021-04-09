const axios = require('axios');
const { User } = require('./schema.js');
// require('dotenv').config();
require('dotenv').config({ path: __dirname + '/./../../.env' });
const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

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

//original code - keeping for reference
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


const getUserById = (userId) => {
  // 2 queries: one for languages and other for remaining owner details
  const queryLanguages = `SELECT TRIM(l.name) as name
  FROM rooms r
  inner join owners o on r.owner_id = o.owner_id
  inner join owner_language ol on ol.ownerid = o.owner_id
  inner join languages l on ol.languageid = l.id
  where r.id = ` + userId;

  const getQuery = queryLanguages + ';' + `SELECT distinct r.owner_id as userid, o.joined_date as "joinDate", o.is_identity_verified as "identityVerified", o.response_rate as "responseRate", TRIM(o.profile_pic) as "avatarUrl", o.is_super_host as "isSuperhost", TRIM(o.name) as name, od.during_stay, od.host_desc as bio, TRIM(rt.description) as "responseTime", o.reviews_count as "reviewsCount" FROM rooms r LEFT JOIN owners o ON r.owner_id = o.owner_id LEFT JOIN owner_language ol ON o.owner_id = ol.ownerid LEFT JOIN languages l ON ol.languageid = l.id LEFT JOIN owner_details od ON o.owner_id = od.ownerid LEFT JOIN response_time rt ON o.response_time_id = rt.id WHERE r.id = ` + userId;

  return new Promise(function (resolve, reject) {
    pool.query(getQuery, (error, results) => {
      if (error) {
        reject(error);
      }
      //console.log('results.rows : ', results[0].rows);
      let langArr = results[0].rows.map(elem => elem.name);

      //console.log('results.rows : ', results[1].rows);
      let userData = results[1].rows[0];
      userData['languages'] = langArr;
      resolve(userData);
    })

  })

};

//update - test put request
const updateOwnerDetails = (request, response) => {
  const id = parseInt(request.params.id);
  const { duringStay, hostDesc } = request.body;
  const UpdateQuery = 'UPDATE owner_details set during_stay= $1, host_desc = $2 from rooms WHERE rooms.id = $3 and rooms.owner_id = owner_details.ownerid;';

  return pool.connect()
    .then(client => {
      return client.query(UpdateQuery, [duringStay, hostDesc, id])
        .then(res => {
          console.log('res update owner details : ', res.rows);
          return res.rows;
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}

//update - test put request
const updateOwnerInfo = (request, response) => {
  const id = parseInt(request.params.id);
  const { reviewsCount, identityVerified, isSuperHost } = request.body;
  const UpdateQuery = 'UPDATE owners SET joined_date= (SELECT CURRENT_DATE), reviews_count= $1, is_identity_verified= $2, is_super_host= $3  from rooms WHERE rooms.id = $4 and rooms.owner_id = owners.owner_id; ';

  return pool.connect()
    .then(client => {
      return client.query(UpdateQuery, [reviewsCount, identityVerified, isSuperHost, id])
        .then(res => {
          console.log('res update owner details : ', res.rows);
          return res.rows;
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}


//insert to test post request
const insertOwner = (ownerObj) => {
  //console.log('ownerObj pg: ', ownerObj);

  //to do : insert into owner_languages and owner details, get response time id and host type id
  const insertOwnerQuery = 'INSERT INTO OWNERS (NAME, JOINED_DATE, REVIEWS_COUNT, IS_IDENTITY_VERIFIED,  RESPONSE_RATE, RESPONSE_TIME_ID, PROFILE_PIC, IS_SUPER_HOST, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

  return new Promise(function (resolve, reject) {
    pool.query(insertOwnerQuery, [ownerObj.name, ownerObj.joinedDate, ownerObj.reviewsCount, ownerObj.isIdentityVerified, ownerObj.responseRate, ownerObj.responseTimeID, ownerObj.profilePic, ownerObj.isSuperHost, ownerObj.ownerid], (error, results) => {
      if (error) {
        reject(error);
      }
      console.log('results.rows : ', results);
      resolve(results.rowCount);
    })

  });

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
  deleteUserInfo,
  updateOwnerDetails,
  updateOwnerInfo,
  insertOwner
};