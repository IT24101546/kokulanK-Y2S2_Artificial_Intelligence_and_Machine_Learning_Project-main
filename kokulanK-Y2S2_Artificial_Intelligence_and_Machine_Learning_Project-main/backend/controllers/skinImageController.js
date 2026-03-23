const SkinImage = require('../models/SkinImage');
const User = require('../models/User');
const axios = require('axios');
const FormData = require('form-data');
const cloudinary = require('../config/cloudinary');

const uploadSkinImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // --- 1. Resolve patient ID ---
    let patientId = req.user._id;

    if (req.user.role === 'receptionist') {
      if (!req.body.patientId) {
        return res.status(400).json({ message: 'Patient ID is required for receptionist upload' });
      }
      const patient = await User.findOne({ _id: req.body.patientId, role: 'patient' });
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      patientId = patient._id;
    }

    // --- 2. Call AI model ---
    // ✅ UPDATED: req.file.path is now the Cloudinary URL — fetch it as buffer for FastAPI
    let analysisResult = 'Analysis unavailable';

    try {
      const modelForm = new FormData();
      const imageBuffer = await axios.get(req.file.path, { responseType: 'arraybuffer' });
      modelForm.append('image', Buffer.from(imageBuffer.data), {
        filename: req.file.originalname || 'image.jpg',
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        `${process.env.MODEL_API_URL}/predict`,
        modelForm,
        { headers: { ...modelForm.getHeaders() } }
      );

      analysisResult = `${response.data.label} (${response.data.confidence}%)`;
    } catch (aiError) {
      // AI is offline — image still saves, just without a result
      console.error('AI model unavailable:', aiError.message);
    }

    // --- 3. Save to MongoDB ---
    // ✅ UPDATED: req.file.path is the Cloudinary URL, req.file.filename is the public_id
    const skinImage = new SkinImage({
      user:           patientId,
      imageUrl:       req.file.path,      // Cloudinary URL e.g. https://res.cloudinary.com/...
      cloudinaryId:   req.file.filename,  // public_id — needed for deletion
      analysisResult,
    });

    await skinImage.save();
    res.status(201).json(skinImage);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all images for logged-in user (or all/filtered for receptionist)
const getUserSkinImages = async (req, res) => {
  try {
    let query = { user: req.user._id };

    if (req.user.role === 'receptionist') {
      query = req.query.patientId ? { user: req.query.patientId } : {};
    }

    const images = await SkinImage.find(query).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error while fetching images' });
  }
};

// Get single image by ID
const getSkinImageById = async (req, res) => {
  try {
    const image = await SkinImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    if (image.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete image
const deleteSkinImage = async (req, res) => {
  try {
    const image = await SkinImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    if (image.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    // ✅ UPDATED: Delete from Cloudinary instead of local disk
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (cloudErr) {
        console.error('Cloudinary deletion failed:', cloudErr.message);
        // Continue — still remove from DB even if Cloudinary delete fails
      }
    }

    await image.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadSkinImage,
  getUserSkinImages,
  getSkinImageById,
  deleteSkinImage,
};