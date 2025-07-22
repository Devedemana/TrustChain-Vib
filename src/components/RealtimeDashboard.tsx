import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  LinearProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Group as GroupIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import {
  useCredentialUpdates,
  useFraudAlerts,
  useVerificationUpdates,
  useNetworkStats,
  useConnectionStatus,
  useRealtimeNotifications
} from '../hooks/useRealtime';

interface RealtimeDashboardProps {
  principalId?: string;
  compactMode?: boolean;
}

const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({
  principalId,
  compactMode = false
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time hooks
  const { updates: credentialUpdates, latestUpdate } = useCredentialUpdates();
  const { alerts, unreadCount: alertCount, markAsRead } = useFraudAlerts();
  const { verifications, pendingVerifications } = useVerificationUpdates();
  const { stats: networkStats } = useNetworkStats();
  const { isConnected, stats: connectionStats, reconnectCount } = useConnectionStatus();
  const { notifications, unreadCount: notificationCount, markAsRead: markNotificationRead } = useRealtimeNotifications();

  // Connection status indicator
  const getConnectionStatus = () => {
    if (!isConnected) {
      return { 
        color: 'error' as const, 
        icon: <DisconnectedIcon />, 
        text: 'Disconnected',
        latency: null
      };
    }
    
    const latency = connectionStats.latency || 0;
    if (latency < 100) {
      return { 
        color: 'success' as const, 
        icon: <ConnectedIcon />, 
        text: 'Excellent',
        latency 
      };
    } else if (latency < 300) {
      return { 
        color: 'warning' as const, 
        icon: <ConnectedIcon />, 
        text: 'Good',
        latency 
      };
    } else {
      return { 
        color: 'error' as const, 
        icon: <ConnectedIcon />, 
        text: 'Slow',
        latency 
      };
    }
  };

  const connectionStatus = getConnectionStatus();

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get priority color for events
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (compactMode) {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Connection Status */}
          <Grid item>
            <Tooltip title={`Connection: ${connectionStatus.text} ${connectionStatus.latency ? `(${connectionStatus.latency}ms)` : ''}`}>
              <Chip
                icon={connectionStatus.icon}
                label={connectionStatus.text}
                color={connectionStatus.color}
                size="small"
              />
            </Tooltip>
          </Grid>

          {/* Notifications */}
          <Grid item>
            <Badge badgeContent={notificationCount} color="error">
              <IconButton size="small">
                <NotificationIcon />
              </IconButton>
            </Badge>
          </Grid>

          {/* Fraud Alerts */}
          <Grid item>
            <Badge badgeContent={alertCount} color="error">
              <IconButton size="small">
                <SecurityIcon />
              </IconButton>
            </Badge>
          </Grid>

          {/* Pending Verifications */}
          <Grid item>
            <Badge badgeContent={pendingVerifications.length} color="primary">
              <IconButton size="small">
                <VerifiedIcon />
              </IconButton>
            </Badge>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Real-time Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Connection Status */}
          <Tooltip title={`${connectionStatus.text} ${connectionStatus.latency ? `- ${connectionStatus.latency}ms latency` : ''}`}>
            <Chip
              icon={connectionStatus.icon}
              label={`${connectionStatus.text}${connectionStatus.latency ? ` (${connectionStatus.latency}ms)` : ''}`}
              color={connectionStatus.color}
              variant="outlined"
            />
          </Tooltip>

          <IconButton onClick={() => window.location.reload()}>
            <RefreshIcon />
          </IconButton>
          
          <IconButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Connection Quality Alert */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Real-time connection lost. Attempting to reconnect... (Attempt {reconnectCount})
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Network Statistics */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Network</Typography>
              </Box>
              
              {networkStats ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Credentials
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {formatNumber(networkStats.totalCredentials || 0)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Verifications Today
                  </Typography>
                  <Typography variant="h6">
                    {formatNumber(networkStats.verificationsToday || 0)}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Network Health
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={networkStats.networkHealth || 0} 
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption">
                      {networkStats.networkHealth || 0}%
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading network statistics...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Credential Updates */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Credentials</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Recent Updates
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {credentialUpdates.length}
              </Typography>
              
              {latestUpdate && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Latest Update
                  </Typography>
                  <Typography variant="caption">
                    {formatDistanceToNow(new Date(latestUpdate.timestamp))} ago
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Security Alerts */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Security</Typography>
                {alertCount > 0 && (
                  <Badge badgeContent={alertCount} color="error" sx={{ ml: 1 }} />
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Active Alerts
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, color: alertCount > 0 ? 'warning.main' : 'text.primary' }}>
                {alertCount}
              </Typography>
              
              {alerts.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Latest Alert
                  </Typography>
                  <Typography variant="caption">
                    {formatDistanceToNow(new Date(alerts[0].timestamp))} ago
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Verifications */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Verifications</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {verifications.length}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
              <Typography variant="h6" color="warning.main">
                {pendingVerifications.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Real-time Activity Feed */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Live Activity Feed
              </Typography>
              
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {notifications.slice(0, 20).map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ 
                          bgcolor: `${getPriorityColor(notification.priority)}.main`,
                          width: 32, 
                          height: 32 
                        }}>
                          {notification.type === 'credential_update' && <VerifiedIcon fontSize="small" />}
                          {notification.type === 'fraud_alert' && <WarningIcon fontSize="small" />}
                          {notification.type === 'verification_complete' && <CheckIcon fontSize="small" />}
                          {notification.type === 'multisig_update' && <GroupIcon fontSize="small" />}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {notification.data?.title || 'Update'}
                            </Typography>
                            <Chip 
                              label={notification.priority} 
                              size="small" 
                              color={getPriorityColor(notification.priority)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.data?.message || 'No additional details'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDistanceToNow(new Date(notification.timestamp))} ago
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                
                {notifications.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="No recent activity"
                      secondary="Real-time updates will appear here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<NotificationIcon />}
                  onClick={() => markNotificationRead()}
                  disabled={notificationCount === 0}
                >
                  Mark All as Read ({notificationCount})
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  onClick={() => markAsRead()}
                  disabled={alertCount === 0}
                  color="warning"
                >
                  Clear Security Alerts ({alertCount})
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<SpeedIcon />}
                  onClick={() => window.location.reload()}
                >
                  Refresh Dashboard
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Connection Stats
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  Messages Received: {connectionStats.messagesReceived}
                </Typography>
                <Typography variant="body2">
                  Messages Sent: {connectionStats.messagesSent}
                </Typography>
                <Typography variant="body2">
                  Reconnections: {reconnectCount}
                </Typography>
                {connectionStats.lastConnected && (
                  <Typography variant="body2">
                    Last Connected: {formatDistanceToNow(new Date(connectionStats.lastConnected))} ago
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Real-time Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              }
              label="Enable Browser Notifications"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto-refresh Data"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RealtimeDashboard;
