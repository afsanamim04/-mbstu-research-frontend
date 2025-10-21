// App.js এর শুরুতেই এই imports গুলো যোগ করুন
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserPlus, FaUserCircle, FaSignOutAlt, FaBell } from "react-icons/fa";
import ProfileEdit from './pages/ProfileEdit';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import NotificationPage from './pages/NotificationPage';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Logout from "./pages/Logout";
import React, { useState, useEffect } from "react";

// Backend URL constant
const API_URL = "https://mbstu-research-backend.onrender.com";

// NavIcon component with React state
function NavIcon({ to, icon: Icon, label, onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link 
      to={to}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        margin: "0 15px",
        padding: "8px",
        color: "#444",
        position: "relative",
        textDecoration: "none",
        fontSize: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <Icon />
        <span
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            zIndex: 1000,
            visibility: showTooltip ? "visible" : "hidden",
            opacity: showTooltip ? 1 : 0,
            transition: "opacity 0.2s"
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8f9fc',
  padding: '15px 20px',
  borderBottom: '2px solid #e8eaf0',
  justifyContent: 'space-between',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

// Registration page component
function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('Registration successful! Please check your email for verification.');
        setFormData({ name: '', email: '', password: '' });
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={{ 
      minHeight: "80vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: 800,
        borderRadius: 20,
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        background: "#fff",
        overflow: "hidden"
      }}>
        {/* Left side - Branding */}
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg, #366eea 0%, #2f357f 100%)",
          color: "#fff",
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}>
          <h2 style={{ 
            fontWeight: 700, 
            fontSize: "2rem", 
            margin: "0 0 20px 0",
            lineHeight: 1.2
          }}>
            MBSTU Research Gate
          </h2>
          <p style={{ 
            fontSize: "1rem", 
            opacity: 0.9,
            margin: 0
          }}>
            Join our research community and collaborate with fellow researchers.
          </p>
        </div>

        {/* Right side - Form */}
        <div style={{
          flex: 1,
          background: "#fff",
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h2 style={{
            fontWeight: 600,
            fontSize: "1.8rem",
            color: "#2f357f",
            marginBottom: 30,
            textAlign: "center"
          }}>
            Create Account
          </h2>
          
          <form onSubmit={handleRegister} style={{ width: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="name" style={{ 
                display: "block", 
                marginBottom: 8,
                fontWeight: 500,
                color: "#333"
              }}>
                Full Name
              </label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name" 
                style={{ 
                  width: "100%",
                  padding: "12px 15px",
                  border: "2px solid #e1e5ee",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s"
                }} 
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label htmlFor="email" style={{ 
                display: "block", 
                marginBottom: 8,
                fontWeight: 500,
                color: "#333"
              }}>
                Email
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your MBSTU email" 
                style={{ 
                  width: "100%",
                  padding: "12px 15px",
                  border: "2px solid #e1e5ee",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s"
                }} 
              />
            </div>

            <div style={{ marginBottom: 30 }}>
              <label htmlFor="password" style={{ 
                display: "block", 
                marginBottom: 8,
                fontWeight: 500,
                color: "#333"
              }}>
                Password
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password" 
                style={{ 
                  width: "100%",
                  padding: "12px 15px",
                  border: "2px solid #e1e5ee",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s"
                }} 
              />
            </div>

            <button 
              type="submit" 
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #366eea, #38befb)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "14px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Register Now
            </button>
          </form>

          <div style={{ 
            textAlign: "center", 
            marginTop: 20,
            color: "#666"
          }}>
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ 
                color: "#366eea", 
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [showLogoTooltip, setShowLogoTooltip] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          // Verify token with backend
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            // Token invalid, clear localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("profileName");
            localStorage.removeItem("userEmail");
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Fallback to localStorage if API fails
        const profileName = localStorage.getItem("profileName");
        if (profileName) {
          setUser({
            name: profileName,
            email: localStorage.getItem('userEmail') || 'user@mbstu.ac.bd'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("profileName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setUser(null);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#366eea',
        fontWeight: '500'
      }}>
        Loading MBSTU Research Gate...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <nav style={navStyle}>
        {/* Left Section - Logo and Navigation */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div
              onMouseEnter={() => setShowLogoTooltip(true)}
              onMouseLeave={() => setShowLogoTooltip(false)}
              style={{
                marginRight: "30px",
                display: "flex",
                alignItems: "center",
                position: "relative",
                cursor: "pointer"
              }}
            >
              <img
                src="/mbstu-logo.jpg"
                alt="MBSTU Logo"
                style={{ 
                  height: 45, 
                  width: 45,
                  borderRadius: "8px",
                  objectFit: "cover"
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: "-35px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#222",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  visibility: showLogoTooltip ? "visible" : "hidden",
                  zIndex: 1000,
                  opacity: showLogoTooltip ? 1 : 0,
                  transition: "opacity 0.2s"
                }}
              >
                MBSTU Research Gate
              </span>
            </div>
          </Link>
          
          {/* Navigation Icons */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NavIcon to="/" icon={FaHome} label="Home" />
            
            {!user && (
              <>
                <NavIcon to="/register" icon={FaUserPlus} label="Register" />
                <NavIcon to="/login" icon={FaUserCircle} label="Login" />
              </>
            )}
            
            {user && (
              <>
                <NavIcon to="/account" icon={FaUserCircle} label="My Account" />
                <NavIcon to="/notifications" icon={FaBell} label="Notifications" />
                <NavIcon 
                  to="/logout" 
                  icon={FaSignOutAlt} 
                  label="Logout" 
                  onClick={handleLogout}
                />
              </>
            )}
          </div>
        </div>

        {/* Right Section - Search and User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search research..."
            style={{
              width: 200,
              height: 40,
              borderRadius: "20px",
              border: '2px solid #e8eaf0',
              fontSize: 14,
              padding: '0 15px',
              outline: 'none',
              background: '#fff',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#366eea';
              e.target.style.width = '250px';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8eaf0';
              e.target.style.width = '200px';
            }}
          />

          {/* User Info */}
          {user && (
            <div style={{ 
              color: '#2f357f',
              fontWeight: '600',
              fontSize: '15px'
            }}>
              Welcome, {user.name}!
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        minHeight: 'calc(100vh - 100px)',
        background: '#f8f9fc'
      }}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-edit" element={<ProfileEdit user={user} setUser={setUser} />} />
          <Route path="/account" element={<AccountPage user={user} setUser={setUser} />} />
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/notifications" element={<NotificationPage user={user} />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
