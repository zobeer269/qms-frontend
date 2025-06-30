// src/pages/AuditsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// استيراد مكونات MUI
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  TextField 
} from '@mui/material';

function AuditsPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/auditing/audits/')
      .then(response => {
        const auditsData = response.data.results || response.data;
        setAudits(Array.isArray(auditsData) ? auditsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching audits:", error);
        setLoading(false);
      });
  }, []);

  const filteredAudits = useMemo(() => {
    if (!searchTerm) return audits;
    return audits.filter(audit => audit.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [audits, searchTerm]);

  if (loading) return <div>Loading Audits...</div>;

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Audits Management
      </Typography>
      
      <TextField
        label="Search by Audit Title..."
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Lead Auditor</TableCell>
              <TableCell>Planned Start Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAudits.map(audit => (
              <TableRow
                key={audit.id}
                hover
                onClick={() => navigate(`/audits/${audit.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{audit.title}</TableCell>
                <TableCell>{audit.audit_type_display}</TableCell>
                <TableCell>{audit.status_display}</TableCell>
                <TableCell>{audit.lead_auditor_username}</TableCell>
                <TableCell>{audit.planned_start_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default AuditsPage;