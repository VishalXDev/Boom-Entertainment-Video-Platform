const Gift = require('../models/Gift');
const User = require('../models/User');
const Video = require('../models/Video');

exports.sendGift = async (req, res) => {
  try {
    const { videoId, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ msg: 'Invalid gift amount' });

    const video = await Video.findById(videoId).populate('creator');
    if (!video) return res.status(404).json({ msg: 'Video not found' });

    const sender = await User.findById(req.user.id);
    if (sender.wallet < amount) return res.status(400).json({ msg: 'Insufficient balance' });

    sender.wallet -= amount;
    await sender.save();

    await Gift.create({
      fromUser: sender._id,
      toCreator: video.creator._id,
      video: video._id,
      amount,
    });

    res.json({ msg: 'Gift sent successfully', newBalance: sender.wallet });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to send gift', error: err.message });
  }
};
