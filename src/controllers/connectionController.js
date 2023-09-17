const Connection = require("../models/Connection");
const User = require("../models/User");

exports.markMet = async (req, res) => {
  const currentUserId = req.user._id; // This assumes the authenticated user's info is stored in req.user
  const metUserId = req.body.userId;

  try {
    // Check if the connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { user1: currentUserId, user2: metUserId },
        { user1: metUserId, user2: currentUserId },
      ],
    });

    if (!existingConnection) {
      // Create a new connection
      const connection = new Connection({
        user1: currentUserId,
        user2: metUserId,
        metDate: new Date(),
      });
      await connection.save();
    }

    res.redirect("/mark-met");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

exports.markUnmet = async (req, res) => {
  const currentUserId = req.user._id;
  const unmetUserId = req.body.userId;

  try {
    // Find and remove the connection
    const existingConnection = await Connection.findOneAndRemove({
      $or: [
        { user1: currentUserId, user2: unmetUserId },
        { user1: unmetUserId, user2: currentUserId },
      ],
    });

    if (existingConnection) {
      console.log("Connection removed");
    } else {
      console.log("Connection not found");
    }

    res.redirect("/mark-met");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

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
      // filter out the current user's ID from the array
      .filter(userId => userId !== req.user._id.toString());

    const metUsers = await User.find({ _id: { $in: metUserIds } });

    res.render("membersMet", { users: metUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching met members.");
  }
}

