const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) return cb(new Error('Only .mp4 allowed'), false);
  cb(null, true);
};

module.exports = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});
