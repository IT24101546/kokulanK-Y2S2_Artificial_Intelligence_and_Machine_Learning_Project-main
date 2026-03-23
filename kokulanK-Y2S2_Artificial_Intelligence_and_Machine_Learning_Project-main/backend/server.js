const dotenv = require('dotenv');
dotenv.config(); // ✅ MUST be first — before any other imports that use process.env

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skinImageRoutes = require('./routes/skinImageRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const labRequestRoutes = require('./routes/labRequestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cleaningTaskRoutes = require('./routes/cleaningTaskRoutes');
const supplyRequestRoutes = require('./routes/supplyRequestRoutes');
const predictRoute = require('./routes/predict');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root test route
app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running...");
});

// =====================
// API Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skin-images', skinImageRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/lab-requests', labRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cleaning-tasks', cleaningTaskRoutes);
app.use('/api/supply-requests', supplyRequestRoutes);
app.use('/api', predictRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);