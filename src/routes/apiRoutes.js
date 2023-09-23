const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/User");
const Connection = require("../models/Connection");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../middleware/authMiddleware");


// API endpoints
// Route to get all users
router.get('/users', ensureAdmin, async (req, res) => {
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
router.get('/users/:username', ensureAdmin, async (req, res) => {
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

// Create a new user
router.post('/users', ensureAdmin, async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Update an existing user by username
router.put('/users/:username', ensureAdmin, async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Delete a user by username
router.delete('/users/:username', ensureAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ username: req.params.username });
        if (deletedUser) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// API endpoints for Connections

// Route to create a new connection
router.post('/connections', ensureAdmin, async (req, res) => {
    try {
        const newConnection = new Connection(req.body);
        await newConnection.save();
        res.status(201).json(newConnection);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route to get all connections
router.get('/connections', ensureAdmin, async (req, res) => {
    try {
        const connections = await Connection.find();
        res.json(connections);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route to get a specific connection by its ID
router.get('/connections/:connectionId', ensureAdmin, async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.connectionId);
        if (connection) {
            res.json(connection);
        } else {
            res.status(404).send('Connection not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route to get all connections for a specific user by their username
router.get('/connections/user/:username', ensureAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        const userId = user._id;
        const connections = await Connection.find({
            $or: [{ user1: userId }, { user2: userId }]
        });
        
        if (connections.length > 0) {
            res.json(connections);
        } else {
            res.status(404).send('No connections found for this user');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


// Route to update a connection by its ID
router.put('/connections/:connectionId', ensureAdmin, async (req, res) => {
    try {
        const updatedConnection = await Connection.findByIdAndUpdate(req.params.connectionId, req.body, { new: true });
        if (updatedConnection) {
            res.json(updatedConnection);
        } else {
            res.status(404).send('Connection not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a connection by its ID
router.delete('/connections/:connectionId', ensureAdmin, async (req, res) => {
    try {
        const deletedConnection = await Connection.findByIdAndDelete(req.params.connectionId);
        if (deletedConnection) {
            res.json({ message: 'Connection deleted successfully' });
        } else {
            res.status(404).send('Connection not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
