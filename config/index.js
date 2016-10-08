var env       = process.env.NODE_ENV || 'development';
var db_config    = require(__dirname + '/../config/config.json')[env];

var config = {

  jwt: {
    secret: 'banana',
  }

};

config.db = db_config;

module.exports = config;
