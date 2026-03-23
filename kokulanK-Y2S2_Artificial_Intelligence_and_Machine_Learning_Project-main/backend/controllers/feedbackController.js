const Feedback = require('../models/Feedback');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Create feedback for a completed appointment
// @route   POST /api/feedback
// @access  Private (patient)
const createFeedback = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid appointment and rating (1-5) required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot give feedback for incomplete appointment' });
    }

    const existing = await Feedback.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: 'Feedback already given' });
    }

    const feedback = await Feedback.create({
      patient: req.user._id,
      appointment: appointmentId,
      rating,
      comment
    });

    // Update doctor's average rating
    const doctorId = appointment.doctor;
    const allFeedbacks = await Feedback.find({ appointment: { $in: await Appointment.find({ doctor: doctorId }).distinct('_id') } });
    const avg = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length;
    await User.findByIdAndUpdate(doctorId, { averageRating: avg.toFixed(1) });

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get feedback for logged-in doctor (their own feedback)
// @route   GET /api/feedback/doctor
// @access  Private (doctor)
const getDoctorFeedback = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id }).select('_id');
    const appointmentIds = appointments.map(a => a._id);
    const feedbacks = await Feedback.find({ appointment: { $in: appointmentIds } })
      .populate('patient', 'name')
      .populate('appointment', 'date');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get feedback for a specific doctor (public comments)
// @route   GET /api/feedback/doctor/:doctorId
// @access  Private (optional)
const getPublicDoctorFeedback = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId }).select('_id');
    const appointmentIds = appointments.map(a => a._id);
    const feedbacks = await Feedback.find({ appointment: { $in: appointmentIds } })
      .populate('patient', 'name')
      .select('rating comment createdAt');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged-in patient's feedback
// @route   GET /api/feedback/patient
// @access  Private (patient)
const getPatientFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ patient: req.user._id })
      .populate('appointment', 'date doctor')
      .populate('appointment.doctor', 'name');
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createFeedback,
  getDoctorFeedback,
  getPublicDoctorFeedback,
  getPatientFeedback
};