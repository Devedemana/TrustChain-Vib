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
  const [boardDetailsOpen, setBoardDetailsOpen] = useState(false);
  const [boardDataOpen, setBoardDataOpen] = useState(false);

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

  const handleViewBoardDetails = (board: TrustBoardSchema) => {
    setSelectedBoard(board);
    setBoardDetailsOpen(true);
  };

  const handleManageBoardData = (board: TrustBoardSchema) => {
    setSelectedBoard(board);
    setBoardDataOpen(true);
  };

  const handleRefreshData = () => {
    loadDashboardData();
  };

  const handleShareToSocial = (platform: string, boardId?: string) => {
    const shareUrl = boardId 
      ? `${window.location.origin}/trustboard/${boardId}`
      : `${window.location.origin}/organization/${organization.id}`;
    
    const shareText = `Check out ${organization.name}'s verified credentials on TrustChain!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
        break;
    }
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
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      {renderGumroadHeader()}
      {renderQuickActions()}
      
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
        mb: 3,
        color: 'white',
        fontWeight: 800
      }}>
        <TrendingUpRounded sx={{ mr: 1, verticalAlign: 'middle', color: '#8A2BE2' }} />
        Your Trust Empire
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1000 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(138, 43, 226, 0.2)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(138, 43, 226, 0.2)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalTrustBoards || trustBoards.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      TrustBoards
                    </Typography>
                    <Chip 
                      size="small" 
                      label="+12% this month" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(138, 43, 226, 0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(138, 43, 226, 0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite'
                  }}>
                    <TableIcon sx={{ fontSize: '2rem', color: '#8A2BE2' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1200 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(30, 144, 255, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(30, 144, 255, 0.2)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalRecords || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Trust Records
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Blockchain Secured" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(30, 144, 255, 0.2)', 
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
                    bgcolor: 'rgba(30, 144, 255, 0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite'
                  }}>
                    <VerifiedIcon sx={{ fontSize: '2rem', color: '#1E90FF' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1400 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 20, 147, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(255, 20, 147, 0.2)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalRecords || 45}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      TrustGates
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Instant Results" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(255, 20, 147, 0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 20, 147, 0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite'
                  }}>
                    <VerifiedIcon sx={{ fontSize: '2rem', color: '#FF1493' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1600 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(50, 205, 50, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(50, 205, 50, 0.2)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {organization.trustScore || 95}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Trust Score
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Excellent" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(50, 205, 50, 0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(50, 205, 50, 0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite'
                  }}>
                    <Stars sx={{ fontSize: '2rem', color: '#32CD32' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderTrustBoards = () => (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(138, 43, 226, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(138, 43, 226, 0.2)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <TableIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#8A2BE2' }} />
            Your TrustBoards
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
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
                      <Button 
                        size="small" 
                        variant="outlined" 
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManageBoardData(board);
                        }}
                        sx={{
                          borderColor: 'rgba(138, 43, 226, 0.5)',
                          color: '#8A2BE2',
                          '&:hover': {
                            borderColor: '#8A2BE2',
                            background: 'rgba(138, 43, 226, 0.1)'
                          }
                        }}
                      >
                        Manage Data
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewBoardDetails(board);
                        }}
                        sx={{
                          background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                          }
                        }}
                      >
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
    </Paper>
  );

  const renderTrustGates = () => (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(30, 144, 255, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(30, 144, 255, 0.2)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <VerifiedIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#1E90FF' }} />
            TrustGates - Instant Verification
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Get instant Yes/No verification for any claim in seconds
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setActiveTab(1)}
          sx={{
            background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
            fontWeight: 'bold',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Create Gate
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(30, 144, 255, 0.2)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Instant Verification
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                Quick yes/no verification for simple claims
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{
                    borderColor: 'rgba(30, 144, 255, 0.5)',
                    color: '#1E90FF',
                    '&:hover': {
                      borderColor: '#1E90FF',
                      background: 'rgba(30, 144, 255, 0.1)'
                    }
                  }}
                >
                  Learn More
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)'
                    }
                  }}
                >
                  Try Demo
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(138, 43, 226, 0.2)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Batch Verification
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                Verify multiple claims at once with CSV upload
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    color: '#8A2BE2',
                    '&:hover': {
                      borderColor: '#8A2BE2',
                      background: 'rgba(138, 43, 226, 0.1)'
                    }
                  }}
                >
                  Download Template
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                    }
                  }}
                >
                  Upload CSV
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
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
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(187, 143, 206, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(187, 143, 206, 0.2)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <AnalyticsIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#BB8FCE' }} />
            Universal Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Deep insights into your trust ecosystem performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoGraph />}
          onClick={handleRefreshData}
          sx={{
            background: 'linear-gradient(45deg, #BB8FCE, #8A2BE2)',
            fontWeight: 'bold',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #8A2BE2, #BB8FCE)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {analytics ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(187, 143, 206, 0.2)',
              color: 'white',
              height: '280px'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  System Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#BB8FCE', fontWeight: 'bold' }}>
                        {analytics.overview.totalTrustBoards}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        TrustBoards
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#8A2BE2', fontWeight: 'bold' }}>
                        {analytics.overview.totalRecords}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Records
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1E90FF', fontWeight: 'bold' }}>
                        {analytics.overview.totalVerifications}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Verifications
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#32CD32', fontWeight: 'bold' }}>
                        {Math.round(analytics.performance.averageResponseTime)}ms
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Avg Response
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(30, 144, 255, 0.2)',
              color: 'white',
              height: '280px'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1E90FF', fontWeight: 'bold' }}>
                        {Math.round(analytics.trends.growthRate * 100)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Growth Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#32CD32', fontWeight: 'bold' }}>
                        {Math.round(analytics.overview.systemUptime)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Uptime
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#FF1493', fontWeight: 'bold' }}>
                        {Math.round(analytics.performance.errorRate * 100)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Error Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        {Math.round(analytics.trends.satisfactionScore)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Satisfaction
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ color: '#BB8FCE' }} />
          <Typography variant="h6" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
            Loading Analytics Data...
          </Typography>
        </Box>
      )}
    </Paper>
  );

  const renderAPIWidgets = () => (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(133, 193, 233, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(133, 193, 233, 0.2)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <Api sx={{ mr: 2, verticalAlign: 'middle', color: '#85C1E9' }} />
            API & Widgets
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Integrate verification anywhere with APIs and embeddable widgets
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<QrCode />}
          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/v1/verify`)}
          sx={{
            background: 'linear-gradient(45deg, #85C1E9, #1E90FF)',
            fontWeight: 'bold',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #1E90FF, #85C1E9)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Copy API URL
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(133, 193, 233, 0.2)',
            color: 'white',
            height: '320px'
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                REST API Access
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Integrate verification into your applications
              </Typography>
              
              <Box sx={{ mb: 3, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#85C1E9' }}>
                  POST /api/v1/verify
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {`{
  "boardId": "your-board-id",
  "claim": "John Doe graduated"
}`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={() => window.open(`${window.location.origin}/api/docs`, '_blank')}
                  sx={{
                    borderColor: 'rgba(133, 193, 233, 0.5)',
                    color: '#85C1E9',
                    '&:hover': {
                      borderColor: '#85C1E9',
                      background: 'rgba(133, 193, 233, 0.1)'
                    }
                  }}
                >
                  View Docs
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  fullWidth
                  onClick={() => navigator.clipboard.writeText('API_KEY_PLACEHOLDER')}
                  sx={{
                    background: 'linear-gradient(45deg, #85C1E9, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #85C1E9)'
                    }
                  }}
                >
                  Get API Key
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(138, 43, 226, 0.2)',
            color: 'white',
            height: '320px'
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Embeddable Widgets
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Add verification widgets to any website
              </Typography>

              <Box sx={{ mb: 3, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#8A2BE2' }}>
                  Embed Code:
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {`<iframe src="${window.location.origin}/widget/verify?board=ID" width="400" height="300"></iframe>`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={() => window.open(`${window.location.origin}/widget/preview`, '_blank')}
                  sx={{
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    color: '#8A2BE2',
                    '&:hover': {
                      borderColor: '#8A2BE2',
                      background: 'rgba(138, 43, 226, 0.1)'
                    }
                  }}
                >
                  Preview Widget
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  fullWidth
                  onClick={() => navigator.clipboard.writeText(`<iframe src="${window.location.origin}/widget/verify?board=ID" width="400" height="300"></iframe>`)}
                  sx={{
                    background: 'linear-gradient(45deg, #8A2BE2, #85C1E9)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #85C1E9, #8A2BE2)'
                    }
                  }}
                >
                  Copy Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
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
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: 300,
        height: 300,
        background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.1), rgba(30, 144, 255, 0.1))',
        borderRadius: '50% 60% 70% 40% / 60% 50% 80% 40%',
        animation: 'morphing 10s ease-in-out infinite, float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '8%',
        width: 150,
        height: 150,
        background: 'linear-gradient(45deg, rgba(255, 20, 147, 0.1), rgba(138, 43, 226, 0.1))',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        animation: 'morphing2 6s ease-in-out infinite, float2 4s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <style>
        {`
          @keyframes morphing {
            0%, 100% { border-radius: 50% 60% 70% 40% / 60% 50% 80% 40%; }
            50% { border-radius: 80% 30% 50% 70% / 40% 80% 30% 60%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(2deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          @keyframes morphing2 {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.3); }
            50% { box-shadow: 0 0 40px rgba(138, 43, 226, 0.6); }
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
        <Box sx={{ py: 4 }}>
          <Fade in timeout={1000}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                mb: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
                  zIndex: -1
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    animation: 'glow 3s ease-in-out infinite'
                  }}
                >
                  <Public sx={{ fontSize: 30, color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Universal Dashboard
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.2rem' }
                    }}
                  >
                    Trust-as-a-Service Platform for {organization.name}
                  </Typography>
                </Box>
              </Box>
              
              {/* Enhanced Stats Cards with Institution Dashboard styling */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(138, 43, 226, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(138, 43, 226, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <VerifiedUser sx={{ fontSize: 40, color: '#8A2BE2', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {analytics?.overview.totalTrustBoards || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Total Credentials
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(30, 144, 255, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(30, 144, 255, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Shield sx={{ fontSize: 40, color: '#1E90FF', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {analytics?.overview.totalVerifications || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Verifications
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 20, 147, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(255, 20, 147, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <TrendingUp sx={{ fontSize: 40, color: '#FF1493', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {Math.round(analytics?.trends.satisfactionScore || 95)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Trust Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(50, 205, 50, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(50, 205, 50, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Integration sx={{ fontSize: 40, color: '#32CD32', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {analytics?.overview.totalOrganizations || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Active Users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Enhanced Navigation Tabs */}
          <Fade in timeout={1200}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)',
                borderRadius: '16px 16px 0 0',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: 'none'
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minHeight: 60,
                    '&.Mui-selected': {
                      color: '#8A2BE2',
                      background: 'rgba(138, 43, 226, 0.1)'
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
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
            background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
            boxShadow: '0 8px 25px rgba(138, 43, 226, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
              transform: 'scale(1.1)',
              boxShadow: '0 15px 35px rgba(138, 43, 226, 0.6)'
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

      {/* Board Details Dialog */}
      <Dialog
        open={boardDetailsOpen}
        onClose={() => setBoardDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {selectedBoard?.name} - Board Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedBoard && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Configuration
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Category: {selectedBoard.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Fields: {selectedBoard.fields.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Records: {selectedBoard.recordCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Status: {selectedBoard.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                {selectedBoard.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined"
                  onClick={() => setBoardDetailsOpen(false)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    setBoardDetailsOpen(false);
                    setCreatorOpen(true);
                  }}
                  sx={{
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                    }
                  }}
                >
                  Edit Board
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Board Data Management Dialog */}
      <Dialog
        open={boardDataOpen}
        onClose={() => setBoardDataOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {selectedBoard?.name} - Data Management
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedBoard && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Data management interface for {selectedBoard.name}. Upload CSV files, add records, and manage data.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(138, 43, 226, 0.2)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                        Upload Data
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        Bulk upload records via CSV file
                      </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<CloudUpload />}
                        sx={{
                          background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                          }
                        }}
                      >
                        Upload CSV
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(30, 144, 255, 0.2)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                        Add Record
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        Manually add a single record
                      </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<AddIcon />}
                        sx={{
                          background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)'
                          }
                        }}
                      >
                        Add Record
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="outlined"
                  onClick={() => setBoardDataOpen(false)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => handleShareToSocial('copy', selectedBoard.id)}
                  sx={{
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                    }
                  }}
                >
                  Share Board
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UniversalDashboard;
