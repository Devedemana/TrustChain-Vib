// Advanced Analytics and Mobile Optimization - Phase 6 Implementation
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Drawer,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Divider,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Insights as InsightsIcon,
  Smartphone as SmartphoneIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  VerifiedUser as VerifiedUserIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface AdvancedAnalyticsProps {
  organizationId: string;
  isMobile?: boolean;
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: number;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  benchmark: number;
}

interface MobileConfig {
  layout: 'compact' | 'standard' | 'expanded';
  swipeEnabled: boolean;
  voiceEnabled: boolean;
  offlineMode: boolean;
  pushNotifications: boolean;
  biometricAuth: boolean;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsProps> = ({
  organizationId,
  isMobile = false
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const actualIsMobile = isMobile || isSmallScreen;

  // State management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [mobileConfig, setMobileConfig] = useState<MobileConfig>({
    layout: 'compact',
    swipeEnabled: true,
    voiceEnabled: false,
    offlineMode: false,
    pushNotifications: true,
    biometricAuth: false
  });

  // Data states
  const [verificationTrends, setVerificationTrends] = useState<any[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<any[]>([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<any[]>([]);
  const [crossBoardAnalytics, setCrossBoardAnalytics] = useState<any[]>([]);

  useEffect(() => {
    loadAdvancedAnalytics();
  }, [organizationId, selectedTimeframe]);

  const loadAdvancedAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate loading advanced analytics data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock data for demo
      generateMockAnalyticsData();
      generateAIInsights();
      generatePerformanceMetrics();
      
      showSnackbar('Analytics data loaded successfully');
    } catch (error) {
      showSnackbar('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalyticsData = () => {
    // Verification trends
    const verificationData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      verifications: Math.floor(Math.random() * 200) + 50,
      successful: Math.floor(Math.random() * 180) + 40,
      failed: Math.floor(Math.random() * 20) + 5,
      crossVerifications: Math.floor(Math.random() * 50) + 10
    }));
    setVerificationTrends(verificationData);

    // Security metrics
    const securityData = [
      { category: 'Authentication', score: 95, incidents: 2 },
      { category: 'Data Integrity', score: 98, incidents: 0 },
      { category: 'Access Control', score: 92, incidents: 1 },
      { category: 'Encryption', score: 100, incidents: 0 },
      { category: 'Monitoring', score: 88, incidents: 3 }
    ];
    setSecurityMetrics(securityData);

    // Predictive analytics
    const predictiveData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted: Math.floor(Math.random() * 300) + 100,
      confidence: Math.random() * 0.3 + 0.7,
      lower: Math.floor(Math.random() * 250) + 80,
      upper: Math.floor(Math.random() * 350) + 120
    }));
    setPredictiveAnalytics(predictiveData);

    // Cross-board analytics
    const crossBoardData = [
      { board: 'Education', verifications: 1245, accuracy: 96.8, avgTime: 1.2 },
      { board: 'Employment', verifications: 892, accuracy: 94.5, avgTime: 2.1 },
      { board: 'Identity', verifications: 1567, accuracy: 98.2, avgTime: 0.8 },
      { board: 'Financial', verifications: 634, accuracy: 97.1, avgTime: 1.8 },
      { board: 'Healthcare', verifications: 423, accuracy: 99.1, avgTime: 2.5 }
    ];
    setCrossBoardAnalytics(crossBoardData);
  };

  const generateAIInsights = () => {
    const insights: AIInsight[] = [
      {
        id: '1',
        type: 'trend',
        title: 'Verification Volume Spike',
        description: 'Cross-verification requests increased by 34% this week, indicating growing trust network adoption.',
        confidence: 92,
        impact: 'high',
        actionable: true,
        timestamp: Date.now()
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Unusual Response Time Pattern',
        description: 'Education board showing 15% slower response times during peak hours. Consider scaling.',
        confidence: 87,
        impact: 'medium',
        actionable: true,
        timestamp: Date.now() - 3600000
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Weekend Traffic Forecast',
        description: 'Predicted 45% increase in verification requests this weekend based on historical patterns.',
        confidence: 78,
        impact: 'medium',
        actionable: false,
        timestamp: Date.now() - 7200000
      }
    ];
    setAiInsights(insights);
  };

  const generatePerformanceMetrics = () => {
    const metrics: PerformanceMetric[] = [
      {
        metric: 'Average Response Time',
        value: 245,
        unit: 'ms',
        trend: 'down',
        change: -12.3,
        benchmark: 300
      },
      {
        metric: 'Success Rate',
        value: 98.7,
        unit: '%',
        trend: 'up',
        change: 2.1,
        benchmark: 95
      },
      {
        metric: 'Throughput',
        value: 1847,
        unit: 'req/min',
        trend: 'up',
        change: 15.6,
        benchmark: 1500
      },
      {
        metric: 'Error Rate',
        value: 0.8,
        unit: '%',
        trend: 'down',
        change: -25.4,
        benchmark: 2
      }
    ];
    setPerformanceMetrics(metrics);
  };

  const handleExportData = () => {
    showSnackbar('Exporting analytics data...');
    setTimeout(() => {
      showSnackbar('Data exported successfully');
    }, 2000);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const renderMobileLayout = () => (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Analytics
          </Typography>
          <Badge badgeContent={aiInsights.length} color="error">
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Badge>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 2, pb: 8 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card sx={{ minHeight: 120 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <VerifiedUserIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
                <Typography variant="h5" component="div">
                  98.7%
                </Typography>
                <Typography variant="caption" color="success.main">
                  +2.1%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ minHeight: 120 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Avg Response
                  </Typography>
                </Box>
                <Typography variant="h5" component="div">
                  245ms
                </Typography>
                <Typography variant="caption" color="success.main">
                  -12.3%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Verification Trends
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={verificationTrends.slice(-7)}>
                    <XAxis dataKey="date" tickFormatter={(value: any) => new Date(value).getDate().toString()} />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="verifications" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Insights
                </Typography>
                {aiInsights.slice(0, 2).map((insight) => (
                  <Box key={insight.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InsightsIcon 
                        color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'success'} 
                        sx={{ mr: 1, fontSize: 16 }} 
                      />
                      <Typography variant="subtitle2">
                        {insight.title}
                      </Typography>
                      <Chip 
                        label={`${insight.confidence}%`} 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 'auto' }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {insight.description}
                    </Typography>
                    {insight.actionable && (
                      <Button size="small" sx={{ mt: 1 }}>
                        Take Action
                      </Button>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Floating Action Button */}
      <SpeedDial
        ariaLabel="Analytics Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<SearchIcon />}
          tooltipTitle="Search"
          onClick={() => showSnackbar('Search functionality')}
        />
        <SpeedDialAction
          icon={<DownloadIcon />}
          tooltipTitle="Export"
          onClick={handleExportData}
        />
        <SpeedDialAction
          icon={<SettingsIcon />}
          tooltipTitle="Settings"
          onClick={() => setDrawerOpen(true)}
        />
      </SpeedDial>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            <ListItem>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem>
              <ListItemIcon><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem>
              <ListItemIcon><SecurityIcon /></ListItemIcon>
              <ListItemText primary="Security" />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Mobile Settings
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Voice Commands</Typography>
              <Switch
                checked={mobileConfig.voiceEnabled}
                onChange={(e) => setMobileConfig({ ...mobileConfig, voiceEnabled: e.target.checked })}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Push Notifications</Typography>
              <Switch
                checked={mobileConfig.pushNotifications}
                onChange={(e) => setMobileConfig({ ...mobileConfig, pushNotifications: e.target.checked })}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Offline Mode</Typography>
              <Switch
                checked={mobileConfig.offlineMode}
                onChange={(e) => setMobileConfig({ ...mobileConfig, offlineMode: e.target.checked })}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );

  const renderDesktopLayout = () => (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Desktop Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Advanced Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <MenuItem value="7d">7 Days</MenuItem>
              <MenuItem value="30d">30 Days</MenuItem>
              <MenuItem value="90d">90 Days</MenuItem>
              <MenuItem value="1y">1 Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                {performanceMetrics.map((metric) => (
                  <Grid item xs={12} sm={6} md={3} key={metric.metric}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {metric.metric}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {metric.value}{metric.unit}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        {metric.trend === 'up' ? (
                          <TrendingUpIcon color="success" fontSize="small" />
                        ) : metric.trend === 'down' ? (
                          <TrendingDownIcon color="error" fontSize="small" />
                        ) : null}
                        <Typography 
                          variant="caption" 
                          color={metric.trend === 'up' ? 'success.main' : metric.trend === 'down' ? 'error.main' : 'text.secondary'}
                          sx={{ ml: 0.5 }}
                        >
                          {Math.abs(metric.change)}%
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Verification Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Verification Trends Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={verificationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="verifications" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Bar dataKey="crossVerifications" fill="#82ca9d" />
                  <Line type="monotone" dataKey="successful" stroke="#ff7300" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI-Powered Insights
              </Typography>
              <List>
                {aiInsights.map((insight) => (
                  <ListItem key={insight.id} divider>
                    <ListItemIcon>
                      <InsightsIcon 
                        color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'success'} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={insight.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {insight.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip 
                              label={`${insight.confidence}% confidence`} 
                              size="small" 
                              color="primary" 
                            />
                            <Chip 
                              label={insight.type} 
                              size="small" 
                              variant="outlined" 
                            />
                          </Box>
                        </Box>
                      }
                    />
                    {insight.actionable && (
                      <IconButton edge="end" size="small">
                        <AssessmentIcon />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Posture Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={securityMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Security Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Cross-Board Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cross-Board Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={crossBoardAnalytics}>
                  <CartesianGrid />
                  <XAxis dataKey="verifications" name="Verifications" />
                  <YAxis dataKey="accuracy" name="Accuracy" domain={[90, 100]} />
                  <ZAxis dataKey="avgTime" range={[50, 200]} name="Avg Time" />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any, name: any) => [
                      name === 'Accuracy' ? `${value}%` : 
                      name === 'Avg Time' ? `${value}s` : value,
                      name
                    ]}
                  />
                  <Scatter data={crossBoardAnalytics} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Predictive Analytics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predictive Analytics & Forecasting
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={predictiveAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {actualIsMobile ? renderMobileLayout() : renderDesktopLayout()}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedAnalyticsDashboard;
