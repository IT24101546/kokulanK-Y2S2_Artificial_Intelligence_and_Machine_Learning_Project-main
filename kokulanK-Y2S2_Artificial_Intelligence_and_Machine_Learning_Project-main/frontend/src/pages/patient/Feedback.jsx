import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from './DashboardLayout';
import { FaComment, FaStar, FaCheckCircle, FaTimesCircle, FaUserMd, FaCalendarAlt } from 'react-icons/fa';

export default function Feedback() {
  const [searchParams] = useSearchParams();
  const appointmentIdFromUrl = searchParams.get('appointment');

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(appointmentIdFromUrl || '');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [pastFeedbacks, setPastFeedbacks] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/appointments/completed-without-feedback');
        setAppointments(data);
        const { data: feedbackData } = await api.get('/feedback/all');
        const feedbackMap = {};
        feedbackData.forEach(fb => {
          feedbackMap[fb.appointmentId] = { rating: fb.rating, comment: fb.comment };
        });
        setPastFeedbacks(feedbackMap);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAppointment && pastFeedbacks[selectedAppointment]) {
      setRating(pastFeedbacks[selectedAppointment].rating);
      setComment(pastFeedbacks[selectedAppointment].comment);
    } else {
      setRating(0);
      setComment('');
    }
    setHoverRating(0);
  }, [selectedAppointment, pastFeedbacks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/feedback', { appointmentId: selectedAppointment, rating, comment });
      setMessage('success:Thank you for your feedback!');
      setPastFeedbacks(prev => ({
        ...prev,
        [selectedAppointment]: { rating, comment },
      }));
    } catch (error) {
      setMessage('error:' + (error.response?.data?.message || 'Submission failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const msgType = message.startsWith('success:') ? 'success' : 'error';
  const msgText = message.replace(/^(success:|error:)/, '');

  const selectedApt = appointments.find(a => a._id === selectedAppointment);
  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <DashboardLayout activePage="feedback">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        .fb-root { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Fraunces', serif; }

        .hero-fb {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%);
        }

        .star-btn {
          background: none; border: none; cursor: pointer;
          transition: transform 0.15s ease;
          line-height: 1;
        }
        .star-btn:hover { transform: scale(1.25); }
        .star-btn:focus { outline: none; }

        .fb-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fb-select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }

        .fb-textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }

        .submit-btn {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
          transition: opacity 0.2s, transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .past-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .past-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }

        .fade-in { animation: fadeUp 0.4s ease forwards; opacity: 0; }
        .fade-in:nth-child(1) { animation-delay: 0.05s; }
        .fade-in:nth-child(2) { animation-delay: 0.12s; }
        .fade-in:nth-child(3) { animation-delay: 0.19s; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

        .rating-pill {
          transition: all 0.2s;
        }
      `}</style>

      <div className="fb-root max-w-3xl mx-auto space-y-6 pb-10">

        {/* ── Hero ── */}
        <div className="hero-fb rounded-2xl p-7 md:p-9 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div style={{position:'absolute',width:260,height:260,background:'radial-gradient(circle,rgba(96,165,250,0.15) 0%,transparent 70%)',top:-50,right:-40,borderRadius:'50%'}} />
            <div style={{position:'absolute',width:150,height:150,background:'radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 70%)',bottom:-30,left:50,borderRadius:'50%'}} />
          </div>
          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-medium tracking-widest uppercase mb-1">Feedback</p>
            <h1 className="display-font text-3xl font-semibold mb-2">Share Your Experience</h1>
            <p className="text-blue-100 text-sm max-w-md leading-relaxed">
              Your feedback helps doctors improve and helps other patients make better decisions.
            </p>
            <div className="mt-5 flex gap-4 flex-wrap">
              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200 text-xs block">Pending Reviews</span>
                <span className="font-semibold">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm">
                <span className="text-blue-200 text-xs block">Reviews Given</span>
                <span className="font-semibold">{Object.keys(pastFeedbacks).length} review{Object.keys(pastFeedbacks).length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toast ── */}
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${
            msgType === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {msgType === 'success'
              ? <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
              : <FaTimesCircle className="text-red-400 flex-shrink-0" />}
            <p className="text-sm font-medium">{msgText}</p>
            <button onClick={() => setMessage('')} className="ml-auto text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
          </div>
        )}

        {/* ── Feedback Form ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="display-font text-lg font-semibold text-gray-800">Leave a Review</h2>
            <p className="text-gray-400 text-sm mt-0.5">Select a completed appointment to review</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Appointment Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Appointment</label>
              {appointments.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <FaCalendarAlt className="text-gray-300 text-xl" />
                  <p className="text-sm text-gray-400">No completed appointments pending review.</p>
                </div>
              ) : (
                <select
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                  className="fb-select w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white"
                  required
                >
                  <option value="">— Choose an appointment —</option>
                  {appointments.map((apt) => (
                    <option key={apt._id} value={apt._id}>
                      Dr. {apt.doctor?.name} · {new Date(apt.date || apt.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              )}

              {/* Selected doctor preview */}
              {selectedApt && (
                <div className="mt-3 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">{selectedApt.doctor?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Dr. {selectedApt.doctor?.name}</p>
                    <p className="text-xs text-blue-500">
                      {new Date(selectedApt.date || selectedApt.startTime).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    className="star-btn"
                    onClick={() => setRating(num)}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <span className={`text-4xl leading-none ${num <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-200'}`}>
                      ★
                    </span>
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className="ml-3 text-sm font-semibold text-amber-500 rating-pill bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share details about your experience with this doctor..."
                className="fb-textarea w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedAppointment || rating === 0}
              className="submit-btn w-full py-3 rounded-xl text-white text-sm font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* ── Past Feedbacks ── */}
        <div>
          <h3 className="display-font text-lg font-semibold text-gray-800 mb-3">
            Past Reviews{' '}
            <span className="text-gray-400">({Object.keys(pastFeedbacks).length})</span>
          </h3>

          {Object.keys(pastFeedbacks).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <FaComment className="text-gray-200 text-4xl mx-auto mb-3" />
              <p className="text-gray-400 text-sm">You haven't submitted any reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(pastFeedbacks).map(([aptId, fb]) => {
                const apt = appointments.find(a => a._id === aptId);
                if (!apt) return null;
                return (
                  <div key={aptId} className="past-card bg-white rounded-2xl border border-gray-100 shadow-sm p-5 fade-in">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <span className="text-amber-600 font-bold">{apt.doctor?.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">Dr. {apt.doctor?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <FaCalendarAlt className="text-gray-300" />
                              {new Date(apt.date || apt.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(num => (
                              <span key={num} className={`text-lg ${num <= fb.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                            ))}
                            <span className="ml-1.5 text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                              {ratingLabels[fb.rating]}
                            </span>
                          </div>
                        </div>
                        {fb.comment && (
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            "{fb.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}