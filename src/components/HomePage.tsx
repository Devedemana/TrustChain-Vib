import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Container,
  Chip,
  Avatar,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Divider,
  Paper,
  Backdrop
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloudIcon from '@mui/icons-material/Cloud';
import SpeedIcon from '@mui/icons-material/Speed';
import PublicIcon from '@mui/icons-material/Public';
import DiamondIcon from '@mui/icons-material/Diamond';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FlareIcon from '@mui/icons-material/Flare';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: ['#4fc3f7', '#81c784', '#ffb74d', '#f06292'][Math.floor(Math.random() * 4)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Advanced CSS animations and styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(1deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(78, 205, 196, 0.3); }
        50% { box-shadow: 0 0 40px rgba(78, 205, 196, 0.6), 0 0 80px rgba(78, 205, 196, 0.3); }
      }

      @keyframes sparkle {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }

      @keyframes ripple {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2.4); opacity: 0; }
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes morphing {
        0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #000 100%)',
    }}>
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Dynamic Mouse Follower */}
      <Box
        sx={{
          position: 'absolute',
          top: mousePosition.y - 150,
          left: mousePosition.x - 150,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, rgba(255, 107, 139, 0.05) 50%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'all 0.1s ease-out',
          filter: 'blur(40px)',
        }}
      />

      {/* Morphing Background Shapes */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: 200,
        height: 200,
        background: 'linear-gradient(45deg, rgba(255, 107, 139, 0.1), rgba(78, 205, 196, 0.1))',
        animation: 'morphing 8s ease-in-out infinite, float 6s ease-in-out infinite',
        zIndex: 1,
      }} />

      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: 150,
        height: 150,
        background: 'linear-gradient(45deg, rgba(69, 183, 209, 0.1), rgba(150, 206, 180, 0.1))',
        animation: 'morphing 10s ease-in-out infinite reverse, float 8s ease-in-out infinite',
        zIndex: 1,
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          
          {/* Hero Section */}
          <Fade in={isVisible} timeout={1200}>
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
              
              {/* Floating Badge with Sparkle Effect */}
              <Box sx={{ mb: 4, position: 'relative' }}>
                <Chip 
                  icon={<StarIcon sx={{ color: '#FFD700 !important', animation: 'sparkle 2s infinite' }} />}
                  label="Next-Gen Blockchain Technology" 
                  sx={{ 
                    background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.25))',
                    color: '#FFD700',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 3,
                    py: 1.5,
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    backdropFilter: 'blur(20px)',
                    animation: 'float 4s ease-in-out infinite',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      animation: 'shimmer 3s infinite',
                    },
                    '@keyframes shimmer': {
                      '0%': { left: '-100%' },
                      '100%': { left: '100%' }
                    }
                  }}
                />
              </Box>

              {/* Main Title with Advanced Gradient Animation */}
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3.5rem', md: '6rem', lg: '7rem' },
                  fontWeight: 900,
                  mb: 3,
                  background: 'linear-gradient(45deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 6s ease infinite',
                  textShadow: '0 0 80px rgba(255, 107, 139, 0.6)',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.85,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(ellipse, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: -1,
                    animation: 'pulse 4s ease-in-out infinite',
                  }
                }}
              >
                TrustChain
              </Typography>

              {/* Animated Subtitle */}
              <Box sx={{ mb: 4, position: 'relative' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.8rem', md: '3rem' },
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.95)',
                    maxWidth: '900px',
                    mx: 'auto',
                    lineHeight: 1.3,
                    animation: 'slideUp 1s ease-out 0.5s both'
                  }}
                >
                  Universal 
                  <Box component="span" sx={{ 
                    background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mx: 1,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '100%',
                      height: 3,
                      background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                      animation: 'ripple 2s infinite'
                    }
                  }}>
                    Verification Infrastructure
                  </Box>
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.7)',
                    mt: 2,
                    fontStyle: 'italic'
                  }}
                >
                  'Trust-as-a-Service' - Think 'Shopify for Trust'
                </Typography>
              </Box>

              {/* Enhanced Description */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  fontWeight: 400,
                  mb: 8,
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  animation: 'slideUp 1s ease-out 1s both'
                }}
              >
                Enable any organization to leverage blockchain-based verification without 
                needing to understand blockchain technology. From academic credentials to 
                certifications, memberships, and beyond - create TrustBoards, deploy TrustGates, 
                and build trust networks that scale.
              </Typography>

              {/* Enhanced Action Buttons */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                sx={{ mb: 8, animation: 'slideUp 1s ease-out 1.5s both' }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  onClick={() => navigate('/universal')}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    px: 4,
                    py: 2,
                    background: 'linear-gradient(45deg, #FF6B6B 0%, #4ECDC4 100%)',
                    boxShadow: '0 10px 30px rgba(255, 107, 139, 0.4)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(255, 107, 139, 0.6)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    }
                  }}
                >
                  Create TrustBoard
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<VerifiedIcon />}
                  onClick={() => navigate('/universal-new')}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    color: '#7b1fa2',
                    borderColor: '#7b1fa2',
                    borderWidth: 2,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(123, 31, 162, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: '#7b1fa2',
                      background: 'rgba(123, 31, 162, 0.2)',
                      boxShadow: '0 10px 30px rgba(123, 31, 162, 0.3)',
                    }
                  }}
                >
                  🌉 TrustBridges
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<VerifiedIcon />}
                  onClick={() => navigate('/universal-demo')}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    color: '#4ECDC4',
                    borderColor: '#4ECDC4',
                    borderWidth: 2,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(78, 205, 196, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: '#4ECDC4',
                      background: 'rgba(78, 205, 196, 0.2)',
                      boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)',
                    }
                  }}
                >
                  View Demo
                </Button>
              </Stack>

              {/* Enhanced Stats Section */}
              <Grid container spacing={4} justifyContent="center" sx={{ animation: 'slideUp 1s ease-out 2s both' }}>
                {[
                  { icon: SecurityIcon, value: '25K+', label: 'TrustBoards Created', color: '#4ECDC4' },
                  { icon: AccountBalanceIcon, value: '1.2K+', label: 'Organizations', color: '#96CEB4' },
                  { icon: SpeedIcon, value: '99.9%', label: 'Uptime', color: '#FFEAA7' }
                ].map((stat, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        animation: `float 6s ease-in-out infinite ${index * 0.5}s`,
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.05)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          boxShadow: `0 20px 40px ${stat.color}30`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(45deg, ${stat.color}10, transparent)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2,
                          background: `linear-gradient(45deg, ${stat.color}, ${stat.color}80)`,
                          animation: 'glow 3s ease-in-out infinite'
                        }}
                      >
                        <stat.icon sx={{ fontSize: 30, color: 'white' }} />
                      </Avatar>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 900, 
                          color: stat.color,
                          mb: 1,
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>

          {/* Enhanced Features Section */}
          <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                textAlign: 'center',
                mb: 2,
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'slideUp 1s ease-out both'
              }}
            >
              Why Choose TrustChain?
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 8,
                maxWidth: '600px',
                mx: 'auto',
                animation: 'slideUp 1s ease-out 0.3s both'
              }}
            >
              Experience universal verification infrastructure that makes trust simple, scalable, and secure
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  icon: SecurityIcon,
                  title: 'TrustBoards',
                  description: 'Digital filing cabinets for organizing and managing verifiable credentials',
                  color: '#FF6B6B',
                  delay: '0s'
                },
                {
                  icon: SpeedIcon,
                  title: 'TrustGates',
                  description: 'Verification endpoints that validate credentials in real-time',
                  color: '#4ECDC4',
                  delay: '0.2s'
                },
                {
                  icon: QrCodeIcon,
                  title: 'TrustBridge',
                  description: 'Cross-verification network enabling trust between organizations',
                  color: '#45B7D1',
                  delay: '0.4s'
                },
                {
                  icon: DiamondIcon,
                  title: 'Universal Support',
                  description: 'From certificates to memberships - verify anything, anywhere',
                  color: '#96CEB4',
                  delay: '0.6s'
                },
                {
                  icon: PublicIcon,
                  title: 'No-Code Platform',
                  description: 'Deploy verification systems without technical expertise',
                  color: '#FFEAA7',
                  delay: '0.8s'
                },
                {
                  icon: AutoAwesomeIcon,
                  title: 'Blockchain Powered',
                  description: 'Internet Computer blockchain ensures immutable security',
                  color: '#DDA0DD',
                  delay: '1s'
                }
              ].map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: `slideUp 1s ease-out ${feature.delay} both`,
                      '&:hover': {
                        transform: 'translateY(-15px) scale(1.02)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: feature.color + '50',
                        boxShadow: `0 25px 50px ${feature.color}30`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${feature.color}15, transparent 70%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 3,
                          background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
                          animation: 'float 4s ease-in-out infinite',
                          boxShadow: `0 10px 30px ${feature.color}40`,
                        }}
                      >
                        <feature.icon sx={{ fontSize: 40, color: 'white' }} />
                      </Avatar>
                      
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          color: feature.color,
                          fontSize: { xs: '1.3rem', md: '1.5rem' }
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.6,
                          fontSize: '1.1rem'
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Enhanced CTA Section */}
          <Box sx={{ 
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            position: 'relative'
          }}>
            <Paper
              sx={{
                p: { xs: 4, md: 8 },
                background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(255, 107, 139, 0.1) 100%)',
                backdropFilter: 'blur(30px)',
                border: '2px solid rgba(78, 205, 196, 0.2)',
                borderRadius: 6,
                position: 'relative',
                overflow: 'hidden',
                animation: 'slideUp 1s ease-out both',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  left: -50,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
                  animation: 'float 8s ease-in-out infinite',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  right: -30,
                  width: 60,
                  height: 60,
                  background: 'radial-gradient(circle, rgba(255, 107, 139, 0.3) 0%, transparent 70%)',
                  animation: 'float 6s ease-in-out infinite reverse',
                }
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Get Started?
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 6,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Join thousands of organizations already using TrustChain's 
                Universal Verification Infrastructure.
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<VerifiedIcon />}
                  onClick={() => navigate('/universal')}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    px: 5,
                    py: 2,
                    background: 'linear-gradient(45deg, #4ECDC4 0%, #45B7D1 100%)',
                    boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(78, 205, 196, 0.6)',
                    }
                  }}
                >
                  Build Trust Infrastructure
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FlareIcon />}
                  onClick={() => navigate('/universal-demo')}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    px: 5,
                    py: 2,
                    color: '#FFEAA7',
                    borderColor: '#FFEAA7',
                    borderWidth: 2,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 234, 167, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: '#FFEAA7',
                      background: 'rgba(255, 234, 167, 0.2)',
                      boxShadow: '0 10px 30px rgba(255, 234, 167, 0.3)',
                    }
                  }}
                >
                  View Live Demo
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  onClick={() => navigate('/playground')}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    px: 5,
                    py: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  🌐 Mainnet Playground
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
