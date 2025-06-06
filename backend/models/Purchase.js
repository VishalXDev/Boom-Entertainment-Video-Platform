const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
