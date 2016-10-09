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

    console.log(query);
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
        replacements: [req.params.no, req.params.tp, req.params.ug],
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

router.get('/test', authenticatedUser, (req, res, next) => {

  res.send(`Ok, ${req.user.name}`);

});

module.exports = router;
