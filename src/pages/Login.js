import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import

// Backend URL constant
const API_URL = "https://mbstu-research-backend.onrender.com";

function Login({ setUser }) {  // ✅ setUser prop receive korchi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Add this

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // JWT token and user info save
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('profileName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);

        // ✅ IMPORTANT: Update app state
        if (setUser) {
          setUser({
            name: data.user.name,
            email: data.user.email
          });
        }

        // ✅ CHANGE: Use navigate instead of window.location
        navigate('/'); // Home e redirect
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (error) {
      alert('Fetch error: ' + error.message);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#2f357f', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="MBSTU Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(90deg, #366eea, #38befb 85%)',
            color: 'white',
            border: 'none',
            borderRadius: '27px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
