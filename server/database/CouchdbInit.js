var async = require('async');
var couch = require('./couchdb');

var databaseNames = ['airbnb_dev', 'airbnb-prod'];

const initCouchDb = (cb) => {
  createDatabases(cb);
};

const createDatabases = (cb) => {
  async.each(databaseNames, createDatabase, cb);
};

const createDatabase = (dbname, cb) => {
  couch.db.create(dbname, (err) => {
    if (err && err.statusCode !== 412) {
      console.error(err);
    } else if (err && err.statusCode === 412) {
      err = null;
      console.log(`Database ${dbname} already exists.`);
    } else {
      console.log(`Database ${dbname} created successfully.`);
    }

    cb(err);
  });
};

module.exports = initCouchDb;