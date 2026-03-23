// predictController.js
const axios = require('axios');
const FormData = require('form-data');
const { db } = require('../config/firebase');
const SkinImage = require('../models/SkinImage');

const computeTriage = (label, confidence) => {
  const dangerous = ['MEL', 'BCC'];
  const benign    = ['NV', 'BKL'];
  if (dangerous.includes(label)) {
    if (confidence > 0.5)  return 'Urgent';
    if (confidence >= 0.3) return 'Monitor';
  }
  if (benign.includes(label) && confidence > 0.7) return 'Benign';
  return 'Uncertain';
};

exports.predictImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    // ── Step 1: Forward image to FastAPI ───────────────────────────────────
    // With Cloudinary, the file is already uploaded — fetch it by URL for FastAPI
    const form = new FormData();
    const imageBuffer = await axios.get(req.file.path, { responseType: 'arraybuffer' });
    form.append('image', Buffer.from(imageBuffer.data), {
      filename: req.file.originalname || 'image.jpg',
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      `${process.env.MODEL_API_URL}/predict`,
      form,
      { headers: { ...form.getHeaders() } }
    );

    const { label, confidence } = response.data;
    const confidenceNorm = confidence > 1 ? confidence / 100 : confidence;
    const triage = computeTriage(label, confidenceNorm);

    // ── Step 2: Get Cloudinary image URL ──────────────────────────────────
    // multer-storage-cloudinary puts the public Cloudinary URL in req.file.path
    const imageUrl = req.file.path;

    const uid = req.user._id.toString();

    // ── Step 3: Save to Firestore (optional — skipped if Firebase not set up) ──
    let predictionId = null;
    try {
      const docRef = await db
        .collection('users')
        .doc(uid)
        .collection('predictions')
        .add({
          uid,
          email:      req.user.email,
          imageUrl,
          label,
          confidence: confidenceNorm,
          triage,
          createdAt:  new Date().toISOString(),
        });
      predictionId = docRef.id;
    } catch (fbError) {
      // Firebase not configured yet — log and continue
      console.warn('Firestore save skipped:', fbError.message);
    }

    // ── Step 4: Save to MongoDB ────────────────────────────────────────────
    try {
      await SkinImage.create({
        user:        req.user._id,
        firebaseUid: uid,
        imageUrl,
        label,
        confidence:  confidenceNorm,
        triage,
      });
    } catch (dbError) {
      console.warn('MongoDB save skipped:', dbError.message);
    }

    // ── Step 5: Return result ──────────────────────────────────────────────
    res.json({
      success:      true,
      predictionId,
      label,
      confidence:   Math.round(confidenceNorm * 100),
      triage,
      imageUrl,
    });

  } catch (error) {
    console.error('AI Proxy Error:', error.message);
    res.status(500).json({ message: 'AI Model is offline or prediction failed.' });
  }
};

// GET /api/predict/history
exports.getPredictionHistory = async (req, res) => {
  const uid = req.user._id.toString(); // JWT protect sets req.user as MongoDB user
  try {
    const snapshot = await db
      .collection('users')
      .doc(uid)
      .collection('predictions')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, history });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ message: 'Could not fetch history' });
  }
};