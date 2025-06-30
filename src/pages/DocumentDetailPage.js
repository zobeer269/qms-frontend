// src/pages/DocumentDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext'; // 1. نستورد السياق لمعرفة المستخدم الحالي

function DocumentDetailPage() {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 2. حالة جديدة لتتبع "وضع التعديل"
  const [isEditing, setIsEditing] = useState(false);
  // حالة جديدة لتخزين بيانات الفورم أثناء التعديل
  const [formData, setFormData] = useState({});

  const { id } = useParams();
  const { user } = useAuth(); // 3. نحصل على بيانات المستخدم الحالي من السياق

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/documents/${id}/`);
        setDocument(response.data);
        // 4. نملأ الفورم بالبيانات الأصلية عند تحميلها
        setFormData(response.data);
      } catch (err) {
        setError('Failed to load document details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // 5. نرسل طلب PATCH بالبيانات المحدثة فقط
      const response = await apiClient.patch(`/documents/${id}/`, {
        title: formData.title,
        doc_id: formData.doc_id,
        version: formData.version,
      });
      setDocument(response.data); // تحديث العرض بالبيانات الجديدة
      setIsEditing(false); // الخروج من وضع التعديل
    } catch (err) {
      console.error('Failed to update document:', err);
      setError('Update failed.');
    }
  };

  if (loading) return <div>Loading document details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!document) return <div>Document not found.</div>;

  // 6. العرض المشروط: إما عرض التفاصيل أو فورم التعديل
  return (
    <div>
      <Link to="/documents">← Back to All Documents</Link>
      
      {isEditing ? (
        // --- فورم التعديل ---
        <form onSubmit={handleUpdateSubmit} style={{marginTop: '20px'}}>
          <h2>Edit Document</h2>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={{width: '100%', padding: '8px'}} />
          </div>
          <div style={{marginTop: '10px'}}>
            <label>Document ID:</label>
            <input type="text" name="doc_id" value={formData.doc_id} onChange={handleInputChange} style={{width: '100%', padding: '8px'}} />
          </div>
          <div style={{marginTop: '10px'}}>
            <label>Version:</label>
            <input type="text" name="version" value={formData.version} onChange={handleInputChange} style={{width: '100%', padding: '8px'}} />
          </div>
          <div style={{marginTop: '20px'}}>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{marginLeft: '10px'}}>Cancel</button>
          </div>
        </form>
      ) : (
        // --- عرض التفاصيل العادي ---
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{marginTop: '20px'}}>{document.title}</h2>
            {/* 7. نعرض زر التعديل فقط إذا كان المستخدم الحالي هو المؤلف */}
            {user && user.username === document.author_username && (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
          <hr />
          <div style={{lineHeight: '1.8'}}>
            <p><strong>Document ID:</strong> {document.doc_id}</p>
            <p><strong>Version:</strong> {document.version}</p>
            <p><strong>Status:</strong> {document.status_display}</p>
            <p><strong>Author:</strong> {document.author_username}</p>
            <p><strong>Created On:</strong> {new Date(document.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentDetailPage;