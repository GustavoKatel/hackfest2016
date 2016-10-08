var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var config = require('../config');
var User = require('../models').user;

/* GET auth listing. */
router.post('/login', (req, res, next) => {

  let fb_name = req.body.fb_name;
  let fb_id = req.body.fb_id;
  let fb_token = req.body.fb_token;
  // TODO: verify fb_token

  User.findOrCreate({ where: { fb_id: fb_id }, defaults: { name: fb_name, fb_token: fb_token }})
    .spread( (user, created) => {

      if(!created) {
        user.fb_token = fb_token;
        user.save();
      }

      let token = jwt.sign({
        uid: user.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      }, config.jwt.secret);

      res.json({
        token: token
      });

    });

});

module.exports = router;
