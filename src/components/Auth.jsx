// src/components/Auth.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Auth() {
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
    const payload = authMode === 'login' ? { email, password } : { username, email, password };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) return alert(data.message || 'Authentication sequence failed.');

      if (authMode === 'login') {
        login(data.token, data.username); // Using Context!
        navigate('/'); // Redirect to Feed
      } else {
        alert('Account verified successfully! Proceeding to Login panel view.');
        setAuthMode('login');
        setUsername('');
      }
    } catch (err) {
      console.error('Auth crash:', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '8px', border: '1px solid #E5E7EB', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', marginBottom: '24px' }}>
        {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {authMode === 'register' && (
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }} required />
        )}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }} required />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#1F2937', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          {authMode === 'login' ? 'Sign In' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6B7280', marginTop: '20px' }}>
        <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ color: '#007bff', cursor: 'pointer', fontWeight: '500' }}>
          {authMode === 'login' ? 'Create one here' : 'Login instead'}
        </span>
      </p>
    </div>
  );
}