// src/pages/DocumentsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// 1. استيراد كل المكونات اللازمة للجدول من MUI
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  TextField // سنستخدم TextField الخاص بـ MUI للبحث أيضًا
} from '@mui/material';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // ... منطق جلب البيانات يبقى كما هو تمامًا ...
    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/documents/');
            const docsData = response.data.results || response.data;
            setDocuments(Array.isArray(docsData) ? docsData : []);
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError('Failed to load documents.');
        } finally {
            setLoading(false);
        }
    };
    fetchDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    // ... منطق الفلترة يبقى كما هو تمامًا ...
    if (!searchTerm) return documents;
    return documents.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [documents, searchTerm]);

  const handleRowClick = (id) => {
    navigate(`/documents/${id}`);
  };

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // --- 2. هذا هو الجزء الذي قمنا بتغييره بالكامل ---
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Documents Management
      </Typography>
      
      <TextField
        label="Search by title..."
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      <TableContainer component={Paper}>
        <Table aria-label="documents table">
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Document ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow
                key={doc.id}
                hover // لإضافة تأثير بصري عند مرور الماوس
                onClick={() => handleRowClick(doc.id)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">{doc.doc_id}</TableCell>
                <TableCell>{doc.title}</TableCell>
                <TableCell>{doc.version}</TableCell>
                <TableCell>{doc.status_display || doc.status}</TableCell>
                <TableCell>{doc.author_username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredDocuments.length === 0 && !loading && <p>No documents found.</p>}
    </div>
  );
}

export default DocumentsPage;