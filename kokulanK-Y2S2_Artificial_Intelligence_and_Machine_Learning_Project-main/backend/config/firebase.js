// config/firebase.js
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // No storageBucket needed — using local /uploads folder instead
  });
}

const db   = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth }; // no 'bucket'