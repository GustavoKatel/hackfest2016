var express = require('express');
var router = express.Router();
var fs = require('fs');

var models = require('../models');

var authenticatedUser = require('../middlewares/authenticatedUser');

/* GET obras listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/cidade/:cod_municipio', (req, res) => {

  fs.readFile('./queries/lista_licitacoes_por_municipio.sql', 'utf8', (err, query) => {

    if(err || !query) {
      res.json({
        err: err,
        errors: ['Could not process request']
      });
      return;
    }

    models.sequelize.query(
      query,
      {
        replacements: [req.params.cod_municipio],
        type: models.sequelize.QueryTypes.SELECT
      }
    )
    .then((licitacoes) => {
      res.json(licitacoes);
    })
    .catch((err) => {
      res.json({
        errors: ['DB Error']
      });
    });

  });

});

// ?no=[str]&ug=[str]&tp=[str]
router.get('/licitacao/', (req, res) => {

  // not enough params
  if(!req.query.no || !req.query.ug || !req.query.tp) {
    res.json({
      errors: ['Could not process request']
    });
    return;
  }

  fs.readFile('./queries/licitacao_info.sql', 'utf8', (err, query) => {

    if(err || !query) {
      res.json({
        errors: ['Could not process request']
      });
      return;
    }

    models.sequelize.query(
      query,
      {
        replacements: [req.query.no, req.query.tp, req.query.ug],
        type: models.sequelize.QueryTypes.SELECT
      }
    )
    .then((licitacao) => {
      res.json(licitacao);
    })
    .catch((err) => {
      res.json({
        errors: ['DB Error']
      });
    });

  });

});

// ?no=[str]&ug=[str]&tp=[str]
// body.comment: str
// body.photo_url: str
router.post('/licitacao/', authenticatedUser, (req, res) => {

  // not enough params
  if(
    !req.query.no ||
    !req.query.ug ||
    !req.query.tp ||
    !req.body.comment ||
    !req.body.photo_url
  ) {
    res.json({
      errors: ['Could not process request']
    });
    return;
  }

  let fields = {
    no: '',
    ug: '',
    tp: ''
  };

  Object.keys(fields).forEach((f) => {
    fields[f] = req.query[f];
  });

  fields.comment = req.body.comment;
  fields.photo_url = req.body.photo_url;

  models.meta.licitacao_userdata.create(fields)
  .then((userdata) => {

    userdata.setUser(req.user).then( () => {

      res.json({
        status: 'ok'
      });

    }).catch( () => {

      res.json({
        errors: ['Could not save the request']
      });

    });

  }).catch((err) => {
    res.json({
      errors: ['Could not save the request']
    });
  });

});

module.exports = router;
