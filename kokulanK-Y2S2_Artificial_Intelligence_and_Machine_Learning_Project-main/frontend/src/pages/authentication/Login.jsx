import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);

    if (result.success) {
      const role = result.data.role;
      if (role === "patient") navigate("/dashboard/patient");
      else if (role === "doctor") navigate("/dashboard/doctor");
      else if (role === "receptionist") navigate("/dashboard/receptionist");
      else if (role === "labTechnician") navigate("/dashboard/labtechnician");
      else if (role === "admin") navigate("/dashboard/admin");
      else if (role === "cleaningStaff") navigate("/dashboard/cleaning");
      } else {
      setError(result.error);
    }
  };

  const styles = {
    wrapper: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #1f4068, #2980b9)",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      flexWrap: "wrap",
      position: "relative",
    },
    backArrow: {
      position: "fixed",
      top: "20px",
      left: "20px",
      fontSize: "22px",
      cursor: "pointer",
      color: "#fff",
      fontWeight: "600",
      userSelect: "none",
      padding: "6px 12px",
      borderRadius: "8px",
      background: "rgba(255,255,255,0.2)",
      transition: "0.2s",
      zIndex: 1000,
    },
    card: {
      width: "400px",
      maxWidth: "100%",
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(20px)",
      padding: "40px 30px",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
      border: "1px solid rgba(255,255,255,0.18)",
      color: "#fff",
      textAlign: "center",
      animation: "fadeIn 1s ease",
      position: "relative",
    },
    headerIcon: {
      fontSize: "60px",
      marginBottom: "15px",
      color: "#fff",
      animation: "float 3s ease-in-out infinite",
    },
    headerText: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "25px",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      background: "rgba(255,255,255,0.15)",
      borderRadius: "10px",
      padding: "12px 15px",
      marginBottom: "18px",
      transition: "0.3s",
    },
    input: {
      border: "none",
      outline: "none",
      flex: 1,
      marginLeft: "10px",
      fontSize: "14px",
      background: "transparent",
      color: "#fff",
    },
    button: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(90deg, #2980b9, #6dd5fa)",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
    },
    error: { color: "#ff6b6b", marginBottom: "15px", fontWeight: "500" },
    registerLinks: {
      marginTop: "15px",
      fontSize: "13px",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "8px",
    },
    link: {
      display: "inline-block",
      padding: "5px 12px",
      borderRadius: "8px",
      border: "1px solid #00c6ff",
      color: "#00c6ff",
      textDecoration: "none",
      fontSize: "13px",
      transition: "0.2s",
    },
    linkHover: {
      background: "rgba(0,198,255,0.1)",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.backArrow}
        onClick={() => navigate("/")}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.35)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
        }
      >
        ←
      </div>

      <div style={styles.card}>
        <FaUser style={styles.headerIcon} />
        <h2 style={styles.headerText}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaEnvelope />
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <div style={styles.registerLinks}>
          <Link
            style={styles.link}
            to="/register/patient"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,198,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Patient
          </Link>
          <Link
            style={styles.link}
            to="/register/doctor"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,198,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Doctor
          </Link>
          <Link
            style={styles.link}
            to="/register/receptionist"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,198,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Receptionist
          </Link>
          <Link
            style={styles.link}
            to="/register/labtechnician"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,198,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Lab Technician
          </Link>

          <Link
            style={styles.link}
            to="/register/cleaningstaff"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,198,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cleaning Staff
          </Link>
          <Link
            style={styles.link}
            to="/register/admin"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,198,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;