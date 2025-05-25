const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendGift } = require('../controllers/giftController');

router.post('/', auth, sendGift); // Send a gift

module.exports = router;
