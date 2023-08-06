const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('User is not authenticated');
    res.redirect('/login');
  }

  
router.post('/preferences', userController.updateUserPreferences);
//router.get('/preferences', isAuthenticated, userController.renderPreferencesPage);
router.get('/preferences', isAuthenticated,  (req, res) => {
  // Get the user preferences
  const preferences = userController.getUserPreferences(req.user.id);

  // Render the view with the preferences
  res.render('preferences', { preferences });
});
module.exports = router;
