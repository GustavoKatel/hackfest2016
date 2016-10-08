var express = require('express');
var router = express.Router();

var authenticatedUser = require('../middlewares/authenticatedUser');

/* GET obras listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/test', authenticatedUser, (req, res, next) => {

  res.send(`Ok, ${req.user.name}`);

});

module.exports = router;
