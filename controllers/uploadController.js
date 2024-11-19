// controllers/uploadController.js
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;

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
  upload.array("media", 12)(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const BASE_URL = "https://banatrading.com/media";
    
    try {
      const processedFiles = await Promise.all(
        req.files.map(async (file) => {
          const ext = path.extname(file.filename).toLowerCase();
          
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            const compressedFilePath = file.path;
            await sharp(file.path)
              .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toFile(compressedFilePath + '_compressed');
              
            await fs.unlink(file.path);
            await fs.rename(compressedFilePath + '_compressed', file.path);
          }
          
          return `${BASE_URL}/${file.filename}`;
        })
      );

      res.status(200).json({ message: "Media uploaded successfully", files: processedFiles });
    } catch (error) {
      return res.status(500).json({ error: "Error processing images" });
    }
  });
};
