// models/SkinImage.js
const mongoose = require('mongoose');

const skinImageSchema = new mongoose.Schema({
  // ── Existing fields (unchanged) ────────────────────────────────────────
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // ✅ CHANGED: not required anymore — Firebase users don't have a MongoDB ObjectId
  },
  imageUrl:       { type: String, required: true },
  cloudinaryId:   { type: String, default: null },   // ✅ ADDED: Cloudinary public_id for deletion
  analysisResult: { type: String, default: '' },
  createdAt:      { type: Date, default: Date.now },

  // ── New fields for AI prediction ✅ ADDED ─────────────────────────────
  firebaseUid: { type: String, default: null },    // Firebase UID (for Firebase-authed users)
  label: {
    type: String,
    enum: ['MEL', 'BCC', 'NV', 'BKL'],
    default: null,
  },
  confidence: { type: Number, default: null },     // 0–1 float
  triage: {
    type: String,
    enum: ['Urgent', 'Monitor', 'Benign', 'Uncertain'],
    default: null,
  },
});

module.exports = mongoose.model('SkinImage', skinImageSchema);