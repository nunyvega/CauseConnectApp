const express = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const upload = require("../multerConfig");
const router = express.Router();

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


module.exports = router;
