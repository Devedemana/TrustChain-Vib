import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Timeline,
  Security,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Info,
  School,
  VerifiedUser,
  Analytics,
  Refresh,
  Download,
  FilterList
} from '@mui/icons-material';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';

import { AnalyticsData, FraudDetectionResult, InstitutionMetrics, AuditEvent } from '../types/advanced';
import { fraudDetectionService } from '../services/fraudDetection';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface AdvancedAnalyticsDashboardProps {
  userId?: string;
  userRole: 'student' | 'institution' | 'admin';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  userId,
  userRole
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [fraudAlerts, setFraudAlerts] = useState<FraudDetectionResult[]>([]);
  const [institutionMetrics, setInstitutionMetrics] = useState<InstitutionMetrics[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [userId, userRole]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate loading analytics data
      // In production, this would call your analytics service
      const mockData: AnalyticsData = {
        credentialsIssued: {
          data: generateTimeSeriesData(30),
          trend: 'increasing',
          growthRate: 15.5
        },
        verificationRequests: {
          data: generateTimeSeriesData(30),
          trend: 'increasing',
          growthRate: 22.3
        },
        fraudAttempts: {
          data: generateTimeSeriesData(30, 0.1),
          trend: 'decreasing',
          growthRate: -8.2
        },
        userGrowth: {
          data: generateTimeSeriesData(30),
          trend: 'increasing',
          growthRate: 12.8
        },
        institutionGrowth: {
          data: generateTimeSeriesData(30, 0.3),
          trend: 'stable',
          growthRate: 2.1
        },
        networkHealth: {
          totalUsers: 15420,
          activeUsers: 8930,
          totalInstitutions: 156,
          totalCredentials: 45680,
          averageVerificationTime: 2.3,
          systemUptime: 99.8
        }
      };

      setAnalyticsData(mockData);

      // Load fraud detection results
      const mockFraudResults = await generateMockFraudResults();
      setFraudAlerts(mockFraudResults);

      // Load institution metrics
      const mockInstitutionMetrics = generateMockInstitutionMetrics();
      setInstitutionMetrics(mockInstitutionMetrics);

      // Load audit events
      const mockAuditEvents = generateMockAuditEvents();
      setAuditEvents(mockAuditEvents);

    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  // Generate mock time series data
  const generateTimeSeriesData = (days: number, multiplier = 1) => {
    const data = [];
    const now = Date.now();
    
    for (let i = days - 1; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const baseValue = Math.floor(Math.random() * 100 * multiplier) + 10;
      data.push({ timestamp, value: baseValue });
    }
    
    return data;
  };

  // Generate mock fraud detection results
  const generateMockFraudResults = async (): Promise<FraudDetectionResult[]> => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push({
        riskScore: Math.floor(Math.random() * 100),
        riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        flags: [
          {
            type: 'suspicious_timing' as any,
            description: 'Credential issued outside business hours',
            severity: 'warning' as any
          }
        ],
        confidence: Math.random(),
        recommendations: ['Review manually', 'Contact institution']
      });
    }
    return results;
  };

  // Generate mock institution metrics
  const generateMockInstitutionMetrics = (): InstitutionMetrics[] => {
    const institutions = ['MIT', 'Stanford', 'Harvard', 'Oxford', 'Cambridge'];
    return institutions.map(name => ({
      institutionId: name.toLowerCase(),
      credentialsIssued: Math.floor(Math.random() * 1000) + 100,
      verificationRequests: Math.floor(Math.random() * 500) + 50,
      fraudAttempts: Math.floor(Math.random() * 10),
      reputationScore: Math.floor(Math.random() * 40) + 60,
      trustLevel: ['bronze', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)] as any,
      accreditations: ['ISO 27001', 'FERPA Compliant']
    }));
  };

  // Generate mock audit events
  const generateMockAuditEvents = (): AuditEvent[] => {
    const actions = ['credential_issued', 'credential_verified', 'user_login', 'institution_registered'];
    const outcomes = ['success', 'failure'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `audit_${i}`,
      timestamp: Date.now() - (i * 60 * 60 * 1000),
      actor: `user_${i}`,
      action: actions[Math.floor(Math.random() * actions.length)],
      resourceId: `resource_${i}`,
      resourceType: 'credential',
      outcome: outcomes[Math.floor(Math.random() * outcomes.length)] as any,
      metadata: {},
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0'
    }));
  };

  // Chart configurations
  const credentialTrendChart = useMemo(() => {
    if (!analyticsData) return null;

    return {
      data: {
        labels: analyticsData.credentialsIssued.data.map(d => 
          new Date(d.timestamp).toLocaleDateString()
        ),
        datasets: [
          {
            label: 'Credentials Issued',
            data: analyticsData.credentialsIssued.data.map(d => d.value),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          },
          {
            label: 'Verification Requests',
            data: analyticsData.verificationRequests.data.map(d => d.value),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' as const },
          title: { display: true, text: 'Credential Activity Trends' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    };
  }, [analyticsData]);

  const riskDistributionChart = useMemo(() => {
    const riskLevels = fraudAlerts.reduce((acc, alert) => {
      acc[alert.riskLevel] = (acc[alert.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: {
        labels: Object.keys(riskLevels),
        datasets: [{
          data: Object.values(riskLevels),
          backgroundColor: [
            '#4CAF50', // Low - Green
            '#FF9800', // Medium - Orange  
            '#F44336', // High - Red
            '#9C27B0'  // Critical - Purple
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' as const },
          title: { display: true, text: 'Risk Level Distribution' }
        }
      }
    };
  }, [fraudAlerts]);

  const institutionTrustChart = useMemo(() => {
    return {
      data: {
        labels: institutionMetrics.map(inst => inst.institutionId),
        datasets: [{
          label: 'Reputation Score',
          data: institutionMetrics.map(inst => inst.reputationScore),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Institution Reputation Scores' }
        },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    };
  }, [institutionMetrics]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Advanced Analytics Dashboard
        </Typography>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading analytics data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
          Advanced Analytics Dashboard
        </Typography>
        
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Report">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter Options">
            <IconButton>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* System Health Overview */}
      {analyticsData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <School color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Credentials</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {analyticsData.networkHealth.totalCredentials.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  +{analyticsData.credentialsIssued.growthRate}% this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedUser color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Users</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {analyticsData.networkHealth.activeUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {((analyticsData.networkHealth.activeUsers / analyticsData.networkHealth.totalUsers) * 100).toFixed(1)}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">System Uptime</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {analyticsData.networkHealth.systemUptime}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={analyticsData.networkHealth.systemUptime}
                  color={analyticsData.networkHealth.systemUptime > 99 ? 'success' : 'warning'}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Verification</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {analyticsData.networkHealth.averageVerificationTime}s
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Response time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabbed Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Activity Trends" />
          <Tab label="Security Analysis" />
          <Tab label="Institution Metrics" />
          <Tab label="Audit Trail" />
        </Tabs>
      </Box>

      {/* Activity Trends Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                {credentialTrendChart && <Line {...credentialTrendChart} />}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Growth Metrics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Credential Issuance"
                      secondary={`+${analyticsData?.credentialsIssued.growthRate}%`}
                    />
                    <Chip 
                      label={analyticsData?.credentialsIssued.trend} 
                      color="success" 
                      size="small" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Verification Requests"
                      secondary={`+${analyticsData?.verificationRequests.growthRate}%`}
                    />
                    <Chip 
                      label={analyticsData?.verificationRequests.trend} 
                      color="success" 
                      size="small" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="User Growth"
                      secondary={`+${analyticsData?.userGrowth.growthRate}%`}
                    />
                    <Chip 
                      label={analyticsData?.userGrowth.trend} 
                      color="info" 
                      size="small" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Security Analysis Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                {riskDistributionChart && <Doughnut {...riskDistributionChart} />}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Security Alerts
                </Typography>
                {fraudAlerts.slice(0, 5).map((alert, index) => (
                  <Alert 
                    key={index}
                    severity={alert.riskLevel === 'critical' ? 'error' : alert.riskLevel === 'high' ? 'warning' : 'info'}
                    sx={{ mb: 1 }}
                  >
                    <strong>Risk Score: {alert.riskScore}</strong>
                    <br />
                    {alert.flags[0]?.description || 'No specific details'}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Institution Metrics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {institutionTrustChart && <Bar {...institutionTrustChart} />}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Institution Performance
                </Typography>
                <List>
                  {institutionMetrics.map((inst, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <School />
                      </ListItemIcon>
                      <ListItemText
                        primary={inst.institutionId.toUpperCase()}
                        secondary={`${inst.credentialsIssued} credentials • ${inst.verificationRequests} verifications`}
                      />
                      <Chip 
                        label={inst.trustLevel} 
                        color={
                          inst.trustLevel === 'platinum' ? 'success' :
                          inst.trustLevel === 'gold' ? 'warning' : 'default'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Audit Trail Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Audit Events
            </Typography>
            <List>
              {auditEvents.slice(0, 10).map((event, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {event.outcome === 'success' ? 
                      <CheckCircle color="success" /> : 
                      <Error color="error" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={event.action.replace('_', ' ').toUpperCase()}
                    secondary={`${event.actor} • ${new Date(event.timestamp).toLocaleString()}`}
                  />
                  <Chip 
                    label={event.outcome} 
                    color={event.outcome === 'success' ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};
