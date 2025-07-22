import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Button,
  LinearProgress,
  Stack,
  IconButton,
  Paper,
  Divider,
  Tooltip,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Container,
  Backdrop
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  Star,
  Share,
  Download,
  EmojiEvents,
  School,
  Work,
  AttachMoney,
  Speed,
  Lightbulb,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  WhatsApp,
  Telegram,
  Assessment,
  Timeline,
  AutoAwesome,
  Verified,
  FlashOn,
  TrendingDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

interface EnhancedDashboardContentProps {
  credentials: any[];
  profileCompleteness: number;
  credentialChartData: any;
  skillGrowthData: any;
  marketDemandData: any;
  careerInsights: any[];
  onShareToSocial: (platform: string) => void;
}

const EnhancedDashboardContent: React.FC<EnhancedDashboardContentProps> = ({
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
  const [socialShareOpen, setSocialShareOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSocialShare = (platform: string) => {
    onShareToSocial(platform);
    setSocialShareOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Fade in={animateIn} timeout={1000}>
        <Box>
          {/* Hero Stats Section */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
            {/* Profile Completeness - Enhanced */}
            <Grid item xs={12} md={6} lg={4}>
              <Slide direction="up" in={animateIn} timeout={800}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 4,
                  overflow: 'visible',
                  position: 'relative',
                  height: { xs: 180, md: 220 },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                    borderRadius: 'inherit',
                    zIndex: -1,
                    filter: 'blur(10px)',
                    opacity: 0.7
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease'
                  }
                }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        mr: 2,
                        width: { xs: 40, md: 50 },
                        height: { xs: 40, md: 50 }
                      }}>
                        <AutoAwesome sx={{ fontSize: { xs: 20, md: 24 } }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        Profile Score
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <Box sx={{
                          width: { xs: 80, md: 100 },
                          height: { xs: 80, md: 100 },
                          borderRadius: '50%',
                          background: 'conic-gradient(from 0deg, #4CAF50 0deg, #4CAF50 ' + (profileCompleteness * 3.6) + 'deg, rgba(255,255,255,0.2) ' + (profileCompleteness * 3.6) + 'deg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            {profileCompleteness}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Chip 
                        label={profileCompleteness >= 80 ? "Excellent" : profileCompleteness >= 60 ? "Good" : "Needs Work"}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>

            {/* Quick Stats Cards */}
            <Grid item xs={12} md={6} lg={8}>
              <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ height: '100%' }}>
                {[
                  { 
                    icon: School, 
                    title: 'Credentials', 
                    value: credentials.length, 
                    change: '+12%',
                    color: '#4ECDC4',
                    bg: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
                  },
                  { 
                    icon: TrendingUp, 
                    title: 'Growth Rate', 
                    value: '87%', 
                    change: '+5.2%',
                    color: '#45B7D1',
                    bg: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)'
                  },
                  { 
                    icon: EmojiEvents, 
                    title: 'Achievements', 
                    value: credentials.filter(c => c.verified).length,
                    change: '+3',
                    color: '#F7B731',
                    bg: 'linear-gradient(135deg, #F7B731 0%, #FC4A1A 100%)'
                  },
                  { 
                    icon: Assessment, 
                    title: 'Skill Level', 
                    value: '8.2/10', 
                    change: '+0.8',
                    color: '#5F27CD',
                    bg: 'linear-gradient(135deg, #5F27CD 0%, #341f97 100%)'
                  }
                ].map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Slide direction="up" in={animateIn} timeout={1000 + index * 200}>
                      <Card sx={{
                        background: stat.bg,
                        color: 'white',
                        borderRadius: 3,
                        height: { xs: '80px', md: '100px' },
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: `0 12px 28px ${stat.color}40`
                        }
                      }}>
                        <CardContent sx={{ 
                          p: { xs: 1.5, md: 2 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <stat.icon sx={{ fontSize: { xs: 20, md: 24 }, opacity: 0.9 }} />
                            <Chip 
                              label={stat.change}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              {stat.title}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                <Star />
              </Avatar>
              <Typography variant="h6">Profile Score</Typography>
            </Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              {profileCompleteness}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={profileCompleteness}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {profileCompleteness >= 80 ? 'Excellent profile!' : 
               profileCompleteness >= 60 ? 'Good progress!' : 
               'Keep building your profile!'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#4fc3f7', mx: 'auto', mb: 1 }}>
                <School />
              </Avatar>
              <Typography variant="h4">{credentials.length}</Typography>
              <Typography variant="caption">Credentials</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#81c784', mx: 'auto', mb: 1 }}>
                <Work />
              </Avatar>
              <Typography variant="h4">{Math.floor(Math.random() * 50) + 10}</Typography>
              <Typography variant="caption">Job Matches</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#ffb74d', mx: 'auto', mb: 1 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h4">+{Math.floor(Math.random() * 30) + 10}%</Typography>
              <Typography variant="caption">Market Value</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#f06292', mx: 'auto', mb: 1 }}>
                <Speed />
              </Avatar>
              <Typography variant="h4">{Math.floor(Math.random() * 10) + 8}/10</Typography>
              <Typography variant="caption">Skill Score</Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Credentials Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, height: '350px' }}>
          <Typography variant="h6" gutterBottom>
            <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
            Credential Distribution
          </Typography>
          <Box sx={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
            {credentials.length > 0 ? (
              <Doughnut 
                data={credentialChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                No credentials yet. Start building your profile!
              </Typography>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Skill Growth Trend */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, height: '350px' }}>
          <Typography variant="h6" gutterBottom>
            <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
            Skill Growth Trend
          </Typography>
          <Box sx={{ height: '250px' }}>
            <Line 
              data={skillGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </Box>
        </Card>
      </Grid>

      {/* Market Demand Analysis */}
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Market Demand by Skill
          </Typography>
          <Box sx={{ height: '300px' }}>
            <Bar 
              data={marketDemandData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </Box>
        </Card>
      </Grid>

      {/* Career Insights */}
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
            Career Insights
          </Typography>
          <Stack spacing={2}>
            {careerInsights.map((insight, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">{insight.title}</Typography>
                  <Chip 
                    label={`${insight.score}%`}
                    size="small"
                    color={insight.score >= 85 ? 'success' : insight.score >= 70 ? 'primary' : 'warning'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {insight.description}
                </Typography>
                <Divider />
              </Box>
            ))}
          </Stack>
        </Card>
      </Grid>

      {/* Social Sharing */}
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Share sx={{ mr: 1, verticalAlign: 'middle' }} />
            Share Your Achievements
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Show off your verified credentials and boost your professional presence
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<LinkedIn />}
              onClick={() => onShareToSocial('linkedin')}
              sx={{ bgcolor: '#0077b5' }}
            >
              Share on LinkedIn
            </Button>
            <Button
              variant="contained"
              startIcon={<Twitter />}
              onClick={() => onShareToSocial('twitter')}
              sx={{ bgcolor: '#1da1f2' }}
            >
              Share on Twitter
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EnhancedDashboardContent;
