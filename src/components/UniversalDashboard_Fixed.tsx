import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
  Tooltip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  CircularProgress,
  Container,
  Fade,
  Slide,
  Zoom,
  Grow,
  Collapse,
  Stack,
  Divider,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ViewList as TableIcon,
  Verified as VerifiedIcon,
  Analytics as AnalyticsIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  LocalHospital as HealthIcon,
  Home as RealEstateIcon,
  Gavel as GovernmentIcon,
  Category as OtherIcon,
  TrendingUp,
  VerifiedUser,
  Speed,
  Security,
  Rocket,
  AutoAwesome,
  Stars,
  FlashOn,
  TrendingUpRounded,
  WorkspacePremium,
  Shield,
  Public,
  AccountTree as Integration,
  Api,
  QrCode,
  CloudUpload,
  AutoGraph
} from '@mui/icons-material';
import { TrustBoardSchema, Organization, UniversalAnalytics } from '../types/universal';
import { UniversalTrustService } from '../services/universalTrust';
import TrustBoardCreator from './TrustBoardCreator';
import EnhancedDashboardContent from './EnhancedDashboardContent';

interface UniversalDashboardProps {
  organization: Organization;
  credentials: any[];
  profileCompleteness: number;
  credentialChartData: any;
  skillGrowthData: any;
  marketDemandData: any;
  careerInsights: any[];
  onShareToSocial: (platform: string) => void;
}

const UniversalDashboard: React.FC<UniversalDashboardProps> = ({
  organization,
  credentials,
  profileCompleteness,
  credentialChartData,
  skillGrowthData,
  marketDemandData,
  careerInsights,
  onShareToSocial
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [trustBoards, setTrustBoards] = useState<TrustBoardSchema[]>([]);
  const [analytics, setAnalytics] = useState<UniversalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<TrustBoardSchema | null>(null);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const universalService = UniversalTrustService.getInstance();

  const tabs = [
    { label: 'Command Center', icon: <DashboardIcon />, color: '#FF6B6B' },
    { label: 'TrustBoards', icon: <TableIcon />, color: '#4ECDC4' },
    { label: 'TrustGates', icon: <VerifiedIcon />, color: '#45B7D1' },
    { label: 'TrustBridge', icon: <Integration />, color: '#F7DC6F' },
    { label: 'Analytics', icon: <AnalyticsIcon />, color: '#BB8FCE' },
    { label: 'API & Widgets', icon: <Api />, color: '#85C1E9' }
  ];

  const categoryIcons: { [key: string]: React.ReactNode } = {
    education: <SchoolIcon />,
    employment: <BusinessIcon />,
    finance: <BankIcon />,
    healthcare: <HealthIcon />,
    'real-estate': <RealEstateIcon />,
    government: <GovernmentIcon />,
    other: <OtherIcon />
  };

  const quickActionCards = [
    {
      title: 'Create TrustBoard',
      description: 'Build your digital filing cabinet',
      icon: <TableIcon />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => setCreatorOpen(true),
      badge: 'Popular'
    },
    {
      title: 'Verify Instantly',
      description: 'Check any claim in seconds',
      icon: <VerifiedIcon />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => setActiveTab(2),
      badge: 'Fast'
    },
    {
      title: 'Generate API',
      description: 'Get verification endpoints',
      icon: <Api />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => setActiveTab(5),
      badge: 'New'
    },
    {
      title: 'Create Widget',
      description: 'Embed anywhere on the web',
      icon: <QrCode />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      action: () => setActiveTab(5),
      badge: 'Widget'
    }
  ];

  useEffect(() => {
    loadDashboardData();
    const timer = setTimeout(() => {
      setAnimationDelay(100);
    }, 300);
    return () => clearTimeout(timer);
  }, [organization.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const boardsResponse = await universalService.listTrustBoards(organization.id);
      if (boardsResponse.success && boardsResponse.data) {
        setTrustBoards(boardsResponse.data.items);
      }

      const analyticsResponse = await universalService.getUniversalAnalytics(
        organization.id,
        {
          from: Date.now() - (30 * 24 * 60 * 60 * 1000),
          to: Date.now()
        }
      );
      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardCreated = (board: TrustBoardSchema) => {
    setTrustBoards([...trustBoards, board]);
    setCreatorOpen(false);
  };

  const renderGumroadHeader = () => (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          px: 3,
          borderRadius: 3,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite'
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Zoom in={true} timeout={1200}>
                <Box>
                  <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ 
                    background: 'linear-gradient(45deg, #fff 30%, #f0f8ff 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}>
                    <AutoAwesome sx={{ mr: 2, fontSize: '2.5rem', verticalAlign: 'middle' }} />
                    TrustChain Universe
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
                    The "Shopify for Trust" - Build your verification empire
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip 
                      icon={<Rocket />} 
                      label="Upload Once, Verify Everywhere" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                      }} 
                    />
                    <Chip 
                      icon={<Shield />} 
                      label="Blockchain Secured" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                      }} 
                    />
                    <Chip 
                      icon={<FlashOn />} 
                      label="Instant Verification" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                      }} 
                    />
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={4}>
              <Slide direction="left" in={true} timeout={1500}>
                <Box sx={{ textAlign: 'center' }}>
                  <WorkspacePremium sx={{ fontSize: '8rem', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>
                    {organization.name}
                  </Typography>
                  <Chip 
                    label={organization.verified ? "Verified Organization" : "Setup Required"} 
                    color={organization.verified ? "success" : "warning"}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );

  const renderQuickActions = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
        textAlign: 'center', 
        mb: 3,
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        <Stars sx={{ mr: 1, verticalAlign: 'middle', color: '#667eea' }} />
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActionCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Grow in={true} timeout={1000 + index * 200}>
              <Card
                sx={{
                  height: '200px',
                  background: card.color,
                  color: 'white',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    '& .action-icon': {
                      transform: 'scale(1.2) rotate(5deg)'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'ripple 3s ease-in-out infinite'
                  }
                }}
                onClick={card.action}
              >
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar 
                        className="action-icon"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          width: 56, 
                          height: 56,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Badge 
                        badgeContent={card.badge} 
                        color="secondary"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#333',
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderOverview = () => (
    <Box>
      {renderGumroadHeader()}
      {renderQuickActions()}
      
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
        mb: 3,
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        <TrendingUpRounded sx={{ mr: 1, verticalAlign: 'middle', color: '#667eea' }} />
        Your Trust Empire
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1000 + animationDelay}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {analytics?.overview.totalTrustBoards || trustBoards.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      TrustBoards
                    </Typography>
                    <Chip 
                      size="small" 
                      label="+12% this month" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'bounce 2s ease-in-out infinite'
                  }}>
                    <TableIcon sx={{ fontSize: '2rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1200 + animationDelay}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(240, 147, 251, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {analytics?.overview.totalRecords || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Trust Records
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Blockchain Secured" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'bounce 2s ease-in-out infinite 0.5s'
                  }}>
                    <VerifiedUser sx={{ fontSize: '2rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1400 + animationDelay}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(79, 172, 254, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {analytics?.overview.totalVerifications || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Verifications
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Instant Results" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'bounce 2s ease-in-out infinite 1s'
                  }}>
                    <VerifiedIcon sx={{ fontSize: '2rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1600 + animationDelay}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(67, 233, 123, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {organization.trustScore || 95}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Trust Score
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Excellent" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'bounce 2s ease-in-out infinite 1.5s'
                  }}>
                    <Stars sx={{ fontSize: '2rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTrustBoards = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            <TableIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Your TrustBoards
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Digital filing cabinets that make your data tamper-proof on the blockchain
          </Typography>
        </Box>
        <Zoom in={true} timeout={1500}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setCreatorOpen(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              px: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.05)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}
          >
            Create TrustBoard
          </Button>
        </Zoom>
      </Box>

      {trustBoards.length === 0 ? (
        <Fade in={true} timeout={1000}>
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 4
          }}>
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <TableIcon sx={{ fontSize: '4rem' }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              No TrustBoards Created Yet
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              TrustBoards are like Google Sheets, but blockchain-secured forever.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setCreatorOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderRadius: 3
              }}
            >
              Create Your First TrustBoard
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {trustBoards.map((board: TrustBoardSchema, index: number) => (
            <Grid item xs={12} md={6} lg={4} key={board.id}>
              <Grow in={true} timeout={800 + index * 150}>
                <Card sx={{ 
                  height: '320px',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {categoryIcons[board.category]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {board.name}
                        </Typography>
                        <Chip label={board.category} size="small" />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                      {board.description}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {board.fields.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fields
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color="success.main">
                            {board.recordCount || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Records
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color="info.main">
                            {board.verificationCount || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Verifications
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button size="small" variant="outlined" fullWidth>
                        Manage Data
                      </Button>
                      <Button size="small" variant="contained" fullWidth>
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderTrustGates = () => (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        TrustGates - Instant Verification
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        TrustGates provide instant Yes/No verification for any claim. Coming soon!
      </Alert>
    </Box>
  );

  const renderTrustBridge = () => (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        TrustBridge - Cross Verification
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        TrustBridge enables complex verification across multiple TrustBoards. Coming soon!
      </Alert>
    </Box>
  );

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Universal Analytics
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Advanced analytics dashboard coming soon!
      </Alert>
    </Box>
  );

  const renderAPIWidgets = () => (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        API & Widgets
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        API access and embeddable widgets coming soon!
      </Alert>
    </Box>
  );

  const renderLegacyDashboard = () => (
    <EnhancedDashboardContent
      credentials={credentials}
      profileCompleteness={profileCompleteness}
      credentialChartData={credentialChartData}
      skillGrowthData={skillGrowthData}
      marketDemandData={marketDemandData}
      careerInsights={careerInsights}
      onShareToSocial={onShareToSocial}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes ripple {
            0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
            50% { transform: scale(1.1) rotate(180deg); opacity: 0.1; }
            100% { transform: scale(1) rotate(360deg); opacity: 0.3; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(2deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
        `}
      </style>

      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '3%',
        width: 200,
        height: 200,
        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: 150,
        height: 150,
        background: 'linear-gradient(45deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 3 }}>
          <Fade in timeout={800}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                mb: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden'
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(102, 126, 234, 0.8)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minHeight: 72,
                    px: 3,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      color: 'white',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px 12px 0 0',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                    },
                    '&:hover:not(.Mui-selected)': {
                      background: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-1px)'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none'
                  }
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tab.icon}
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {tab.label}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {index === 0 && 'Overview'}
                            {index === 1 && 'Digital Tables'}
                            {index === 2 && 'Yes/No Verification'}
                            {index === 3 && 'Cross-Verification'}
                            {index === 4 && 'Insights & Reports'}
                            {index === 5 && 'Embed & Share'}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    iconPosition="start"
                    sx={{ 
                      minHeight: 72,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textAlign: 'left'
                    }}
                  />
                ))}
              </Tabs>
            </Paper>
          </Fade>

          <Box sx={{ position: 'relative' }}>
            <Fade in={true} timeout={600} key={activeTab}>
              <Box>
                {activeTab === 0 && renderOverview()}
                {activeTab === 1 && renderTrustBoards()}
                {activeTab === 2 && renderTrustGates()}
                {activeTab === 3 && renderTrustBridge()}
                {activeTab === 4 && renderAnalytics()}
                {activeTab === 5 && renderAPIWidgets()}
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>

      <Zoom in={true} timeout={1500}>
        <Fab
          color="primary"
          aria-label="add"
          size="large"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.6)'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => setCreatorOpen(true)}
        >
          <AddIcon sx={{ fontSize: '2rem' }} />
        </Fab>
      </Zoom>

      <Dialog
        open={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }
        }}
      >
        <TrustBoardCreator
          organization={organization}
          onBoardCreated={handleBoardCreated}
          onClose={() => setCreatorOpen(false)}
          editBoard={selectedBoard || undefined}
        />
      </Dialog>
    </Box>
  );
};

export default UniversalDashboard;
