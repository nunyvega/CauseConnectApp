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
      res.status(200).json({ user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
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
  
  