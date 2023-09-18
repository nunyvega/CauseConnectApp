const Connection = require("../models/Connection");
const User = require("../models/User");

// Mark another user as met by the authenticated user
exports.markMet = async (req, res) => {
  const currentUserId = req.user._id;
  const metUserId = req.body.userId;

  try {
    const existingConnection = await Connection.findOne({
      $or: [
        { user1: currentUserId, user2: metUserId },
        { user1: metUserId, user2: currentUserId },
      ],
    });

    if (!existingConnection) {
      const connection = new Connection({
        user1: currentUserId,
        user2: metUserId,
        metDate: new Date(),
      });
      await connection.save();
    }

    res.redirect("/mark-met");
  } catch (error) {
    console.error("Error marking user as met:", error);
    res.status(500).send("An error occurred");
  }
};

// Mark another user as unmet by the authenticated user
exports.markUnmet = async (req, res) => {
  const currentUserId = req.user._id;
  const unmetUserId = req.body.userId;

  try {
    const existingConnection = await Connection.findOneAndRemove({
      $or: [
        { user1: currentUserId, user2: unmetUserId },
        { user1: unmetUserId, user2: currentUserId },
      ],
    });

    res.redirect("/mark-met");
  } catch (error) {
    console.error("Error marking user as unmet:", error);
    res.status(500).send("An error occurred");
  }
};

// Get a list of members met by the authenticated user
exports.getMetMembers = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }],
    });

    const metUserIds = connections
      .map((conn) =>
        conn.user1.toString() === req.user._id.toString()
          ? conn.user2.toString()
          : conn.user1.toString()
      )
      .filter((userId) => userId !== req.user._id.toString());

    const metUsers = await User.find({ _id: { $in: metUserIds } });

    res.render("membersMet", { users: metUsers });
  } catch (error) {
    console.error("Error fetching met members:", error);
    res.status(500).send("An error occurred while fetching met members.");
  }
};
