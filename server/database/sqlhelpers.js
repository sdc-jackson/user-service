const axios = require('axios');
const { User } = require('./schema.js');
//require('dotenv').config();
require('dotenv').config({ path: __dirname + '/./../../.env' });
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

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

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

}

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

module.exports = {
  getUserNameAndPhoto,
  getUserSuperhostStatus,
  insertUserInfo

};