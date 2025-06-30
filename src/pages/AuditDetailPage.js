// src/pages/AuditDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// استيراد مكونات MUI
import { Typography, Button, Paper, List, ListItem, ListItemText, Divider, Chip, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // أيقونة للعودة

function AuditDetailPage() {
  const [audit, setAudit] = useState(null);
  const [findings, setFindings] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const auditPromise = apiClient.get(`/auditing/audits/${id}/`);
    const findingsPromise = apiClient.get(`/auditing/findings/?audit=${id}`);
    
    Promise.all([auditPromise, findingsPromise])
      .then(([auditResponse, findingsResponse]) => {
        setAudit(auditResponse.data);
        const findingsData = findingsResponse.data.results || findingsResponse.data;
        setFindings(Array.isArray(findingsData) ? findingsData : []);
      })
      .catch(err => console.error("Error fetching details:", err));
  }, [id]);

  const handleCreateNcr = (findingId) => {
    if (window.confirm('Are you sure you want to create an NCR from this finding?')) {
      apiClient.post(`/auditing/findings/${findingId}/create-ncr/`)
        .then(response => {
          const newNcrId = response.data.ncr_id;
          alert(`Successfully created NCR with ID: ${newNcrId}`);
          navigate(`/quality-events/${newNcrId}`);
        })
        .catch(err => alert('Failed to create NCR.'));
    }
  };

  if (!audit) return <div>Loading...</div>;

  // تحديد لون الحالة
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'PLANNED': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '24px' }}>
      <Button component={Link} to="/audits" startIcon={<ArrowBackIcon />}>
        Back to All Audits
      </Button>

      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1">{audit.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Lead Auditor: {audit.lead_auditor_username}
          </Typography>
          <Chip label={audit.status_display} color={getStatusChipColor(audit.status)} />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }}/>
      
      <Typography variant="h5" gutterBottom>Findings</Typography>
      <List>
        {findings.length > 0 ? findings.map((finding, index) => (
          <React.Fragment key={finding.id}>
            <ListItem>
              <ListItemText 
                primary={finding.description} 
                secondary={`Type: ${finding.finding_type_display}`}
              />
              <Button variant="outlined" size="small" onClick={() => handleCreateNcr(finding.id)}>
                Create NCR
              </Button>
            </ListItem>
            {index < findings.length - 1 && <Divider component="li" />}
          </React.Fragment>
        )) : <ListItem><ListItemText primary="No findings recorded for this audit." /></ListItem>}
      </List>
    </Paper>
  );
}

export default AuditDetailPage;