'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var config_meta    = require(__dirname + '/../config/config.json')[env+"_meta"];
var db        = {
  meta: {}
};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var sequelize_meta = new Sequelize(config_meta.database, config_meta.username, config_meta.password, config_meta);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize_meta['import'](path.join(__dirname, file));
    db.meta[model.name] = model;
  });

Object.keys(db.meta).forEach(function(modelName) {
  if (db.meta[modelName].associate) {
    db.meta[modelName].associate(db.meta);
  }
});

db.sequelize = sequelize;
db.sequelize_meta = sequelize_meta;
db.Sequelize = Sequelize;

module.exports = db;
