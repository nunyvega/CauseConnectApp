const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Excluding password field
      res.render('users', { users });
    } catch (err) {
      res.status(400).send(err.message);
    }
};
  
  
exports.updateUserPreferences = async (req, res) => {
    try {
      const userId = req.user._id; // Assuming user ID is stored in req.user
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
 // Set a flash message for success
 req.flash('success', 'Preferences updated successfully');

 // Redirect back to the preferences page
 res.redirect('/user/preferences');


    } catch (err) {
      console.error(error);
      // Handle error (e.g., set a flash message for the error and redirect back to the preferences page)
      req.flash('error', 'An error occurred while updating preferences');
      res.redirect('/user/preferences');    }
};

exports.renderPreferencesPage = (req, res) => {
  res.render('preferences');
};

exports.getUserPreferences = async function(userId) {
    const user = await User.findById(userId);
    return {
      name: user.name,
      age: user.age,
      skills: user.skills,
      interests: user.interests,
      role: user.role,
      favoriteBook: user.favoriteBook,
      preferredGreeting: user.preferredGreeting
    };
  };
  
  