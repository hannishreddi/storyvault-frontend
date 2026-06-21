// src/components/ReadStory.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; 

export default function ReadStory({ stories }) {
  const { id } = useParams(); // Automatically grabs the ID from the URL!
  const navigate = useNavigate();
  
  const selectedStory = stories.find(s => s._id === id);

  if (!selectedStory) return <p style={{ textAlign: 'center' }}>Story not found.</p>;

  return (
    <article style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      {selectedStory.coverImage && <img src={selectedStory.coverImage} alt="Cover" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />}
      <div style={{ padding: '40px' }}>
        <button onClick={() => navigate(-1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#000000', cursor: 'pointer', marginBottom: '24px', padding: 0 }}>← Back</button>
        <h1 style={{color: '#000000', fontFamily: 'Georgia, serif', fontSize: '2.25rem', fontWeight: '400', margin: '0 0 12px 0' }}>{selectedStory.title}</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '30px', borderBottom: '1px solid #E5E7EB', paddingBottom: '20px' }}>
          Authored by <strong>@{selectedStory.author?.username || 'unknown'}</strong> on {new Date(selectedStory.createdAt).toLocaleDateString()}
        </p>
        
        <div 
          style={{ fontSize: '1.15rem', lineHeight: '1.8', fontFamily: 'Georgia, serif', color: '#000000' }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedStory.content) }} 
        />
      </div>
    </article>
  );
}