import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const productData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Products Sold',
        data: [150, 200, 180, 220, 300, 250],
        backgroundColor: '#1976d2',
      },
    ],
  };

  const inquiryData = {
    labels: ['Pending', 'Resolved', 'Archived'],
    datasets: [
      {
        label: 'Inquiries',
        data: [20, 45, 10],
        backgroundColor: ['#ff9800', '#4caf50', '#9e9e9e'],
      },
    ],
  };

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Furniture', 'Books'],
    datasets: [
      {
        label: 'Categories',
        data: [35, 25, 20, 15],
        backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc'],
      },
    ],
  };

  const notificationData = {
    labels: ['Unread', 'Read'],
    datasets: [
      {
        label: 'Notifications',
        data: [12, 8],
        backgroundColor: ['#f44336', '#4caf50'],
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Product Performance</Typography>
            <Bar data={productData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Inquiry Status</Typography>
            <Bar data={inquiryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Category Distribution</Typography>
            <Doughnut data={categoryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Notification Status</Typography>
            <Doughnut data={notificationData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4" color="primary">150</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">New Inquiries</Typography>
            <Typography variant="h4" color="secondary">45</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="h4" color="error">20</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;