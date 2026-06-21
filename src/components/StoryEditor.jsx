// src/components/StoryEditor.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 
import { AuthContext } from '../context/AuthContext';
import { getPlainText } from '../utils/textUtils';

export default function StoryEditor({ stories, loadStories }) {
  const { id } = useParams(); // Gets ID if we are editing
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [coverImage, setCoverImage] = useState(''); 
  const [uploadingImage, setUploadingImage] = useState(false);

  // If there is an ID in the URL, automatically pre-fill the form!
  useEffect(() => {
    if (id && stories?.length > 0) {
      const existingStory = stories.find(s => s._id === id);
      if (existingStory) {
        setTitle(existingStory.title);
        setContent(existingStory.content);
        setCoverImage(existingStory.coverImage || '');
      }
    }
  }, [id, stories]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });
      const data = await response.json();
      if (response.ok) setCoverImage(data.imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    const plainText = getPlainText(content).trim();
    if (!title.trim() || !plainText) return alert('All story fields require text data.');

    const endpoint = id ? `/stories/${id}` : '/stories';
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, content, coverImage })
      });

      if (response.ok) {
        await loadStories(); // Refresh global stories
        navigate(id ? '/mystories' : '/'); // Go to dashboard if edited, feed if new
      }
    } catch (err) {
      console.error('Data pipeline error:', err);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
        {id ? 'Edit Your Story' : 'Share Your Thoughts'}
      </h1>
      <form onSubmit={handleFormSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Cover Image</label>
          {coverImage ? (
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }} />
              <button type="button" onClick={() => setCoverImage('')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ width: '100%', padding: '10px', border: '1px dashed #D1D5DB', borderRadius: '6px' }} />
          )}
          {uploadingImage && <p style={{ fontSize: '0.85rem', color: '#007bff' }}>Uploading image...</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Story Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A name for your entry..." style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '1rem' }} />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Story Content</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} style={{ height: '300px', marginBottom: '40px' }} />
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: '12px 24px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={uploadingImage} style={{ padding: '12px 24px', backgroundColor: uploadingImage ? '#9CA3AF' : '#1F2937', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            {id ? 'Save Changes' : 'Publish Story'}
          </button>
        </div>
      </form>
    </div>
  );
}