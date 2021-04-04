var async = require('async');
var couch = require('./couchdb');

//var databaseNames = ['airbnb_dev', 'airbnb_prod', 'airbnb_qa'];
var databaseNames = ['airbnb_qa'];

const initCouchDb = (cb) => {
  //deleteDatabases(cb);
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

const deleteDatabases = (cb) => {
  async.each(databaseNames, deleteDatabase, cb);
};

const deleteDatabase = (dbname, cb) => {
  couch.db.destroy(dbname, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Database ${dbname} destroyed successfully.`);
    }
    cb(err);
  });
};

module.exports = initCouchDb;
