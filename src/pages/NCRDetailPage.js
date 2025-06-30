// src/pages/NCRDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

function NCRDetailPage() {
  const [ncr, setNcr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNcr = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/quality-events/${id}/`);
        setNcr(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to load NCR details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNcr();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.patch(`/quality-events/${id}/`, {
        title: formData.title,
        description: formData.description,
      });
      setNcr(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Update failed.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading NCR details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!ncr) return <div>NCR not found.</div>;

  return (
    <div>
      <Link to="/quality-events">← Back to All NCRs</Link>
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} style={{ marginTop: '20px' }}>
          <h2>Edit NCR-{ncr.id}</h2>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '8px', minHeight: '100px' }} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ marginTop: '20px' }}>NCR-{ncr.id}: {ncr.title}</h2>
            {user && user.username === ncr.reported_by_username && (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
          <hr />
          <div style={{ lineHeight: '1.8' }}>
            <p><strong>Description:</strong> {ncr.description}</p>
            <p><strong>Status:</strong> {ncr.status_display}</p>
            <p><strong>Source:</strong> {ncr.source_display}</p>
            <p><strong>Reported by:</strong> {ncr.reported_by_username}</p>
            <p><strong>Reported On:</strong> {new Date(ncr.reported_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NCRDetailPage;