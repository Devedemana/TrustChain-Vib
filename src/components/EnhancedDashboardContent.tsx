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
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

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
                          background: `conic-gradient(from 0deg, #4CAF50 0deg, #4CAF50 ${profileCompleteness * 3.6}deg, rgba(255,255,255,0.2) ${profileCompleteness * 3.6}deg)`,
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

          {/* Charts Section - Enhanced */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
            {/* Credential Distribution Chart */}
            <Grid item xs={12} lg={6}>
              <Slide direction="right" in={animateIn} timeout={1200}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  height: { xs: 300, md: 350 },
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #4ECDC4, #45B7D1, #F7B731)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 2,
                      background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)'
                    }}>
                      <Analytics />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                      Credential Distribution
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    height: { xs: 220, md: 260 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {credentialChartData?.datasets ? (
                      <Doughnut 
                        data={credentialChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: { size: isMobile ? 10 : 12 }
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading chart data...</Typography>
                    )}
                  </Box>
                </Paper>
              </Slide>
            </Grid>

            {/* Skills Growth Timeline */}
            <Grid item xs={12} lg={6}>
              <Slide direction="left" in={animateIn} timeout={1200}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  height: { xs: 300, md: 350 },
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #F7B731, #FC4A1A, #5F27CD)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: 'secondary.main', 
                      mr: 2,
                      background: 'linear-gradient(135deg, #F7B731, #FC4A1A)'
                    }}>
                      <Timeline />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                      Skills Growth
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    height: { xs: 220, md: 260 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {skillGrowthData?.datasets ? (
                      <Line 
                        data={skillGrowthData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: { color: 'rgba(0,0,0,0.1)' }
                            },
                            x: {
                              grid: { color: 'rgba(0,0,0,0.1)' }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: { size: isMobile ? 10 : 12 }
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading growth data...</Typography>
                    )}
                  </Box>
                </Paper>
              </Slide>
            </Grid>
          </Grid>

          {/* Action Buttons & Social Sharing */}
          <Slide direction="up" in={animateIn} timeout={1400}>
            <Paper sx={{
              p: 3,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3, color: 'white' }}>
                Share Your Achievements
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  startIcon={<Share />}
                  onClick={() => setSocialShareOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Share Progress
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    borderWidth: 2,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: 'primary.main',
                      boxShadow: '0 8px 25px rgba(0, 123, 255, 0.2)'
                    }
                  }}
                >
                  Export Report
                </Button>
              </Stack>
            </Paper>
          </Slide>

          {/* Social Sharing Backdrop */}
          <Backdrop
            open={socialShareOpen}
            onClick={() => setSocialShareOpen(false)}
            sx={{ zIndex: 9999, backdropFilter: 'blur(10px)' }}
          >
            <Fade in={socialShareOpen}>
              <Paper sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center',
                maxWidth: 400,
                width: '90%',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)'
              }}>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, color: 'white' }}>
                  Share on Social Media
                </Typography>
                
                <Grid container spacing={2}>
                  {[
                    { platform: 'LinkedIn', icon: LinkedIn, color: '#0077B5' },
                    { platform: 'Twitter', icon: Twitter, color: '#1DA1F2' },
                    { platform: 'Facebook', icon: Facebook, color: '#1877F2' },
                    { platform: 'Instagram', icon: Instagram, color: '#E4405F' },
                    { platform: 'WhatsApp', icon: WhatsApp, color: '#25D366' },
                    { platform: 'Telegram', icon: Telegram, color: '#0088CC' }
                  ].map((social, index) => (
                    <Grid item xs={6} sm={4} key={social.platform}>
                      <IconButton
                        onClick={() => handleSocialShare(social.platform)}
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: social.color,
                          color: 'white',
                          borderRadius: 3,
                          '&:hover': {
                            bgcolor: social.color,
                            transform: 'scale(1.1)',
                            boxShadow: `0 8px 25px ${social.color}40`
                          }
                        }}
                      >
                        <social.icon sx={{ fontSize: 32 }} />
                      </IconButton>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {social.platform}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  onClick={() => setSocialShareOpen(false)}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  Close
                </Button>
              </Paper>
            </Fade>
          </Backdrop>
        </Box>
      </Fade>
    </Container>
  );
};

export default EnhancedDashboardContent;
