// frontend/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaUserMd, FaHeartbeat, FaMicroscope, FaArrowRight, FaShieldAlt, FaStar, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const skinTips = [
  {
    icon: '🔍',
    title: 'Early Detection',
    desc: 'Catching skin changes early can make a critical difference. Our AI scans detect irregularities in seconds.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    accent: 'text-blue-600',
  },
  {
    icon: '☀️',
    title: 'Sun Damage Check',
    desc: 'UV exposure is the leading cause of skin cancer. Upload a photo to assess signs of sun damage on your skin.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    accent: 'text-amber-600',
  },
  {
    icon: '🧬',
    title: 'Mole Monitoring',
    desc: 'Track changes in moles and spots over time. Our AI compares scans to identify concerning developments.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    accent: 'text-violet-600',
  },
  {
    icon: '💧',
    title: 'Hydration & Texture',
    desc: 'Dry, flaky, or oily skin can signal underlying issues. Get personalised hydration and skincare guidance.',
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-50',
    accent: 'text-cyan-600',
  },
  {
    icon: '🩺',
    title: 'Dermatologist Ready',
    desc: 'Generate a scan report to share directly with your dermatologist for a faster, more informed consultation.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    accent: 'text-emerald-600',
  },
  {
    icon: '📊',
    title: 'Skin History Tracking',
    desc: 'Build a visual timeline of your skin health. Monitor improvements or flag new concerns over weeks and months.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    accent: 'text-rose-600',
  },
];

const stats = [
  { value: '50K+', label: 'Patients Served' },
  { value: '200+', label: 'Expert Doctors' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Available' },
];

const testimonials = [
  {
    name: 'Amara Silva',
    role: 'Patient',
    text: 'The AI skin scanner flagged a mole I\'d ignored for years. My dermatologist confirmed it needed attention. This app may have saved my life.',
    rating: 5,
    avatar: 'AS',
  },
  {
    name: 'Rohan Perera',
    role: 'Patient',
    text: 'Booking appointments used to take days of phone calls. Now I find a slot and confirm in under two minutes. Incredible.',
    rating: 5,
    avatar: 'RP',
  },
  {
    name: 'Dilini Fernando',
    role: 'Patient',
    text: 'Clear results, easy interface, and the scan history feature is genuinely useful for tracking my eczema over time.',
    rating: 5,
    avatar: 'DF',
  },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8faff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,500&family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .display { font-family: 'Fraunces', serif; }

        /* NAV */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 68px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #eef0f6;
          box-shadow: 0 1px 20px rgba(0,0,0,0.05);
        }
        .logo { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 700; color: #1d4ed8; letter-spacing: -0.5px; }
        .logo span { color: #0f172a; }
        .nav-links { display: flex; align-items: center; gap: 12px; }
        .nav-login { color: #374151; font-size: 0.9rem; font-weight: 500; text-decoration: none; padding: 8px 16px; border-radius: 10px; transition: background 0.15s; }
        .nav-login:hover { background: #f3f4f6; }
        .nav-cta { background: linear-gradient(135deg,#1d4ed8,#3b82f6); color: white; font-size: 0.9rem; font-weight: 500; text-decoration: none; padding: 9px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(59,130,246,0.3); transition: opacity 0.2s, transform 0.2s; }
        .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

        /* HERO */
        .hero {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1d4ed8 100%);
          padding: 96px 48px 80px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(96,165,250,0.18) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 50% at 20% 70%, rgba(167,139,250,0.14) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          color: #bfdbfe; font-size: 0.78rem; font-weight: 600;
          padding: 6px 16px; border-radius: 99px;
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 28px;
        }
        .hero-badge span { width: 6px; height: 6px; background: #34d399; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .hero h1 { font-family: 'Fraunces', serif; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 700; color: white; line-height: 1.15; margin-bottom: 20px; max-width: 760px; }
        .hero h1 em { font-style: italic; color: #93c5fd; font-weight: 300; }
        .hero p { font-size: 1.08rem; color: #bfdbfe; max-width: 540px; line-height: 1.75; margin-bottom: 40px; }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .hero-btn-primary { background: white; color: #1d4ed8; font-weight: 600; font-size: 0.95rem; padding: 13px 28px; border-radius: 12px; text-decoration: none; display: flex; align-items: center; gap: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s; }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.2); }
        .hero-btn-secondary { background: transparent; color: white; font-weight: 500; font-size: 0.95rem; padding: 13px 24px; border-radius: 12px; text-decoration: none; border: 1.5px solid rgba(255,255,255,0.3); transition: background 0.2s; }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.08); }

        /* STATS */
        .stats-bar {
          display: grid; grid-template-columns: repeat(4,1fr);
          background: white; border-bottom: 1px solid #eef0f6;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .stat-item {
          padding: 28px; text-align: center;
          border-right: 1px solid #f3f4f6;
        }
        .stat-item:last-child { border-right: none; }
        .stat-value { font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 700; color: #1d4ed8; line-height: 1; }
        .stat-label { font-size: 0.8rem; color: #9ca3af; font-weight: 500; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

        /* SECTION */
        .section { padding: 80px 48px; }
        .section-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #3b82f6; margin-bottom: 12px; }
        .section-title { font-family: 'Fraunces', serif; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; color: #0f172a; line-height: 1.2; }
        .section-title em { font-style: italic; font-weight: 300; color: #3b82f6; }
        .section-sub { color: #6b7280; font-size: 1rem; line-height: 1.7; max-width: 540px; margin-top: 12px; }

        /* FEATURES */
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .feature-card {
          background: white; border-radius: 20px; border: 1.5px solid #f0f2f8;
          padding: 32px 28px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.09); }
        .feature-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 20px; }
        .feature-card h3 { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 600; color: #0f172a; margin-bottom: 10px; }
        .feature-card p { color: #6b7280; font-size: 0.9rem; line-height: 1.65; }

        /* SKIN SECTION */
        .skin-section { background: #0f172a; padding: 80px 48px; }
        .skin-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 1100px; margin: 48px auto 0; }
        .skin-card {
          border-radius: 20px; padding: 28px 24px;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
          transition: transform 0.2s, background 0.2s;
          cursor: default;
        }
        .skin-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.07); }
        .skin-emoji { font-size: 2.2rem; margin-bottom: 16px; display: block; }
        .skin-card h3 { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: white; margin-bottom: 10px; }
        .skin-card p { color: #94a3b8; font-size: 0.875rem; line-height: 1.65; }
        .skin-tag { display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 3px 10px; border-radius: 99px; margin-top: 14px; letter-spacing: 0.04em; }

        /* HOW IT WORKS */
        .steps { display: flex; gap: 0; max-width: 900px; margin: 48px auto 0; position: relative; }
        .steps::before { content: ''; position: absolute; top: 28px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg,#dbeafe,#bfdbfe,#dbeafe); z-index: 0; }
        .step { flex: 1; text-align: center; position: relative; z-index: 1; padding: 0 12px; }
        .step-num { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#1d4ed8,#3b82f6); color: white; font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 6px 18px rgba(59,130,246,0.35); }
        .step h4 { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
        .step p { color: #6b7280; font-size: 0.82rem; line-height: 1.6; }

        /* TESTIMONIALS */
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 1100px; margin: 48px auto 0; }
        .testi-card { background: white; border-radius: 20px; border: 1.5px solid #f0f2f8; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.04); }
        .testi-stars { display: flex; gap: 3px; margin-bottom: 16px; }
        .testi-text { color: #374151; font-size: 0.9rem; line-height: 1.7; font-style: italic; margin-bottom: 20px; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg,#1d4ed8,#7c3aed); color: white; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; }
        .testi-name { font-weight: 600; font-size: 0.88rem; color: #0f172a; }
        .testi-role { font-size: 0.78rem; color: #9ca3af; }

        /* CTA */
        .cta-section {
          background: linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#1d4ed8 100%);
          padding: 80px 48px; text-align: center; position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 60% at 80% 30%,rgba(96,165,250,0.15) 0%,transparent 65%);
          pointer-events: none;
        }
        .cta-section h2 { font-family: 'Fraunces', serif; font-size: clamp(2rem,3.5vw,2.8rem); font-weight: 700; color: white; margin-bottom: 16px; }
        .cta-section h2 em { font-style: italic; font-weight: 300; color: #93c5fd; }
        .cta-section p { color: #bfdbfe; font-size: 1rem; margin-bottom: 36px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.7; }

        /* FOOTER */
        .footer { background: #0f172a; padding: 40px 48px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); }
        .footer-logo { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700; color: #60a5fa; }
        .footer-text { color: #475569; font-size: 0.82rem; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .nav { padding: 0 24px; }
          .hero { padding: 64px 24px 60px; }
          .section { padding: 60px 24px; }
          .skin-section { padding: 60px 24px; }
          .features-grid, .skin-grid, .testi-grid { grid-template-columns: 1fr; }
          .steps { flex-direction: column; gap: 32px; }
          .steps::before { display: none; }
          .stats-bar { grid-template-columns: repeat(2,1fr); }
          .footer { flex-direction: column; gap: 12px; text-align: center; }
          .cta-section { padding: 60px 24px; }
        }

        .fade-up { animation: fadeUpIn 0.6s ease forwards; opacity: 0; }
        .fade-up:nth-child(1) { animation-delay: 0.1s; }
        .fade-up:nth-child(2) { animation-delay: 0.2s; }
        .fade-up:nth-child(3) { animation-delay: 0.3s; }
        .fade-up:nth-child(4) { animation-delay: 0.4s; }
        .fade-up:nth-child(5) { animation-delay: 0.5s; }
        .fade-up:nth-child(6) { animation-delay: 0.6s; }
        @keyframes fadeUpIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="logo">Medi<span>Care</span>+</div>
        <div className="nav-links">
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/register/patient" className="nav-cta">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">
          <span></span> AI-Powered Healthcare Platform
        </div>
        <h1>Your Health, <em>Our Priority</em></h1>
        <p>Book appointments with top specialists, get AI-powered skin analysis, and manage your health journey — all in one seamless platform.</p>
        <div className="hero-actions">
          <Link to="/register/patient" className="hero-btn-primary">
            Get Started Free <FaArrowRight style={{fontSize:'0.8rem'}} />
          </Link>
          <Link to="/login" className="hero-btn-secondary">Sign In</Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-bar">
        {stats.map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CORE FEATURES ── */}
      <section className="section" style={{ background: '#f8faff' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="section-label">Why MediCare+</p>
          <h2 className="section-title">Everything you need for <em>better health</em></h2>
          <p className="section-sub" style={{ margin: '12px auto 0' }}>One platform for appointments, AI diagnostics, and specialist care.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: '🩺', bg: 'bg-blue-50', emoji: '🩺', title: 'Expert Doctors', desc: 'Browse profiles, check ratings, and instantly connect with verified dermatologists and specialists near you.', tag: 'Book in 2 min', tagColor: '#dbeafe', tagText: '#1d4ed8' },
            { icon: '⏰', bg: 'bg-emerald-50', emoji: '⏰', title: '24/7 Scheduling', desc: 'Our live availability calendar means you can book, reschedule, or cancel appointments any time of the day or night.', tag: 'Always open', tagColor: '#dcfce7', tagText: '#16a34a' },
            { icon: '🔬', bg: 'bg-violet-50', emoji: '🔬', title: 'AI Skin Analysis', desc: 'Upload a photo of any skin area and receive an instant AI-powered preliminary report — shareable with your doctor.', tag: 'Powered by AI', tagColor: '#ede9fe', tagText: '#7c3aed' },
          ].map((f, i) => (
            <div className="feature-card fade-up" key={i}>
              <div className="feature-icon" style={{ background: f.tagColor, fontSize: '1.8rem' }}>{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span style={{ display: 'inline-block', marginTop: '16px', fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px', background: f.tagColor, color: f.tagText, letterSpacing: '0.04em' }}>
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKIN HEALTH SECTION ── */}
      <section className="skin-section">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '12px' }}>Skin Health Hub</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
            Why regular skin checks <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#93c5fd' }}>matter</em>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginTop: '14px', lineHeight: 1.75 }}>
            Skin cancer is one of the most common and preventable cancers. Our AI scanner and specialist network help you stay one step ahead.
          </p>
        </div>

        <div className="skin-grid">
          {skinTips.map((tip, i) => (
            <div className="skin-card fade-up" key={i}>
              <span className="skin-emoji">{tip.icon}</span>
              <h3>{tip.title}</h3>
              <p>{tip.desc}</p>
              <span className="skin-tag" style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                AI Assisted
              </span>
            </div>
          ))}
        </div>

        {/* CTA inside skin section */}
        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <Link to="/register/patient" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', color: 'white', fontWeight: 600, fontSize: '0.95rem', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(59,130,246,0.35)', transition: 'transform 0.2s, opacity 0.2s' }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Try the AI Scanner Free <FaArrowRight style={{ fontSize: '0.8rem' }} />
          </Link>
          <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '12px' }}>No credit card required · Demo results</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '0' }}>
          <p className="section-label">Simple Process</p>
          <h2 className="section-title">Up and running in <em>minutes</em></h2>
        </div>
        <div className="steps">
          {[
            { n: '1', title: 'Create Account', desc: 'Sign up free in under 60 seconds. No credit card needed.' },
            { n: '2', title: 'Choose a Doctor', desc: 'Search by specialty, rating, and availability to find your match.' },
            { n: '3', title: 'Book a Slot', desc: 'Pick a date and time that works for you. Instant confirmation.' },
            { n: '4', title: 'Get Care', desc: 'Attend your appointment and use the AI scanner anytime.' },
          ].map((s, i) => (
            <div className="step fade-up" key={i}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: '#f8faff' }}>
        <div style={{ textAlign: 'center', marginBottom: '0' }}>
          <p className="section-label">Patient Stories</p>
          <h2 className="section-title">Trusted by <em>thousands</em></h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card fade-up" key={i}>
              <div className="testi-stars">
                {[...Array(t.rating)].map((_, j) => <FaStar key={j} style={{ color: '#f59e0b', fontSize: '0.85rem' }} />)}
              </div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.avatar}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2>Ready to take control of <em>your health?</em></h2>
          <p>Join thousands of patients who manage their health smarter with MediCare+. It's free to get started.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register/patient" style={{ background: 'white', color: '#1d4ed8', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s' }}>
              Create Free Account <FaArrowRight style={{ fontSize: '0.8rem' }} />
            </Link>
            <Link to="/login" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 500, fontSize: '0.95rem', padding: '13px 24px', borderRadius: '12px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              Sign In
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            {['No credit card required', 'Free skin scan included', 'Cancel anytime'].map(f => (
              <span key={f} style={{ color: '#93c5fd', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCheckCircle style={{ color: '#34d399', fontSize: '0.75rem' }} /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">MediCare+</div>
        <p className="footer-text">© 2025 MediCare+. All rights reserved. Demo only — not real medical advice.</p>
      </footer>
    </div>
  );
}