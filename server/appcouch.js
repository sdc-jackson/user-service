var initCouch = require('./database/CouchdbInit');

initCouch(function (err) {
  if (err) {
    throw err;
  } else {
    console.log('Couch DB initialized.')
  }
});
