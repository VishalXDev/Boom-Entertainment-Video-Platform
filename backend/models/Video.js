const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  type:        { type: String, enum: ['short', 'long'], required: true },
  filePath:    { type: String }, // short-form
  url:         { type: String }, // long-form
  price:       { type: Number, default: 0 },
  creator:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema); // ✅ Add this
