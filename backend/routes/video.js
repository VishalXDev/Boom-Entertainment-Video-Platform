const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  uploadVideo,
  getFeed,
  getVideoDetails,
  purchaseVideo,
  getPurchasedVideos,
} = require("../controllers/videoController");

router.post("/upload", auth, upload.single("videoFile"), uploadVideo);
router.get("/feed", auth, getFeed);
router.get("/purchased", auth, getPurchasedVideos); // ✅ NEW ROUTE
router.get("/:id", auth, getVideoDetails);
router.post("/:id/purchase", auth, purchaseVideo);

module.exports = router;
