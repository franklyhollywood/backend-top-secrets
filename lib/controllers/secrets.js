const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const Secret = require('../models/Secret.js');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const secret = await Secret.insert(req.body);
      res.json(secret);
    } catch (error) {
      next(error);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const secrets = await Secret.getAll();
      res.send(secrets);
    } catch (error) {
      next(error);
    }
  });
