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

router.get('/busca', (req, res) => {

  // not enough params
  if(!req.query.q) {
    res.json({
      errors: ['Please inform the query search']
    });
    return;
  }

  fs.readFile('./queries/lista_licitacoes_por_nome.sql', 'utf8', (err, query) => {

    if(err || !query) {
      res.json({
        errors: ['Could not process request']
      });
      return;
    }

    models.sequelize.query(
      query,
      {
        replacements: [`%${req.query.q}%`],
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
// files.photo: str
router.post('/licitacao/', authenticatedUser, (req, res) => {

  // not enough params
  if(
    !req.query.no ||
    !req.query.ug ||
    !req.query.tp ||
    !req.body.comment ||
    !req.files ||
    !req.files.photo
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

  fs.readFile(req.files.photo.path, function (err, data) {
    // ...
    var newPath = "../uploads/"+req.files.photo.name;
    fs.writeFile(newPath, data, function (err) {

      if(err) {
        res.json({
          errors: ['Could not save file']
        });
        return;
      }

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
  });

});

module.exports = router;
