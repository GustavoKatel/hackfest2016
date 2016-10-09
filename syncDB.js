
var models = require('./models');

models.sequelize_meta.sync().then(console.log).catch(console.log);
