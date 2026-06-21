// src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Header from './components/Header'; 
import Auth from './components/Auth';
import Feed from './components/Feed';
import MyStories from './components/MyStories';
import ReadStory from './components/ReadStory';
import StoryEditor from './components/StoryEditor';

// We create a wrapper component to access AuthContext inside the Router
function AppRoutes() {
  const { token } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  // Fetch stories whenever the user logs in
  useEffect(() => {
    if (token) loadStoriesFromDatabase();
  }, [token]);

  const loadStoriesFromDatabase = async () => {
    try {
      const response = await fetch(`${API_BASE}/stories`);
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (err) {
      console.error('Network fetching failure:', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', color: '#1F2937', fontFamily: 'system-ui, sans-serif' }}>
      <Header />

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 20px' }}>
        <Routes>
          {/* Public Route: Only accessible if NOT logged in */}
          <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/" />} />

          {/* Protected Routes: Redirect to /auth if there is no token */}
          <Route path="/" element={token ? <Feed stories={stories} /> : <Navigate to="/auth" />} />
          <Route path="/story/:id" element={token ? <ReadStory stories={stories} /> : <Navigate to="/auth" />} />
          <Route path="/write" element={token ? <StoryEditor loadStories={loadStoriesFromDatabase} /> : <Navigate to="/auth" />} />
          <Route path="/edit/:id" element={token ? <StoryEditor stories={stories} loadStories={loadStoriesFromDatabase} /> : <Navigate to="/auth" />} />
          <Route path="/mystories" element={token ? <MyStories stories={stories} loadStories={loadStoriesFromDatabase} /> : <Navigate to="/auth" />} />
        </Routes>
      </main>
    </div>
  );
}

// Wrap the whole application in the AuthProvider and BrowserRouter
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}