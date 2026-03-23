const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // Prefix with 'lab-' to distinguish from skin images
    cb(null, req.user._id + '-lab-' + uniqueSuffix + ext);
  }
});

// No file filter – accepts all file types
const uploadLab = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

module.exports = uploadLab;