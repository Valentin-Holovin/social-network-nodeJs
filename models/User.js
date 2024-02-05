const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String, default: null },
});

const User = mongoose.model('User', userSchema);

module.exports = User;