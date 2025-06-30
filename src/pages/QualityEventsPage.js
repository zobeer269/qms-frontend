// src/pages/QualityEventsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';

function QualityEventsPage() {
  const [ncrs, setNcrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/quality-events/')
      .then(response => {
        const ncrData = response.data.results || response.data;
        setNcrs(Array.isArray(ncrData) ? ncrData : []);
        setLoading(false);
      })
      .catch(error => console.error("Error fetching NCRs:", error));
  }, []);

  const filteredNcrs = useMemo(() => {
    if (!searchTerm) return ncrs;
    return ncrs.filter(ncr => ncr.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [ncrs, searchTerm]);

  if (loading) return <div>Loading NCRs...</div>;

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>Non-Conformance Reports</Typography>
      <TextField label="Search by title..." variant="outlined" fullWidth style={{ marginBottom: '20px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>NCR ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reported by</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNcrs.map(ncr => (
              <TableRow key={ncr.id} hover onClick={() => navigate(`/quality-events/${ncr.id}`)} style={{ cursor: 'pointer' }}>
                <TableCell>{ncr.id}</TableCell>
                <TableCell>{ncr.title}</TableCell>
                <TableCell>{ncr.status_display}</TableCell>
                <TableCell>{ncr.reported_by_username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default QualityEventsPage;