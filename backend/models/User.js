const mongoose = require('mongoose'); // ✅ Add this line

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet:   { type: Number, default: 500 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
