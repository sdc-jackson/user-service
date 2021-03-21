var nano = require('nano');
// construct a database wrapper that points to the CouchDB server specified by the URL contained in the environment variable named COUCHDB_URL.
module.exports = nano(process.env.COUCHDB_URL || 'http://admin:Ouch82@localhost:5984');