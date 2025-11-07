import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Inventory as MaterialsIcon,
  Assignment as OrdersIcon,
  AutoFixHigh as OptimizationIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Materials',
      value: '0',
      icon: <MaterialsIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Active Orders',
      value: '0',
      icon: <OrdersIcon fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Optimizations',
      value: '0',
      icon: <OptimizationIcon fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Efficiency',
      value: '0%',
      icon: <TrendingIcon fontSize="large" />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to MaxiCortes - Material Cutting Optimization System
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start by adding materials to your inventory or creating a new cutting
          order.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;