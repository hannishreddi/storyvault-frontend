// src/components/Feed.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getPlainText } from '../utils/textUtils';

export default function Feed({ stories }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: '#000000', fontSize: '2.25rem', fontFamily: 'Georgia, serif', fontWeight: '400', marginBottom: '10px' }}>The Community Chronicle</h1>
      </div>
      
      {stories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6B7280' }}>No stories posted yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {stories.map((item) => (
            // Notice we use <Link> now instead of onClick logic!
            <Link to={`/story/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                {item.coverImage && <img src={item.coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                <div style={{ padding: '28px' }}>
                  <h2 style={{ color: '#000000', fontFamily: 'Georgia, serif', fontSize: '1.5rem', margin: '0 0 8px 0', fontWeight: '400' }}>{item.title}</h2>
                  <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.85rem', marginBottom: '16px' }}>
                    <span>By <strong>@{item.author?.username || 'unknown_author'}</strong></span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#4B5563', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getPlainText(item.content)}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}