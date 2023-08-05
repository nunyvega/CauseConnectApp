const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the hashed password
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // Redirect to the login page, or you can render a success page
    res.redirect('/login');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login is now handled by Passport in your server.js, so this controller method is not needed
