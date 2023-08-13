const express = require('express');
const connectionController = require('../controllers/connectionController');
const router = express.Router();
const User = require('../models/User');
const Connection = require('../models/Connection');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('User is not authenticated');
    res.redirect('/login');
  }

router.post('/markMet', isAuthenticated, connectionController.markMet);
router.post('/markUnmet', isAuthenticated, connectionController.markUnmet);

module.exports = router;
router.get('/all', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find();
    const connections = await Connection.find({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ]
    });

    const metUserIds = connections.map(conn => conn.user1.toString() === req.user._id.toString() ? conn.user2.toString() : conn.user1.toString());

    users.forEach(user => {
      user.met = metUserIds.includes(user._id.toString());
    });

    res.render('connections', { users, currentUser: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
