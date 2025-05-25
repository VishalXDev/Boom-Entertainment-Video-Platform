const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addComment, getComments } = require('../controllers/commentController');

router.post('/', auth, addComment); // Add comment
router.get('/:videoId', auth, getComments); // Get comments for video

module.exports = router;
