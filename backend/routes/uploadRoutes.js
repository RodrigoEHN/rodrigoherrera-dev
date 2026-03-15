const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middlewares/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload();

    res.json({
      url: result.secure_url
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
