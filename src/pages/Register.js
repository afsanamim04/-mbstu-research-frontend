import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();

    // ধরে নিচ্ছি backend থেকে response.data.user পাওয়া যাচ্ছে (যেমন: {name, dob, gender, bio, ...})
    if (response.ok && data.user) {
      const user = data.user;
      
      // এখানে localStorage-এ সেট করবে
      localStorage.setItem('profileName', user.name || '');
      localStorage.setItem('profileDob', user.dob || '');
      localStorage.setItem('profileGender', user.gender || '');
      localStorage.setItem('profileBio', user.bio || '');
      localStorage.setItem('profilePic', user.profilePic || '');
      localStorage.setItem('coverPic', user.coverPhoto || '');
    }

    if (response.ok) {
  alert(data.message);
  window.location.href = '/login'; // Login পেজে পাঠাবে
}


  } catch (error) {
    alert('Fetch error: ' + error.message);
  }
};


  return (
    <div className="registration-page">
      <div className="left-panel">
        <h1>MBSTU Research Gate</h1>
      </div>
      <div className="right-panel">
        <form className="registration-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" name="name"
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">MBSTU Email</label>
            <input 
              type="email" 
              id="email" name="email"
              pattern="[a-z0-9._%+-]+@mbstu.ac.bd$"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" name="password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;