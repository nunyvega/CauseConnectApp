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
router.get('/preferences', isAuthenticated, async (req, res) => {
  try {
    // Get the user preferences
    console.log('fprefos');
    const preferences = await userController.getUserPreferences(req.user.id);

   // Get flash messages
   const successMessage = req.flash('success');
   const errorMessage = req.flash('error');    // Render the view with the preferences
    res.render('preferences', { preferences, successMessage, errorMessage });
  } catch (error) {
    console.error(error);
    // Handle error (e.g., render an error page or redirect)
    res.status(500).send('An error occurred while retrieving preferences');
  }
});
module.exports = router;
