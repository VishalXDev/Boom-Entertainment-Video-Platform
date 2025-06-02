const Comment = require('../models/comment');

exports.addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const comment = await Comment.create({
      video: videoId,
      user: req.user.id,
      text,
    });
    await comment.populate('user', 'username'); // optional: include username
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add comment', error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const comments = await Comment.find({ video: videoId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch comments' });
  }
};
