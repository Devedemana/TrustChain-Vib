import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountTree as BridgeIcon,
  Business as OrgIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

// Import your components
import { TrustBridgesPage } from './TrustBridgesPage';
import { ProductionBackendDemo } from './ProductionBackendDemo';
// import { OrganizationManagement } from './OrganizationManagement';
// import { AdvancedAnalyticsDashboard } from './AdvancedAnalyticsDashboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`universal-tabpanel-${index}`}
      aria-labelledby={`universal-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `universal-tab-${index}`,
    'aria-controls': `universal-tabpanel-${index}`,
  };
}

export const UniversalTrustDashboard: React.FC = () => {
  const [value, setValue] = useState(0);

  // Mock user context - in a real app, this would come from authentication
  const currentUser = {
    id: 'user-001',
    name: 'Universal Admin',
    email: 'admin@universal.trustchain.io',
    role: 'admin' as const,
    organizationId: 'universal-org-001'
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Overview', icon: <DashboardIcon />, color: '#1976d2' },
    { label: 'TrustBridges', icon: <BridgeIcon />, color: '#7b1fa2' },
    { label: 'Organizations', icon: <OrgIcon />, color: '#388e3c' },
    { label: 'Analytics', icon: <AnalyticsIcon />, color: '#f57c00' },
    { label: 'Security', icon: <SecurityIcon />, color: '#d32f2f' },
    { label: 'Settings', icon: <SettingsIcon />, color: '#5d4037' },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🌐 TrustChain Universal
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {currentUser.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </Typography>
            </Box>
            
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="User Profile">
              <IconButton>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {currentUser.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Logout">
              <IconButton>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={
                <Box sx={{ color: value === index ? tab.color : 'text.secondary' }}>
                  {tab.icon}
                </Box>
              }
              iconPosition="start"
              label={tab.label}
              sx={{
                color: value === index ? tab.color : 'text.secondary',
                '&.Mui-selected': {
                  color: tab.color,
                  bgcolor: `${tab.color}08`,
                },
              }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={value} index={0}>
        <ProductionBackendDemo />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TrustBridgesPage />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            🏢 Organizations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organization management features will be implemented here, including:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>Organization profile management</li>
            <li>User access and permissions</li>
            <li>TrustBoard administration</li>
            <li>Integration settings</li>
            <li>Compliance and audit trails</li>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            📊 Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced analytics features will be implemented here, including:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>Real-time verification metrics</li>
            <li>Performance analytics</li>
            <li>User activity tracking</li>
            <li>Custom reporting</li>
            <li>Data visualization</li>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            🔒 Security Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Security management features will be implemented here, including:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>Access control and permissions</li>
            <li>Security audit logs</li>
            <li>Threat detection and monitoring</li>
            <li>Compliance reporting</li>
            <li>Encryption key management</li>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={5}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            ⚙️ System Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            System configuration and settings will be implemented here, including:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>Global system preferences</li>
            <li>Integration configurations</li>
            <li>Notification settings</li>
            <li>User management</li>
            <li>System maintenance</li>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};
