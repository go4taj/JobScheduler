/* eslint-disable max-len */
'use strict';

const constants = require('../constants.json');
const keygen = require('keygenerator');

module.exports = function(server) {
  const router = server.loopback.Router();
  server.use('/api', router);

  router.post('/login', (req, res)=>{
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({status: 'error', message: constants.INVALID_LOGIN});
    } else if (req.body.email == process.env.ADMIN_EMAIL && req.body.password == process.env.ADMIN_PASS) {
      req.app.models.Session.create({token: keygen.session_id()}, (err, created)=>{
        res.status(200).send({status: 'success', token: created.token});
      });
    } else {
      return res.status(400).send({status: 'error', message: constants.INVALID_LOGIN});
    }
  });

  router.post('/logout', (req, res)=>{
    if (req.body.token) {
      req.app.models.Session.destroyAll({where: {token: req.body.token}}, (err, removed)=>{
        res.status(200).send({status: 'success'});
      });
    } else {
      res.status(400).send({status: 'error'});
    }
  });
};
