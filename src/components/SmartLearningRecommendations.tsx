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
  LinearProgress,
  Paper,
  Divider,
  IconButton,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Tab,
  Tabs,
  Fade,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  School,
  EmojiEvents,
  PlayCircle,
  BookmarkBorder,
  Bookmark,
  AccessTime,
  Star,
  TrendingUp,
  Assessment,
  Timeline,
  Speed,
  ExpandMore,
  CheckCircle,
  Schedule,
  Person,
  Group,
  Language,
  Computer,
  Science,
  Business,
  AccountBalance,
  Palette,
  Build,
  Security,
  DataObject,
  CloudQueue,
  Analytics,
  Lightbulb,
  GpsFixed as Target,
  WorkspacePremium,
  LocalFireDepartment
} from '@mui/icons-material';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

interface SmartLearningRecommendationsProps {
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

const SmartLearningRecommendations: React.FC<SmartLearningRecommendationsProps> = ({
  currentUser,
  credentials
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    generateRecommendations();
    const timer = setTimeout(() => setAnimateIn(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const generateRecommendations = () => {
    // Mock AI-powered recommendations
    setRecommendations([
      {
        id: 1,
        title: "Advanced Blockchain Development",
        provider: "MIT OpenCourseWare",
        level: "Advanced",
        duration: "8 weeks",
        rating: 4.8,
        students: 15420,
        category: "Blockchain",
        aiScore: 95,
        thumbnail: "/api/placeholder/300/200",
        skills: ["Solidity", "Smart Contracts", "DeFi"],
        description: "Master advanced blockchain concepts and build decentralized applications",
        matchReason: "Perfect match for your blockchain expertise",
        price: "Free",
        certification: true,
        difficulty: "Advanced",
        prerequisites: ["Basic Blockchain", "Programming"],
        trending: true
      },
      {
        id: 2,
        title: "Machine Learning for Beginners",
        provider: "Stanford Online",
        level: "Beginner",
        duration: "12 weeks",
        rating: 4.9,
        students: 28560,
        category: "AI/ML",
        aiScore: 88,
        thumbnail: "/api/placeholder/300/200",
        skills: ["Python", "TensorFlow", "Data Science"],
        description: "Introduction to machine learning concepts and practical applications",
        matchReason: "Complements your technical background",
        price: "$99",
        certification: true,
        difficulty: "Beginner",
        prerequisites: ["Basic Math", "Programming Basics"],
        trending: false
      },
      {
        id: 3,
        title: "Web3 Product Management",
        provider: "Berkeley Executive Education",
        level: "Intermediate",
        duration: "6 weeks",
        rating: 4.7,
        students: 8930,
        category: "Business",
        aiScore: 82,
        thumbnail: "/api/placeholder/300/200",
        skills: ["Product Strategy", "Tokenomics", "Community Building"],
        description: "Learn to manage products in the decentralized economy",
        matchReason: "Aligns with emerging market trends",
        price: "$299",
        certification: true,
        difficulty: "Intermediate",
        prerequisites: ["Business Basics", "Web3 Knowledge"],
        trending: true
      },
      {
        id: 4,
        title: "Cybersecurity Fundamentals",
        provider: "Carnegie Mellon",
        level: "Intermediate",
        duration: "10 weeks",
        rating: 4.6,
        students: 19240,
        category: "Security",
        aiScore: 79,
        thumbnail: "/api/placeholder/300/200",
        skills: ["Network Security", "Cryptography", "Risk Assessment"],
        description: "Comprehensive introduction to cybersecurity principles and practices",
        matchReason: "Essential for blockchain developers",
        price: "$149",
        certification: true,
        difficulty: "Intermediate",
        prerequisites: ["Computer Networks", "Basic Programming"],
        trending: false
      }
    ]);

    // Mock learning path
    setLearningPath([
      {
        id: 1,
        phase: "Foundation",
        title: "Blockchain Fundamentals",
        status: "completed",
        progress: 100,
        courses: 3,
        timeframe: "1-2 months"
      },
      {
        id: 2,
        phase: "Intermediate",
        title: "Smart Contract Development",
        status: "current",
        progress: 65,
        courses: 2,
        timeframe: "2-3 months"
      },
      {
        id: 3,
        phase: "Advanced",
        title: "DeFi Protocol Design",
        status: "upcoming",
        progress: 0,
        courses: 4,
        timeframe: "3-4 months"
      },
      {
        id: 4,
        phase: "Specialization",
        title: "Blockchain Security Expert",
        status: "locked",
        progress: 0,
        courses: 5,
        timeframe: "4-6 months"
      }
    ]);

    // Mock skill gaps analysis
    setSkillGaps([
      {
        skill: "Solidity Programming",
        current: 85,
        target: 95,
        priority: "High",
        courses: 3,
        timeToClose: "2 months"
      },
      {
        skill: "DeFi Protocols",
        current: 60,
        target: 85,
        priority: "Medium",
        courses: 4,
        timeToClose: "3 months"
      },
      {
        skill: "Smart Contract Security",
        current: 70,
        target: 90,
        priority: "High",
        courses: 2,
        timeToClose: "1.5 months"
      },
      {
        skill: "Tokenomics Design",
        current: 45,
        target: 80,
        priority: "Medium",
        courses: 5,
        timeToClose: "4 months"
      }
    ]);
  };

  const toggleBookmark = (courseId: number) => {
    setBookmarkedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'blockchain': return <DataObject />;
      case 'ai/ml': return <Psychology />;
      case 'business': return <Business />;
      case 'security': return <Security />;
      case 'design': return <Palette />;
      case 'data science': return <Analytics />;
      default: return <School />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const skillGapChartData = {
    labels: skillGaps.map(gap => gap.skill),
    datasets: [
      {
        label: 'Current Level',
        data: skillGaps.map(gap => gap.current),
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderRadius: 8,
        borderSkipped: false
      },
      {
        label: 'Target Level',
        data: skillGaps.map(gap => gap.target),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const learningProgressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Courses Completed',
        data: [2, 5, 3, 8, 6, 12],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
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
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(150px, -150px)'
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
                      <Psychology sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        AI Learning Assistant
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Personalized recommendations powered by machine learning
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Typography variant="h5" fontWeight={700}>95%</Typography>
                      <Typography variant="caption">Match Score</Typography>
                    </Paper>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Typography variant="h5" fontWeight={700}>{recommendations.length}</Typography>
                      <Typography variant="caption">Recommendations</Typography>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Slide>

          {/* Navigation Tabs */}
          <Paper sx={{
            borderRadius: '20px 20px 0 0',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
              <Tab icon={<AutoAwesome />} label="AI Recommendations" iconPosition="start" />
              <Tab icon={<Timeline />} label="Learning Path" iconPosition="start" />
              <Tab icon={<Target />} label="Skill Gap Analysis" iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Paper sx={{
            borderRadius: '0 0 20px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderTop: 'none',
            minHeight: '600px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            {/* AI Recommendations Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {recommendations.map((course, index) => (
                  <Grid item xs={12} lg={6} key={course.id}>
                    <Slide direction="up" in={animateIn} timeout={1000 + index * 200}>
                      <Card sx={{
                        borderRadius: 4,
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                        }
                      }}>
                        {course.trending && (
                          <Box sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 2
                          }}>
                            <Chip
                              icon={<LocalFireDepartment />}
                              label="Trending"
                              color="error"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        )}
                        
                        <CardContent sx={{ p: 0 }}>
                          {/* Course Thumbnail */}
                          <Box sx={{ 
                            height: 200, 
                            background: `linear-gradient(45deg, ${course.category === 'Blockchain' ? '#667eea, #764ba2' : course.category === 'AI/ML' ? '#4ECDC4, #44A08D' : '#667eea, #764ba2'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <Avatar sx={{ 
                              width: 80, 
                              height: 80, 
                              bgcolor: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)'
                            }}>
                              {getCategoryIcon(course.category)}
                            </Avatar>
                            <Box sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16
                            }}>
                              <Chip 
                                label={`${course.aiScore}% Match`}
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                  fontWeight: 700,
                                  color: 'primary.main'
                                }}
                              />
                            </Box>
                          </Box>

                          <Box sx={{ p: 3 }}>
                            {/* Course Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                  {course.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} gutterBottom>
                                  {course.provider}
                                </Typography>
                              </Box>
                              <IconButton
                                onClick={() => toggleBookmark(course.id)}
                                color="primary"
                              >
                                {bookmarkedCourses.includes(course.id) ? <Bookmark /> : <BookmarkBorder />}
                              </IconButton>
                            </Box>

                            {/* Course Stats */}
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Star sx={{ fontSize: 16, color: '#FFB400' }} />
                                <Typography variant="body2" fontWeight={600}>
                                  {course.rating}
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Person sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                  {course.students.toLocaleString()}
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AccessTime sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                  {course.duration}
                                </Typography>
                              </Stack>
                            </Stack>

                            {/* Course Description */}
                            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
                              {course.description}
                            </Typography>

                            {/* Match Reason */}
                            <Paper sx={{ 
                              p: 1.5, 
                              mb: 2, 
                              bgcolor: 'primary.light', 
                              color: 'black',
                              borderRadius: 2
                            }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Lightbulb sx={{ fontSize: 16 }} />
                                <Typography variant="body2" fontWeight={500}>
                                  {course.matchReason}
                                </Typography>
                              </Stack>
                            </Paper>

                            {/* Skills */}
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Skills you'll learn:
                              </Typography>
                              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                {course.skills.map((skill: string, skillIndex: number) => (
                                  <Chip 
                                    key={skillIndex}
                                    label={skill}
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'secondary.light',
                                      color: 'white',
                                      fontWeight: 500
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>

                            {/* Course Details */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  Level
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {course.level}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  Price
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                  {course.price}
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<PlayCircle />}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.5,
                                  background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #45B7D1, #4ECDC4)'
                                  }
                                }}
                              >
                                Start Learning
                              </Button>
                              <Button
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  py: 1.5,
                                  px: 2,
                                  fontWeight: 600,
                                  textTransform: 'none'
                                }}
                              >
                                Preview
                              </Button>
                            </Stack>
                          </Box>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Learning Path Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Your Personalized Learning Journey
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  AI-curated path based on your goals and current skills
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Stack spacing={3}>
                    {learningPath.map((phase, index) => (
                      <Slide direction="right" in={animateIn} timeout={1200 + index * 300} key={phase.id}>
                        <Card sx={{
                          borderRadius: 4,
                          border: phase.status === 'current' ? '3px solid #4CAF50' : '2px solid transparent',
                          background: phase.status === 'current' 
                            ? 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4CAF50, #66BB6A) border-box'
                            : phase.status === 'completed'
                            ? 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #2196F3, #42A5F5) border-box'
                            : 'rgba(0,0,0,0.05)',
                          opacity: phase.status === 'locked' ? 0.5 : 1,
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: phase.status !== 'locked' ? 'translateX(8px)' : 'none',
                            boxShadow: phase.status !== 'locked' ? '0 12px 30px rgba(0,0,0,0.15)' : 'none'
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ 
                                width: 60, 
                                height: 60, 
                                mr: 2,
                                bgcolor: phase.status === 'completed' ? '#4CAF50' : 
                                        phase.status === 'current' ? '#FF9800' : 
                                        phase.status === 'upcoming' ? '#2196F3' : '#757575'
                              }}>
                                {phase.status === 'completed' ? <CheckCircle /> : 
                                 phase.status === 'current' ? <PlayCircle /> :
                                 phase.status === 'upcoming' ? <Schedule /> : <Security />}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                  <Chip 
                                    label={phase.phase}
                                    size="small"
                                    color={
                                      phase.status === 'completed' ? 'success' :
                                      phase.status === 'current' ? 'warning' :
                                      phase.status === 'upcoming' ? 'primary' : 'default'
                                    }
                                  />
                                  <Typography variant="h6" fontWeight={700}>
                                    {phase.title}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    {phase.courses} courses • {phase.timeframe}
                                  </Typography>
                                </Stack>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                  {phase.progress}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Complete
                                </Typography>
                              </Box>
                            </Box>

                            <LinearProgress
                              variant="determinate"
                              value={phase.progress}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  backgroundColor: 
                                    phase.status === 'completed' ? '#4CAF50' :
                                    phase.status === 'current' ? '#FF9800' :
                                    phase.status === 'upcoming' ? '#2196F3' : '#757575'
                                }
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Slide>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Slide direction="left" in={animateIn} timeout={1500}>
                    <Paper sx={{
                      p: 3,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <WorkspacePremium sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Learning Progress
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                        Track your journey to expertise
                      </Typography>
                      <Box sx={{ height: 200, mt: 2 }}>
                        <Line
                          data={learningProgressData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              }
                            },
                            scales: {
                              x: {
                                grid: {
                                  display: false
                                },
                                ticks: {
                                  color: 'white'
                                }
                              },
                              y: {
                                grid: {
                                  color: 'rgba(255,255,255,0.2)'
                                },
                                ticks: {
                                  color: 'white'
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Paper>
                  </Slide>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Skill Gap Analysis Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                    Skill Gap Analysis
                  </Typography>
                  
                  <Stack spacing={3}>
                    {skillGaps.map((gap, index) => (
                      <Slide direction="up" in={animateIn} timeout={1400 + index * 200} key={index}>
                        <Paper sx={{
                          p: 3,
                          borderRadius: 3,
                          border: `2px solid ${getPriorityColor(gap.priority)}20`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: `0 8px 25px ${getPriorityColor(gap.priority)}20`,
                            transform: 'translateY(-4px)'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="h6" fontWeight={700}>
                                {gap.skill}
                              </Typography>
                              <Chip 
                                label={gap.priority}
                                size="small"
                                sx={{
                                  bgcolor: getPriorityColor(gap.priority),
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {gap.timeToClose} to close
                            </Typography>
                          </Box>

                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                                  Current
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={gap.current}
                                  sx={{
                                    flex: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 4,
                                      backgroundColor: '#2196F3'
                                    }
                                  }}
                                />
                                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40 }}>
                                  {gap.current}%
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                                  Target
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={gap.target}
                                  sx={{
                                    flex: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 4,
                                      backgroundColor: '#4CAF50'
                                    }
                                  }}
                                />
                                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40 }}>
                                  {gap.target}%
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ 
                                p: 2, 
                                textAlign: 'center', 
                                bgcolor: 'primary.light',
                                color: 'white',
                                borderRadius: 2
                              }}>
                                <Typography variant="h6" fontWeight={700}>
                                  {gap.courses}
                                </Typography>
                                <Typography variant="caption">
                                  Recommended Courses
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Slide>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Slide direction="left" in={animateIn} timeout={1600}>
                    <Paper sx={{
                      p: 3,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                        Skill Level Overview
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <Bar
                          data={skillGapChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                labels: {
                                  color: 'white'
                                }
                              }
                            },
                            scales: {
                              x: {
                                grid: {
                                  display: false
                                },
                                ticks: {
                                  color: 'white',
                                  maxRotation: 45
                                }
                              },
                              y: {
                                grid: {
                                  color: 'rgba(255,255,255,0.2)'
                                },
                                ticks: {
                                  color: 'white'
                                },
                                beginAtZero: true,
                                max: 100
                              }
                            }
                          }}
                        />
                      </Box>
                    </Paper>
                  </Slide>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default SmartLearningRecommendations;
