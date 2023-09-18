const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Route to handle user registration
router.post("/register", authController.register);

module.exports = router;
