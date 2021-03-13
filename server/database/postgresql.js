const { Pool } = require('pg');
const format = require('pg-format');//to safely create dynamic SQL queries

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'airbnb',
  password: 'admin82!',
  port: 5432
})

// const pool = new Pool();

const insertOwner2 = (ownerObj) => {
  //console.log('ownerObj pg: ', ownerObj);
  //promise
  //to do : insert into owner_languages and owner details, get response time id and host type id
  pool.connect()
    .then(client => {
      return client.query('INSERT INTO Owners (NAME, JOINED_DATE, REVIEWS_COUNT, IS_IDENTITY_VERIFIED, RESPONSE_RATE, RESPONSE_TIME_ID, PROFILE_PIC, IS_SUPER_HOST) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ownerObj.name, ownerObj.joinedDate, ownerObj.reviewsCount, ownerObj.isIdentityVerified, ownerObj.responseRate, ownerObj.reviewsCount, ownerObj.profilePic, ownerObj.isSuperHost])
        .then(res => {
          client.release();
          console.log('res insert owner: ', res.rows[0]);
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })
}

const insertOwner = (ownerObj) => {
  //console.log('ownerObj pg: ', ownerObj);
  //promise
  //to do : insert into owner_languages and owner details, get response time id and host type id

  pool.connect()
    .then(client => {
      return client.query('WITH INS1 AS (INSERT INTO OWNERS (NAME, JOINED_DATE, REVIEWS_COUNT, IS_IDENTITY_VERIFIED,  RESPONSE_RATE, RESPONSE_TIME_ID, PROFILE_PIC, IS_SUPER_HOST) VALUES ($1, $2, $3, $4, $5, (select ID from RESPONSE_TIME WHERE description = $6 LIMIT 1), $7, $8) returning id AS OwnerId), INS2 as ( INSERT INTO OWNER_DETAILS (OWNERID, DURING_STAY, HOST_DESC) VALUES ((Select INS1.OwnerId from INS1), $9, $10)), INS3 as(INSERT INTO OWNER_LANGUAGE (OWNERID, LANGUAGEID)VALUES((Select INS1.OwnerId from INS1), (select ID from LANGUAGES WHERE NAME = $11 LIMIT 1))) SELECT OwnerId FROM INS1;', [ownerObj.name, ownerObj.joinedDate, ownerObj.reviewsCount, ownerObj.isIdentityVerified, ownerObj.responseRate, ownerObj.responseTime, ownerObj.profilePic, ownerObj.isSuperHost, ownerObj.duringStay, ownerObj.hostDescription, ownerObj.language])
        .then(res => {
          console.log('res insert owner: ', res.rows[0]);
          client.release();
        })
        .catch(e => {
          console.log('e : ', e.stack);
          client.release();
        })
    })
}


const insertResponseType = (responseTimeArr) => {
  console.log('Response TIME pg: ', responseTimeArr);
  const nestedResponse = responseTimeArr.map(respTime => [respTime]);
  const query = format('INSERT INTO RESPONSE_TIME (DESCRIPTION) VALUES %L returning id', nestedResponse);
  console.log('query: ', query);
  pool.connect()
    .then(client => {
      return client.query(query)
        .then(res => {
          client.release();
          console.log('res insert responseTime : ', res.rows[0]);
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
  pool.connect()
    .then(client => {
      return client.query(query1)
        .then(res => {
          client.release();
          console.log('res insert LANGUAGE : ', res.rows[0]);
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}

const insertRooms = (roomObj) => {
  console.log('roomObj Type pg: ', roomObj);
  pool.connect()
    .then(client => {
      return client.query('INSERT INTO ROOMS (OWNER_ID, DESCRIPTION]) VALUES ($1,$2)', [roomObj.OWNERID, roomObj.DESCRIPTION])
        .then(res => {
          client.release();
          console.log('res insert roomObj : ', res.rows[0]);
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}


module.exports = {
  insertOwner,
  insertResponseType,
  insertLanguages,
  insertRooms

}


