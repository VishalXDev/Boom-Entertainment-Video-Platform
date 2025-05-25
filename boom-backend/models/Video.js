const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  type:        { type: String, enum: ['short', 'long'], required: true },
  filePath:    { type: String },   // for short-form videos
  url:         { type: String },   // for long-form videos
  price:       { type: Number, default: 0 }, // only for long-form
  creator:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
