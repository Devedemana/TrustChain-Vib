import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Paper,
  Divider,
  IconButton,
  Badge,
  Tooltip,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Container,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  LinearProgress
} from '@mui/material';
import {
  People,
  School,
  EmojiEvents,
  Star,
  Add,
  Message,
  VideoCall,
  Group,
  Person,
  Search,
  FilterList,
  TrendingUp,
  Schedule,
  LocationOn,
  Language,
  Public,
  Lock,
  Verified,
  AutoAwesome,
  Psychology,
  Timeline,
  Assessment,
  ConnectWithoutContact,
  Forum,
  Analytics,
  Bookmark
} from '@mui/icons-material';
import { glassmorphismStyles, glassCard, glassCardWithHover, glassmorphismStyles as glass } from '../styles/glassmorphism';

interface SocialLearningProps {
  currentUser: any;
  credentials: any[];
}

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SocialLearning: React.FC<SocialLearningProps> = ({ 
  currentUser, 
  credentials 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [peers, setPeers] = useState<any[]>([]);
  const [studyGroups, setStudyGroups] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openPeerProfile, setOpenPeerProfile] = useState<any>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    generateSocialData();
    const timer = setTimeout(() => setAnimateIn(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const generateSocialData = () => {
    // Mock peers data
    setPeers([
      {
        id: 1,
        name: "Alex Chen",
        avatar: "/api/placeholder/50/50",
        university: "MIT",
        major: "Computer Science",
        credentials: 12,
        skills: ["Blockchain", "AI/ML", "Web Development"],
        compatibility: 95,
        status: "online",
        location: "Boston, MA",
        studyTime: "Evening (EST)",
        languages: ["English", "Chinese"]
      },
      {
        id: 2,
        name: "Sarah Johnson",
        avatar: "/api/placeholder/50/50",
        university: "Stanford",
        major: "Data Science",
        credentials: 8,
        skills: ["Python", "Statistics", "Machine Learning"],
        compatibility: 88,
        status: "away",
        location: "San Francisco, CA",
        studyTime: "Morning (PST)",
        languages: ["English", "Spanish"]
      },
      {
        id: 3,
        name: "Marcus Williams",
        avatar: "/api/placeholder/50/50",
        university: "Harvard",
        major: "Business Analytics",
        credentials: 15,
        skills: ["Business Strategy", "Analytics", "Leadership"],
        compatibility: 82,
        status: "online",
        location: "Cambridge, MA",
        studyTime: "Flexible",
        languages: ["English", "French"]
      }
    ]);

    // Mock study groups
    setStudyGroups([
      {
        id: 1,
        name: "Blockchain Builders",
        description: "Building the future of decentralized applications",
        members: 24,
        avatar: "/api/placeholder/60/60",
        category: "Blockchain",
        level: "Advanced",
        nextSession: "Tomorrow 7PM EST",
        tags: ["Solidity", "Web3", "DeFi"],
        privacy: "Public",
        activity: "Very Active",
        joined: false
      },
      {
        id: 2,
        name: "AI/ML Study Circle",
        description: "Exploring machine learning concepts and applications",
        members: 31,
        avatar: "/api/placeholder/60/60",
        category: "AI/ML",
        level: "Intermediate",
        nextSession: "Friday 6PM PST",
        tags: ["Python", "TensorFlow", "Neural Networks"],
        privacy: "Public",
        activity: "Active",
        joined: true
      },
      {
        id: 3,
        name: "Web3 Startup Founders",
        description: "Building successful Web3 startups and products",
        members: 18,
        avatar: "/api/placeholder/60/60",
        category: "Entrepreneurship",
        level: "Expert",
        nextSession: "Monday 5PM EST",
        tags: ["Business", "Tokenomics", "Strategy"],
        privacy: "Private",
        activity: "Moderate",
        joined: false
      }
    ]);

    // Mock achievements feed
    setAchievements([
      {
        id: 1,
        user: "Alex Chen",
        avatar: "/api/placeholder/40/40",
        achievement: "Completed Advanced Solidity Course",
        time: "2 hours ago",
        likes: 15,
        type: "certification"
      },
      {
        id: 2,
        user: "Sarah Johnson",
        avatar: "/api/placeholder/40/40", 
        achievement: "Started new study group: Python for Data Science",
        time: "4 hours ago",
        likes: 8,
        type: "group"
      },
      {
        id: 3,
        user: "Marcus Williams",
        avatar: "/api/placeholder/40/40",
        achievement: "Reached 15 verified credentials milestone!",
        time: "1 day ago",
        likes: 23,
        type: "milestone"
      }
    ]);
  };

  const handleJoinGroup = (groupId: number) => {
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, joined: !group.joined, members: group.joined ? group.members - 1 : group.members + 1 } : group
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      default: return '#757575';
    }
  };

  const getActivityLevel = (activity: string) => {
    switch (activity) {
      case 'Very Active': return { color: '#4CAF50', width: '90%' };
      case 'Active': return { color: '#2196F3', width: '70%' };
      case 'Moderate': return { color: '#FF9800', width: '50%' };
      default: return { color: '#757575', width: '30%' };
    }
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Fade in={animateIn} timeout={1000}>
        <Box>
          {/* Header Section */}
          <Slide direction="down" in={animateIn} timeout={800}>
            <Paper sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(100px, -100px)'
              }
            }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      mr: 2,
                      width: 60,
                      height: 60
                    }}>
                      <ConnectWithoutContact sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        Learning Network
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Connect • Collaborate • Achieve Together
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700}>{peers.length}</Typography>
                      <Typography variant="caption">Study Partners</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700}>{studyGroups.filter(g => g.joined).length}</Typography>
                      <Typography variant="caption">Groups Joined</Typography>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Slide>

          {/* Navigation Tabs */}
          <Paper sx={{
            borderRadius: '20px 20px 0 0',
            ...glassmorphismStyles.primaryGlass,
            borderBottom: 'none'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 60,
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                }
              }}
            >
              <Tab icon={<People />} label="Find Study Partners" iconPosition="start" />
              <Tab icon={<Group />} label="Study Groups" iconPosition="start" />
              <Tab icon={<Timeline />} label="Achievement Feed" iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Paper sx={{
            borderRadius: '0 0 20px 20px',
            ...glassmorphismStyles.primaryGlass,
            borderTop: 'none',
            minHeight: '600px'
          }}>
            {/* Study Partners Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search by name, skills, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }
                  }}
                />
              </Box>

              <Grid container spacing={3}>
                {peers.filter(peer => 
                  peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  peer.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((peer, index) => (
                  <Grid item xs={12} md={6} lg={4} key={peer.id}>
                    <Slide direction="up" in={animateIn} timeout={1000 + index * 200}>
                      <Card sx={{
                        borderRadius: 4,
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: getStatusColor(peer.status),
                                  border: '2px solid white'
                                }} />
                              }
                            >
                              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                                {peer.name.split(' ').map((n: string) => n[0]).join('')}
                              </Avatar>
                            </Badge>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={700}>
                                {peer.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {peer.major} • {peer.university}
                              </Typography>
                            </Box>
                            <Chip 
                              label={`${peer.compatibility}%`}
                              color="primary"
                              sx={{ fontWeight: 700 }}
                            />
                          </Box>

                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} gutterBottom>
                                Skills & Interests
                              </Typography>
                              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                {peer.skills.map((skill: string, skillIndex: number) => (
                                  <Chip 
                                    key={skillIndex}
                                    label={skill}
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'primary.light',
                                      color: 'white',
                                      fontWeight: 500
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>

                            <Divider />

                            <Box>
                              <Stack spacing={1}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <LocationOn sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{peer.location}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Schedule sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{peer.studyTime}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <EmojiEvents sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{peer.credentials} credentials</Typography>
                                </Stack>
                              </Stack>
                            </Box>

                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<Message />}
                                sx={{
                                  borderRadius: 2,
                                  flex: 1,
                                  background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #45B7D1, #4ECDC4)'
                                  }
                                }}
                              >
                                Connect
                              </Button>
                              <IconButton
                                color="primary"
                                onClick={() => setOpenPeerProfile(peer)}
                                sx={{ 
                                  border: '2px solid',
                                  borderColor: 'primary.main',
                                  borderRadius: 2
                                }}
                              >
                                <Person />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Study Groups Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                  Available Study Groups
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenCreateGroup(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: 3,
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Create Group
                </Button>
              </Box>

              <Grid container spacing={3}>
                {studyGroups.map((group, index) => (
                  <Grid item xs={12} lg={6} key={group.id}>
                    <Slide direction="up" in={animateIn} timeout={1200 + index * 200}>
                      <Card sx={{
                        borderRadius: 4,
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ 
                              width: 60, 
                              height: 60, 
                              mr: 2,
                              bgcolor: 'primary.main',
                              fontSize: '1.5rem',
                              fontWeight: 700
                            }}>
                              {group.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                                {group.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {group.description}
                              </Typography>
                            </Box>
                            <Stack alignItems="center" spacing={0.5}>
                              <Typography variant="h6" fontWeight={700} color="primary.main">
                                {group.members}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                members
                              </Typography>
                            </Stack>
                          </Box>

                          <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Chip 
                                label={group.level}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                              <Chip 
                                label={group.privacy}
                                color={group.privacy === 'Public' ? 'success' : 'warning'}
                                variant="outlined"
                                size="small"
                                icon={group.privacy === 'Public' ? <Public sx={{ fontSize: 16 }} /> : <Lock sx={{ fontSize: 16 }} />}
                              />
                            </Stack>

                            <Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} gutterBottom>
                                Activity Level
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={parseFloat(getActivityLevel(group.activity).width)}
                                  sx={{
                                    flex: 1,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getActivityLevel(group.activity).color,
                                      borderRadius: 3
                                    }
                                  }}
                                />
                                <Typography variant="caption" fontWeight={600} sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                  {group.activity}
                                </Typography>
                              </Box>
                            </Box>

                            <Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} gutterBottom>
                                Next Session: {group.nextSession}
                              </Typography>
                              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                {group.tags.map((tag: string, tagIndex: number) => (
                                  <Chip 
                                    key={tagIndex}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Stack>
                            </Box>

                            <Button
                              variant={group.joined ? "outlined" : "contained"}
                              fullWidth
                              onClick={() => handleJoinGroup(group.id)}
                              sx={{
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                ...(group.joined ? {} : {
                                  background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #45B7D1, #4ECDC4)'
                                  }
                                })
                              }}
                            >
                              {group.joined ? "Leave Group" : "Join Group"}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Achievement Feed Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, color: 'white' }}>
                Recent Achievements
              </Typography>

              <Stack spacing={3}>
                {achievements.map((achievement, index) => (
                  <Slide direction="up" in={animateIn} timeout={1400 + index * 200} key={achievement.id}>
                    <Paper sx={{
                      p: 3,
                      borderRadius: 4,
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 50, height: 50 }}>
                          {achievement.user.split(' ').map((n: string) => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                            <strong>{achievement.user}</strong> {achievement.achievement}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {achievement.time}
                          </Typography>
                        </Box>
                        <Stack alignItems="center" spacing={0.5}>
                          <IconButton color="primary" size="small">
                            <Star />
                          </IconButton>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {achievement.likes}
                          </Typography>
                        </Stack>
                      </Box>
                    </Paper>
                  </Slide>
                ))}
              </Stack>
            </TabPanel>
          </Paper>

          {/* Peer Profile Dialog */}
          <Dialog
            open={!!openPeerProfile}
            onClose={() => setOpenPeerProfile(null)}
            maxWidth="sm"
            fullWidth
          >
            {openPeerProfile && (
              <>
                <DialogTitle>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 60, height: 60 }}>
                      {openPeerProfile.name.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{openPeerProfile.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {openPeerProfile.major} • {openPeerProfile.university}
                      </Typography>
                    </Box>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Languages</Typography>
                      <Stack direction="row" spacing={1}>
                        {openPeerProfile.languages.map((lang: string, index: number) => (
                          <Chip key={index} label={lang} size="small" />
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Skills</Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {openPeerProfile.skills.map((skill: string, index: number) => (
                          <Chip key={index} label={skill} color="primary" variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenPeerProfile(null)}>Close</Button>
                  <Button variant="contained" startIcon={<Message />}>
                    Send Message
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      </Fade>
    </Container>
  );
};

export default SocialLearning;
