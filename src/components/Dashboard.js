// src/components/Dashboard.js

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axiosConfig.js';
import PieChart from './PieChart';
import BarChart from './BarChart';

// استيراد مكونات MUI الجديدة
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [ncrs, setNcrs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // ... منطق جلب البيانات يبقى كما هو تمامًا ...
    setError('');
    const fetchDashboardData = async () => {
      try {
        const [docsResponse, ncrResponse] = await Promise.all([
          apiClient.get('/documents/'),
          apiClient.get('/quality-events/')
        ]);
        setDocuments(docsResponse.data.results || docsResponse.data);
        setNcrs(ncrResponse.data.results || ncrResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("Could not load dashboard data.");
      }
    };
    if (localStorage.getItem('authToken')) {
      fetchDashboardData();
    }
  }, []);

  const kpis = useMemo(() => {
    // ... منطق حساب الـ KPIs يبقى كما هو تمامًا ...
    return {
      docsAwaitingReview: documents.filter(doc => doc.status === 'IN_REVIEW').length,
      openNcrs: ncrs.filter(ncr => ncr.status === 'OPEN').length,
      totalDocuments: documents.length,
      totalNcrs: ncrs.length,
    };
  }, [documents, ncrs]);
  
  const ncrPieChartData = useMemo(() => {
    // ... منطق الرسوم البيانية يبقى كما هو تمامًا ...
    if (!ncrs || ncrs.length === 0) return { labels: [], datasets: [] };
    const counts = ncrs.reduce((acc, ncr) => { acc[ncr.source_display] = (acc[ncr.source_display] || 0) + 1; return acc; }, {});
    return {
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts), backgroundColor: ['rgba(255, 99, 132, 0.5)','rgba(54, 162, 235, 0.5)','rgba(255, 206, 86, 0.5)','rgba(75, 192, 192, 0.5)'] }],
    };
  }, [ncrs]);

  const ncrBarChartData = useMemo(() => {
    if (!ncrs || ncrs.length === 0) return { labels: [], datasets: [] };
    const labels = []; const data = []; const now = new Date();
    for (let i = 17; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); labels.push(d.toLocaleString('en-US', { month: 'short', year: '2-digit' })); data.push(0); }
    ncrs.forEach(ncr => {
      const ncrDate = new Date(ncr.reported_at);
      for (let i = 17; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); const dNext = new Date(now.getFullYear(), now.getMonth() - i + 1, 1); if (ncrDate >= d && ncrDate < dNext) { data[17 - i]++; break; } }
    });
    return { labels: labels, datasets: [{ label: 'NCRs per Month', data: data, backgroundColor: 'rgba(54, 162, 235, 0.6)' }] };
  }, [ncrs]);

  // --- هذا هو الجزء الذي قمنا بتغييره بالكامل ---
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <hr />
      
      {error && <Typography color="error">{error}</Typography>}

      {/* Grid container لبطاقات الـ KPI */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>Open NCRs</Typography>
              <Typography variant="h3" component="div">{kpis.openNcrs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>Documents in Review</Typography>
              <Typography variant="h3" component="div">{kpis.docsAwaitingReview}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>Total Documents</Typography>
              <Typography variant="h3" component="div">{kpis.totalDocuments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>Total NCRs</Typography>
              <Typography variant="h3" component="div">{kpis.totalNcrs}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Grid container للرسوم البيانية */}
      <Grid container spacing={3} sx={{ mt: 4 }} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={5} sx={{height: '100%'}}>
          <Typography variant="h6" component="h3" align="center" gutterBottom>NCRs by Source</Typography>
          {ncrs.length > 0 ? <PieChart chartData={ncrPieChartData} /> : <p>No data</p>}
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" component="h3" align="center" gutterBottom>Monthly NCR Trend (Last 18 Months)</Typography>
          {ncrs.length > 0 ? <BarChart chartData={ncrBarChartData} /> : <p>No data</p>}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;