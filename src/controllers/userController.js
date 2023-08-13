const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Excluding password field
      res.render('users', { users });
    } catch (err) {
      res.status(400).send(err.message);
    }
};

exports.renderPreferencesPage = (req, res) => {
  res.render('preferences');
};

exports.updateUserPreferences = async (req, res) => {
  console.log('here')
  try {
    const userId = req.user._id; 
    console.log(req)
    // Check if a new image was uploaded
    if (req.file) {
      req.body.profilePicture = '/uploads/' + req.file.filename;
    }
    
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    req.flash('success', 'Preferences updated successfully');
    res.redirect('/user/preferences');

  } catch (err) {
    console.error(err); // It should be err not error
    req.flash('error', 'An error occurred while updating preferences');
    res.redirect('/user/preferences');    
  }
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
      preferredGreeting: user.preferredGreeting,
      profilePicture: user.profilePicture
    };
  };
  
  