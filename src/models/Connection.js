// Connection model representing a connection between two users.
const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  // The first user in the connection.
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The second user in the connection.
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Date when the two users connected or met.
  metDate: Date,
});

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;
