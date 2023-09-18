const express = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const upload = require("../multerConfig");
const router = express.Router();
const User = require("../models/User");
const languageToFlag = require("../public/js/languageToFlag");
const ensureAuthenticated = require("../middleware/authMiddleware");


router.post(
  "/preferences",
  ensureAuthenticated,
  upload.single("profilePicture"),
  userController.updateUserPreferences
);

router.get("/preferences", ensureAuthenticated, userController.renderPreferencesPage);

router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.render('profile', { 
        user: user,
        currentUser: req.user.username,
        languageToFlag: languageToFlag,
      });
    }
  } catch (error) {
    res.status(500).send('Server error'); 
  }
});

router.get('/:username', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.render('profile', { 
        user: user,
        currentUser: req.user.username,
        languageToFlag: languageToFlag,
      });
    }
  } catch (error) {
    res.status(500).send('Server error'); 
  }
});



module.exports = router;
