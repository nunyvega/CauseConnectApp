const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const User = require('../models/User');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('User is not authenticated');
    res.redirect('/login');
  }

  router.get('/all', isAuthenticated, async (req, res) => {
    // Get all users
    const users = await User.find();
  
    // Render the view with all users and the currently authenticated user
    res.render('users', { users, currentUser: req.user });
  });router.post('/preferences', userController.updateUserPreferences);
//router.get('/preferences', isAuthenticated, userController.renderPreferencesPage);
router.get('/preferences', isAuthenticated,  (req, res) => {
  // Get the user preferences
  const preferences = userController.getUserPreferences(req.user.id);

  // Render the view with the preferences
  res.render('preferences', { preferences });
});
module.exports = router;
