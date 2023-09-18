const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/User");
const router = express.Router();
const ensureAuthenticated = require("../middleware/authMiddleware");

// API endpoints

// Route to get all users
router.get('/users', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch all users from the database and exclude the password field for security reasons
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        // Handle any internal server errors
        res.status(500).send('Internal Server Error');
    }
});

// Route to get a single user by their username
router.get('/users/:username', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch the user by username and exclude the password field for security reasons
        const user = await User.findOne({ username: req.params.username }).select('-password');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        // Handle any internal server errors
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
