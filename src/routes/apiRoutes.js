const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/User");
const router = express.Router();
// API endpoints
// Get all users
router.get('/users', async (req, res) => {
    try {
       const users = await User.find().select('-password');  // Excludes password field for security reasons
       res.json(users);
    } catch (error) {
       res.status(500).send('Internal Server Error');
    }
  });
  
  // Get a single user by username
  router.get('/users/:username', async (req, res) => {
    try {
       const user = await User.findOne({ username: req.params.username }).select('-password'); // Excludes password field for security reasons
       if (user) {
          res.json(user);
       } else {
          res.status(404).send('User not found');
       }
    } catch (error) {
       res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
