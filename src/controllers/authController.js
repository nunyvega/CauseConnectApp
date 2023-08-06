const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Create the user with the plain password, and let the pre('save') hook take care of hashing
    const user = new User({ username, password });
    await user.save();

    // Redirect to the login page
    res.redirect('/login');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

