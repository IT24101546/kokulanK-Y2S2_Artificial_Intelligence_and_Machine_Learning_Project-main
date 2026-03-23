// middleware/firebaseAuthMiddleware.js  ✅ NEW FILE
const { auth } = require('../config/firebase');

/**
 * Verifies the Firebase ID token from the Authorization header.
 * Sets req.user = { uid, email } on success.
 *
 * React sends:  Authorization: Bearer <firebaseIdToken>
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (error) {
    console.error('Firebase token error:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = { verifyFirebaseToken };