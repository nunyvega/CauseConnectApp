const User = require("../models/User");
const bcrypt = require("bcrypt");

// Handle registration of a new user
exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Create the user with the plain password, and let the pre('save') hook take care of hashing
    const user = new User({ username, password });
    await user.save();

    // Redirect to the login page
    res.redirect("/login");
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
