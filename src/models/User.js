const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
 name: String,
  age: Number,
  skills: [String],
  interests: [{
    type: String,
    enum: ['Photography', 'Traveling', 'Reading', 'Sports', 'Music', 'Cooking', 'Coding', 'Gaming'] // TODO: rework interests list
}],
role: String,
  favoriteBook: String,
  preferredGreeting: {
    type: String,
    enum: ['hug', 'handshake', 'high five', 'fist bump', 'wave'],
    default: 'wave'
  },
  profilePicture: {
    type: String,
    default: '/uploads/profile.png'
}});

// Hashing the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

