'use strict';
module.exports = function(sequelize, DataTypes) {
  var obra = sequelize.define('obra', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return obra;
};
