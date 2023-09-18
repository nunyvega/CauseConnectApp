const express = require("express");
const connectionController = require("../controllers/connectionController");
const userController = require("../controllers/userController");
const router = express.Router();
const User = require("../models/User");
const Connection = require("../models/Connection");
const ensureAuthenticated = require("../middleware/authMiddleware");

router.post("/markMet", ensureAuthenticated, connectionController.markMet);
router.post("/markUnmet", ensureAuthenticated, connectionController.markUnmet);

router.get("/mark-met", ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find().sort({name: 1});
    const connections = await Connection.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }],
    });

    const metUserIds = connections.map((conn) =>
      conn.user1.toString() === req.user._id.toString()
        ? conn.user2.toString()
        : conn.user1.toString()
    );

    users.forEach((user) => {
      user.met = metUserIds.includes(user._id.toString());
    });

    // Group the users by the first letter of their name
    const groupedUsers = users.reduce((acc, user) => {
      // confirm that there are users
      if (!user.name) return acc;
      const firstLetter = user.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(user);
      return acc;
    }, {});

    res.render("allMembers", { groupedUsers, currentUser: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});



router.get("/members-met", ensureAuthenticated, connectionController.getMetMembers);
router.get(
  "/recommendations",
  userController.getRecommendedUsers
);

module.exports = router;
