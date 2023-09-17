const express = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const upload = require("../multerConfig");
const router = express.Router();
const User = require("../models/User");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("User is not authenticated");
  res.redirect("/login");
}

router.post(
  "/preferences",
  isAuthenticated,
  upload.single("profilePicture"),
  userController.updateUserPreferences
);

router.get("/preferences", isAuthenticated, userController.renderPreferencesPage);

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.render('profile', { 
        user: user,
        currentUser: req.user.username,
      });
    }
  } catch (error) {
    res.status(500).send('Server error'); 
  }
});

router.get('/:username', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.render('profile', { 
        user: user,
        currentUser: req.user.username,
      });
    }
  } catch (error) {
    res.status(500).send('Server error'); 
  }
});



module.exports = router;
