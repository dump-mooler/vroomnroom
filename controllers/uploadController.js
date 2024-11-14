// controllers/uploadController.js
const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public_html/media"); // Upload files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

exports.uploadImage = (req, res) => {
  // upload.single('image')(req, res, (err) => {
  //   if (err) {
  //     return res.status(400).json({ error: err.message });
  //   }
  //   res.status(200).json({ message: 'Image uploaded successfully', filePath: req.file.path });
  // });
  upload.array("media", 12)(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // const BASE_URL = "https://kisu-makeup.com/media";
    const BASE_URL = "https://api.banatrading.com/media";

    const files = req.files.map((file) => `${BASE_URL}/${file.filename}`);
    res.status(200).json({ message: "Media uploaded successfully", files });
  });
};
