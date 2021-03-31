require('dotenv').config();
const { Pool } = require('pg');
const path = require('path')
const format = require('pg-format');//to safely create dynamic SQL queries
const Cursor = require('pg-cursor');
var copyFrom = require('pg-copy-streams').from;
const fastcsv = require("fast-csv");
const fs = require("fs");

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT
// })

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'airbnb',
  password: 'admin82!',
  port: 5432
})

//not used because of performance issues
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

//not used because of performance issue with this approach
const tempTableToOwnersTable = () => {
  const start = Date.now();
  console.log('tempTableToOwnersTable starting timer... at  : ', start);

  const queryCopy = "WITH INS1 AS (INSERT INTO OWNERS (NAME, JOINED_DATE, REVIEWS_COUNT, IS_IDENTITY_VERIFIED,  RESPONSE_RATE, RESPONSE_TIME_ID, PROFILE_PIC, IS_SUPER_HOST) Select name, joined_date, reviews_count, is_identity_verified, response_rate, (select id from response_time where description = owners_temp.response_time LIMIT 1 ), profile_pic, is_super_host from owners_temp returning id AS OwnerId, name as name), INS2 AS ( INSERT INTO OWNER_DETAILS (OWNERID, DURING_STAY, HOST_DESC) Select INS1.OwnerId, owners_temp.during_stay, owners_temp.host_description from INS1, owners_temp where INS1.name = owners_temp.name), INS3 as (INSERT INTO OWNER_LANGUAGE (OWNERID, LANGUAGEID) Select INS1.OwnerId,languages.id from INS1, owners_temp, languages where INS1.name = owners_temp.name AND owners_temp.owner_language like '%' || languages.name || '%' ) SELECT OwnerId FROM INS1;";

  console.log('queryCopy: ', queryCopy);

  pool.connect()
    .then(client => {
      return client.query(queryCopy)
        .then(res => {
          console.log('data inserted..', res.rows[0]);
          const millis = Date.now() - start;
          console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
          client.release();
        })
        .catch(e => {
          console.log('e: ', e.stack);
          client.release();
        })
    })

}

//not in use currently
const bulkCopyCSV = (ownerObj) => {
  //only works till 15k records in file
  var fileStream = fs.createReadStream("csvFiles/sample.csv");
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // header remove
      csvData.shift();
      const query = "INSERT INTO owners_temp (name, joined_date, reviews_count, is_identity_verified, response_rate, response_time, profile_pic, is_super_host, during_stay, host_description, owner_language) Values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

      pool.connect((err, client, done) => {
        if (err) throw err;
        try {
          csvData.forEach(row => {
            client.query(query, row, (err, res) => {
              if (err) {
                console.log(err.stack);
              } else {
                console.log("inserted " + res.rowCount + " row:", row);
              }
            });
          });
        } finally {
          done();
        }
      });

    });

  fileStream.pipe(csvStream);

}

//not in use currently
const bulkCopyPGOwner = () => {
  //const filePath = "csvFiles/sample.csv";
  var filePath = path.join(__dirname, '/csvFiles/sample.csv')
  const targetTable = 'owners_temp';
  pool.connect()
    .then(client => {
      var stream = client.query(copyFrom(`COPY ${targetTable} FROM STDIN DELIMITER  ',' CSV HEADER`));
      var fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        console.log(`Error in reading file: ${error}`)
      })
      stream.on('error', (error) => {
        console.log(`Error in copy command: ${error}`)
      })
      stream.on('end', () => {
        console.log(`Completed loading data into ${targetTable}`)
        client.end()
      })
      fileStream.pipe(stream);
    })
    .then(result => {
      console.log('result: ', result);
      console.log('completed');
    })
    .catch(e => {
      console.log('e2 : ', e.stack);
      client.release();
    })

}

//in use
const importCSVtoDB = (sourceFile, tableName) => {

  var filePath = path.join(__dirname, '/' + sourceFile);
  const targetTable = tableName;
  return pool.connect()
    .then(client => {
      var stream = client.query(copyFrom(`COPY ${targetTable} FROM STDIN DELIMITER  ',' CSV HEADER`));
      var fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        console.log(`Error in reading file: ${error}`)
      })
      stream.on('error', (error) => {
        console.log(`Error in copy command: ${error}`)
      })
      stream.on('end', () => {
        console.log(`Completed loading data into ${targetTable}`)
        client.end()
      })
      fileStream.pipe(stream);
    })
    .then(result => {
      console.log('result: ', result);
      console.log(`completed data load of ${sourceFile} on table ${tableName}`);
    })
    .catch(e => {
      console.log('Error importCSVtoDB : ', e.stack);
      client.release();
    })

}

//not in use currently
const bulkInsertOwner = (ownerObj) => {
  //console.log('ownerObj pg: ', ownerObj);
  //promise
  //to do : insert into owner_languages and owner details, get response time id and host type id
  //Note : running in error with heapsize

  pool.connect()
    .then(client => {
      for (var i = 0; i < ownerObj.length; i++) {
        console.log('ownerObj i : ', ownerObj.length);
        //console.log('ownerObj : ', ownerObj[i]);
        client.query('WITH INS1 AS (INSERT INTO OWNERS (NAME, JOINED_DATE, REVIEWS_COUNT, IS_IDENTITY_VERIFIED,  RESPONSE_RATE, RESPONSE_TIME_ID, PROFILE_PIC, IS_SUPER_HOST) VALUES ($1, $2, $3, $4, $5, (select ID from RESPONSE_TIME WHERE description = $6 LIMIT 1), $7, $8) returning id AS OwnerId), INS2 as ( INSERT INTO OWNER_DETAILS (OWNERID, DURING_STAY, HOST_DESC) VALUES ((Select INS1.OwnerId from INS1), $9, $10)), INS3 as(INSERT INTO OWNER_LANGUAGE (OWNERID, LANGUAGEID)VALUES((Select INS1.OwnerId from INS1), (select ID from LANGUAGES WHERE NAME = $11 LIMIT 1))) SELECT OwnerId FROM INS1;', [ownerObj[i].name, ownerObj[i].joinedDate, ownerObj[i].reviewsCount, ownerObj[i].isIdentityVerified, ownerObj[i].responseRate, ownerObj[i].responseTime, ownerObj[i].profilePic, ownerObj[i].isSuperHost, ownerObj[i].duringStay, ownerObj[i].hostDescription, ownerObj[i].language])
          .then(res => {
            console.log('res insert i: ', res.rows[0]);
            //console.log('client.release');
            //client.release();

          })
          .catch(e => {
            console.log('e : ', e.stack);
            client.release();
          })

      }
      //client.release();

    })
    .catch(e => {
      console.log('e2 : ', e.stack);
      client.release();
    })

}

//delete response type and language for initial seeding
const deletMasterData = (languageArray) => {
  const deleteLanguages = 'Delete from Languages';
  const deleteResponseType = 'Delete from Response_Time';
  return pool.connect()
    .then(client => {
      return client.query(deleteLanguages)
        .then(res => {
          //console.log('Language deleted. Next, delete response type : ', res.rows[0]);
          return client.query(deleteResponseType)
        })
        .then(res => {
          client.release();
          //console.log('Client releases : ', res.rows[0]);
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}

//insert master value response type for initial load
const insertResponseType = (responseTimeArr) => {
  const nestedResponse = responseTimeArr.map(respTime => [respTime]);
  const query = format('INSERT INTO RESPONSE_TIME (DESCRIPTION) VALUES %L returning id', nestedResponse);

  return pool.connect()
    .then(client => {
      return client.query(query)
        .then(res => {
          //console.log('res insert responseTime : ', res.rows);
          return res.rows;
        })
        .catch(e => {
          client.release();
          console.log(e.stack);
        })
    })

}

// insert master value languages for initial load
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
  insertOwner,
  insertResponseType,
  insertLanguages,
  bulkInsertOwner,
  bulkCopyCSV,
  bulkCopyPGOwner,
  tempTableToOwnersTable,
  importCSVtoDB,
  deletMasterData
}


