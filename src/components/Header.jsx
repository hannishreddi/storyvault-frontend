// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { token, loggedInUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 40px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '700', textDecoration: 'none', color: '#1F2937' }}>
        📖 OpenStory
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {token ? (
          <>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#1F2937', fontSize: '0.95rem', fontWeight: '500' }}>Feed</Link>
              <Link to="/mystories" style={{ textDecoration: 'none', color: '#1F2937', fontSize: '0.95rem', fontWeight: '500' }}>My Stories</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '0.9rem', color: '#4B5563' }}>Hi, <strong>@{loggedInUser}</strong></span>
              <Link to="/write" style={{ padding: '10px 20px', backgroundColor: '#1F2937', color: '#FFFFFF', textDecoration: 'none', borderRadius: '6px', fontWeight: '500' }}>Write a Story</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.95rem' }}>Logout</button>
            </div>
          </>
        ) : (
          <Link to="/auth" style={{ padding: '8px 16px', backgroundColor: '#1F2937', color: '#FFFFFF', textDecoration: 'none', borderRadius: '6px', fontWeight: '500' }}>Sign In</Link>
        )}
      </div>
    </header>
  );
}