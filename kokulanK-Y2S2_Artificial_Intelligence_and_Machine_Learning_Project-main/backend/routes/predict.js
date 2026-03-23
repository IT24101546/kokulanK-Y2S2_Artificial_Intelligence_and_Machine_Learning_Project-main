// backend/routes/predict.js
const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware'); // ✅ back to JWT for now
const { predictImage, getPredictionHistory } = require('../controllers/predictController');

// POST /api/predict
router.post('/predict', protect, upload.single('image'), predictImage);

// GET /api/predict/history
router.get('/predict/history', protect, getPredictionHistory);

module.exports = router;