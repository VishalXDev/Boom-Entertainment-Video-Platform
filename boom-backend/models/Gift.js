const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  fromUser:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  video:     { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  amount:    { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Gift', giftSchema);
