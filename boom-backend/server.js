const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const commentRoutes = require('./routes/comment');
const giftRoutes = require('./routes/gift');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/gifts', giftRoutes);

// Root Route
app.get('/', (req, res) => res.send('Boom API Running...'));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
