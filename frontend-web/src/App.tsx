import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Placeholder components - will be implemented in later phases
const Dashboard = () => <Box>Dashboard - Coming Soon</Box>;
const Materials = () => <Box>Materials - Coming Soon</Box>;
const Orders = () => <Box>Orders - Coming Soon</Box>;
const Optimization = () => <Box>Optimization - Coming Soon</Box>;

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/optimization" element={<Optimization />} />
      </Routes>
    </Box>
  );
}

export default App;