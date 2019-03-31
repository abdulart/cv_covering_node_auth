const monk = require('monk');
const db = monk('localhost/local'); //just mongo 'local' db

module.exports = db;