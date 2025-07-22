import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Container,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';

import { useRealtime } from '../contexts/RealtimeContext';
import RealtimeDashboard from './RealtimeDashboard';

interface EnhancedStudentDashboardProps {
  principal: Principal | null;
  identity: Identity | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const EnhancedStudentDashboard: React.FC<EnhancedStudentDashboardProps> = ({ 
  principal, 
  identity 
}) => {
  const { 
    isRealtimeConnected,
    authenticate,
    isLoading,
    error: realtimeError,
    unreadNotifications
  } = useRealtime();
  
  const [tabValue, setTabValue] = useState(0);

  // Auto-authenticate with realtime service when identity is available
  useEffect(() => {
    if (identity && !isRealtimeConnected) {
      authenticate(identity);
    }
  }, [identity, authenticate, isRealtimeConnected]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Enhanced Student Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Day 4: Backend Integration & Real-time Features - Competition Development
        </Typography>
      </Box>

      {realtimeError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Real-time Connection Error: {realtimeError}
        </Alert>
      )}

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Connection
              </Typography>
              <Typography 
                color={isRealtimeConnected ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {isRealtimeConnected ? '✓ Connected' : '✗ Disconnected'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Typography 
                color={unreadNotifications > 0 ? 'warning.main' : 'success.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {unreadNotifications} Unread
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Principal
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {principal?.toText() || 'Not authenticated'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" />
          <Tab label="Real-time Monitor" />
          <Tab label="Development Progress" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to the enhanced TrustChain Student Dashboard. This is Day 4 of our 
                competition development timeline, focusing on backend integration and real-time features.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Features implemented: Advanced blockchain service integration, WebSocket real-time 
                communication, React context for state management, and live monitoring dashboard.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <RealtimeDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                5-Day Development Timeline Progress
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
                  ✅ Day 1: AI-Powered Security & Advanced Features (Completed)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  - Advanced fraud detection system
                  - AI-powered verification algorithms
                  - Machine learning risk assessment
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
                  ✅ Day 2: Enhanced UI/UX & Visual Excellence (Completed)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  - Beautiful Material-UI components
                  - Advanced animations and transitions
                  - Comprehensive visual design system
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
                  ✅ Day 3: Mobile PWA & Performance Optimization (Completed)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  - Progressive Web App features
                  - Mobile-first responsive design
                  - Performance monitoring and optimization
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  🔄 Day 4: Backend Integration & Real-time Features (In Progress)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  - Enhanced Internet Computer blockchain service
                  - WebSocket real-time communication system
                  - React context for global state management
                  - Live monitoring dashboard with connection status
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  ⏳ Day 5: Final Polish & Demo Preparation (Upcoming)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  - Final testing and bug fixes
                  - Competition presentation materials
                  - Performance optimization
                  - Demo preparation
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

// Default export for compatibility
export default EnhancedStudentDashboard;
