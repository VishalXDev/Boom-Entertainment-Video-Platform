const Video = require('../models/Video');
const path = require('path');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, type, url, price } = req.body;

    const newVideo = new Video({
      title,
      description,
      type,
      creator: req.user.id,
    });

    if (type === 'short') {
      if (!req.file) return res.status(400).json({ msg: 'Short-form file required' });
      newVideo.filePath = `/uploads/${req.file.filename}`;
    } else if (type === 'long') {
      if (!url) return res.status(400).json({ msg: 'Long-form URL required' });
      newVideo.url = url;
      newVideo.price = price || 0;
    }

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
};
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .populate('creator', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(videos);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch feed' });
  }
};
exports.getVideoDetails = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId).populate('creator', 'username');

    if (!video) return res.status(404).json({ msg: 'Video not found' });

    let hasPurchased = false;
    if (video.type === 'long' && video.price > 0) {
      const purchase = await Purchase.findOne({ user: req.user.id, video: videoId });
      hasPurchased = !!purchase;
    }

    res.json({ video, hasPurchased });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get video', error: err.message });
  }
};
exports.purchaseVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ msg: 'Video not found' });
    if (video.type !== 'long' || video.price === 0) return res.status(400).json({ msg: 'No purchase needed' });

    const alreadyPurchased = await Purchase.findOne({ user: req.user.id, video: video._id });
    if (alreadyPurchased) return res.status(400).json({ msg: 'Already purchased' });

    const user = await User.findById(req.user.id);
    if (user.wallet < video.price) return res.status(400).json({ msg: 'Insufficient balance' });

    user.wallet -= video.price;
    await user.save();

    await Purchase.create({ user: user._id, video: video._id });

    res.json({ msg: 'Purchase successful', newBalance: user.wallet });
  } catch (err) {
    res.status(500).json({ msg: 'Purchase failed', error: err.message });
  }
};
