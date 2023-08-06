const express = require('express');
const connectionController = require('../controllers/connectionController');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('User is not authenticated');
    res.redirect('/login');
  }

router.post('/markMet', isAuthenticated, connectionController.markMet);

module.exports = router;
