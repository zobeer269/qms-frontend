// src/pages/TrainingDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Typography, Paper, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';

function TrainingDetailPage() {
  const [training, setTraining] = useState(null);
  const [records, setRecords] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const trainingPromise = apiClient.get(`/training/courses/${id}/`);
    const recordsPromise = apiClient.get(`/training/records/?training=${id}`);

    Promise.all([trainingPromise, recordsPromise])
      .then(([trainingResponse, recordsResponse]) => {
        setTraining(trainingResponse.data);
        const recordsData = recordsResponse.data.results || recordsResponse.data;
        setRecords(Array.isArray(recordsData) ? recordsData : []);
      })
      .catch(err => console.error("Error fetching details:", err));
  }, [id]);

  if (!training) return <div>Loading...</div>;

  return (
    <Paper elevation={3} style={{ padding: '24px' }}>
      <Link to="/trainings">← Back to All Trainings</Link>
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>{training.title}</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>{training.description}</Typography>
      <Divider sx={{ my: 2 }}/>
      <Typography variant="h6">Assigned Trainees</Typography>
      <List>
        {records.length > 0 ? records.map(record => (
          <ListItem key={record.id}>
            <ListItemText 
              primary={record.trainee_username}
              secondary={`Due: ${record.due_date}`}
            />
            <Chip label={record.status_display} color={record.status === 'COMPLETED' ? 'success' : 'default'} />
          </ListItem>
        )) : <ListItem><ListItemText primary="No trainees assigned to this course yet." /></ListItem>}
      </List>
    </Paper>
  );
}
export default TrainingDetailPage;