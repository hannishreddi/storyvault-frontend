// src/components/MyStories.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPlainText } from '../utils/textUtils';

export default function MyStories({ stories, loadStories }) {
  const { token, loggedInUser } = useContext(AuthContext);
  const userStories = stories.filter(s => s.author?.username === loggedInUser);
  const API_BASE = 'http://localhost:5000/api';

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story completely?")) return;
    try {
      const response = await fetch(`${API_BASE}/stories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) await loadStories();
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: '#000000', fontSize: '2.25rem', fontFamily: 'Georgia, serif', fontWeight: '400', marginBottom: '10px' }}>My Stories</h1>
      </div>
      
      {userStories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6B7280' }}>You haven't posted any stories yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {userStories.map((item) => (
            <article key={item._id} style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <h2 style={{ color: '#000000', fontFamily: 'Georgia, serif', fontSize: '1.5rem', margin: '0 0 8px 0', fontWeight: '400' }}>{item.title}</h2>
              <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.85rem', marginBottom: '16px' }}>
                <span>Published on {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#4B5563', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {getPlainText(item.content)}
              </p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
                <Link to={`/story/${item._id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>Read</Link>
                <Link to={`/edit/${item._id}`} style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: '500' }}>Edit</Link>
                <button onClick={() => handleDelete(item._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', padding: 0 }}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}