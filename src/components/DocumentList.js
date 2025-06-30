// src/components/DocumentList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// نستقبل التوكن من المكون الأب
function DocumentList({ token, onLogout }) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/documents/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error('Error fetching documents:', error);
      });
    }
  }, [token]);

  return (
    <div>
      <h2>Document List</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{doc.title} ({doc.doc_id})</li>
        ))}
      </ul>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default DocumentList;