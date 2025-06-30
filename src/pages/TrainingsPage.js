// src/pages/TrainingsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function TrainingsPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/training/courses/')
      .then(response => {
        const data = response.data.results || response.data;
        setTrainings(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error("Error fetching trainings:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Trainings...</div>;

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>Training Courses</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Related Document</TableCell>
              <TableCell>Creation Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings.map(training => (
              <TableRow key={training.id} hover onClick={() => navigate(`/trainings/${training.id}`)} style={{ cursor: 'pointer' }}>
                <TableCell>{training.title}</TableCell>
                <TableCell>{training.related_document_title || 'N/A'}</TableCell>
                <TableCell>{new Date(training.creation_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default TrainingsPage;