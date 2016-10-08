var jwt = require('jsonwebtoken');

var config = require('../config');
var User = require('../models').user;

function sendForbidden(res, msg) {
  res.status(403);
  res.json({
    message: msg
  });
}

module.exports = function(req, res, next) {

  let token = req.query.token || req.body.token || req.header('x-token');

  if(!token) {

    sendForbidden(res, 'Missing token');
    return;
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {

    if(!decoded || !decoded.uid) {
      sendForbidden(res, 'Invalid token');
      return;
    }

    User.find({ where: { id: decoded.uid } }).then( (user) => {

      req.user = user;

      next();

    }).catch((err) => {

      sendForbidden('Invalid token');

    });

  });

}
