import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Card,
  CardContent,
  Alert,
  Divider,
  Grid,
  Tabs,
  Tab,
  Container,
  Avatar,
  Fade,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  Search, 
  CheckCircle, 
  Cancel, 
  QrCodeScanner, 
  Keyboard,
  VerifiedUser,
  Security,
  GppGood,
  GppBad,
  Speed
} from '@mui/icons-material';
import VerifyCredentialScanner from './VerifyCredentialScanner';

interface VerificationResult {
  isValid: boolean;
  credential?: {
    id: string;
    studentId: string;
    institution: string;
    credentialType: string;
    title: string;
    issueDate: number;
    verificationHash: string;
    metadata: string;
  };
  message: string;
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
      id={`verify-tabpanel-${index}`}
      aria-labelledby={`verify-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const VerifyCredential: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [credentialId, setCredentialId] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleVerify = async () => {
    if (!credentialId.trim()) return;
    
    setLoading(true);
    
    // Mock verification - in real app, this would query the IC backend
    setTimeout(() => {
      if (credentialId === 'student123_university_2024') {
        setVerificationResult({
          isValid: true,
          credential: {
            id: 'student123_university_2024',
            studentId: 'student123',
            institution: 'Digital University',
            credentialType: 'certificate',
            title: 'Bachelor of Computer Science',
            issueDate: Date.now() - 86400000,
            verificationHash: 'abc123def456',
            metadata: JSON.stringify({ gpa: '3.8', honors: 'Magna Cum Laude' })
          },
          message: 'Credential verified successfully'
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: 'Credential not found or invalid'
        });
      }
      setLoading(false);
    }, 1000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

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
        top: '25%',
        right: '15%',
        width: 250,
        height: 250,
        background: 'linear-gradient(45deg, rgba(0, 255, 127, 0.1), rgba(50, 205, 50, 0.1))',
        borderRadius: '40% 60% 60% 40% / 60% 40% 40% 60%',
        animation: 'morphing 12s ease-in-out infinite, float 7s ease-in-out infinite',
        zIndex: 0,
        '@keyframes morphing': {
          '0%, 100%': { borderRadius: '40% 60% 60% 40% / 60% 40% 40% 60%' },
          '50%': { borderRadius: '60% 40% 40% 60% / 40% 60% 60% 40%' }
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-18px) rotate(1.5deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: 180,
        height: 180,
        background: 'linear-gradient(45deg, rgba(255, 99, 71, 0.1), rgba(255, 165, 0, 0.1))',
        borderRadius: '70% 30% 30% 70% / 30% 70% 70% 30%',
        animation: 'morphing2 9s ease-in-out infinite, float2 5s ease-in-out infinite',
        zIndex: 0,
        '@keyframes morphing2': {
          '0%, 100%': { borderRadius: '70% 30% 30% 70% / 30% 70% 70% 30%' },
          '50%': { borderRadius: '30% 70% 70% 30% / 70% 30% 30% 70%' }
        },
        '@keyframes float2': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' }
        }
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 4 }}>
          
          {/* Enhanced Header Section */}
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
                  background: 'linear-gradient(135deg, rgba(0, 255, 127, 0.1) 0%, transparent 50%)',
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
                    background: 'linear-gradient(45deg, #00FF7F, #32CD32)',
                    animation: 'glow 3s ease-in-out infinite',
                    '@keyframes glow': {
                      '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 127, 0.3)' },
                      '50%': { boxShadow: '0 0 40px rgba(0, 255, 127, 0.6)' }
                    }
                  }}
                >
                  <VerifiedUser sx={{ fontSize: 30, color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #00FF7F, #32CD32)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Verify Credential
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.2rem' }
                    }}
                  >
                    Verify the authenticity of academic credentials on the blockchain
                  </Typography>
                </Box>
              </Box>
              
              {/* Verification Stats */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 127, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0, 255, 127, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <GppGood sx={{ fontSize: 40, color: '#00FF7F', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>1,247</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Verified Credentials
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 99, 71, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(255, 99, 71, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <GppBad sx={{ fontSize: 40, color: '#FF6347', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>23</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Invalid Attempts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 165, 0, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(255, 165, 0, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Speed sx={{ fontSize: 40, color: '#FFA500', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>0.8s</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Avg. Verification Time
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
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minHeight: 60,
                    '&.Mui-selected': {
                      color: '#00FF7F',
                      background: 'rgba(0, 255, 127, 0.1)'
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #00FF7F, #32CD32)',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab
                  icon={<Keyboard sx={{ fontSize: 24 }} />}
                  label="Manual Entry"
                />
                <Tab
                  icon={<QrCodeScanner sx={{ fontSize: 24 }} />}
                  label="QR Scanner"
                />
              </Tabs>
            </Paper>
          </Fade>

          {/* Tab Content Area */}
          <Paper 
            elevation={0}
            sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '0 0 16px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: 'none',
              minHeight: '500px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 20% 80%, rgba(0, 255, 127, 0.03) 0%, transparent 50%)',
                zIndex: -1
              }
            }}
          >
            {/* Manual Entry Tab */}
            <TabPanel value={tabValue} index={0}>
              <Fade in timeout={800}>
                <Box sx={{ p: 4 }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      backdropFilter: 'blur(15px)',
                      borderRadius: 4,
                      p: 4,
                      mb: 3,
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
                        background: 'linear-gradient(135deg, rgba(0, 255, 127, 0.05) 0%, transparent 50%)',
                        zIndex: -1
                      }
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'white',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Security sx={{ mr: 2, color: '#00FF7F' }} />
                      Enter Credential ID
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Credential ID"
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        placeholder="e.g., student123_university_2024"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            '& fieldset': { borderColor: 'rgba(0, 255, 127, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(0, 255, 127, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#00FF7F', borderWidth: 2 }
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#00FF7F' }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleVerify}
                        disabled={loading || !credentialId.trim()}
                        startIcon={loading ? <LinearProgress sx={{ width: 20, height: 2 }} /> : <Search />}
                        sx={{ 
                          minWidth: 140,
                          background: 'linear-gradient(45deg, #00FF7F, #32CD32)',
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #32CD32, #00FF7F)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(0, 255, 127, 0.4)'
                          },
                          '&:disabled': { 
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'none'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </Button>
                    </Box>

                    <Alert 
                      severity="info" 
                      sx={{ 
                        background: 'rgba(0, 255, 127, 0.1)',
                        border: '1px solid rgba(0, 255, 127, 0.3)',
                        color: 'white',
                        '& .MuiAlert-icon': { color: '#00FF7F' }
                      }}
                    >
                      Try using <strong>student123_university_2024</strong> as a sample credential ID
                    </Alert>
                  </Paper>

                  {verificationResult && (
                    <Fade in timeout={600}>
                      <Card sx={{ 
                        background: verificationResult.isValid 
                          ? 'rgba(0, 255, 127, 0.05)' 
                          : 'rgba(255, 99, 71, 0.05)',
                        backdropFilter: 'blur(15px)',
                        border: `1px solid ${verificationResult.isValid 
                          ? 'rgba(0, 255, 127, 0.3)' 
                          : 'rgba(255, 99, 71, 0.3)'}`,
                        borderRadius: 4,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 20px 40px ${verificationResult.isValid 
                            ? 'rgba(0, 255, 127, 0.2)' 
                            : 'rgba(255, 99, 71, 0.2)'}`
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            {verificationResult.isValid ? (
                              <CheckCircle sx={{ 
                                color: '#00FF7F', 
                                mr: 2, 
                                fontSize: 40,
                                animation: 'pulse 2s ease-in-out infinite',
                                '@keyframes pulse': {
                                  '0%, 100%': { transform: 'scale(1)' },
                                  '50%': { transform: 'scale(1.1)' }
                                }
                              }} />
                            ) : (
                              <Cancel sx={{ 
                                color: '#FF6347', 
                                mr: 2, 
                                fontSize: 40,
                                animation: 'shake 0.5s ease-in-out',
                                '@keyframes shake': {
                                  '0%, 100%': { transform: 'translateX(0)' },
                                  '25%': { transform: 'translateX(-5px)' },
                                  '75%': { transform: 'translateX(5px)' }
                                }
                              }} />
                            )}
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                color: 'white',
                                fontWeight: 700,
                                background: verificationResult.isValid 
                                  ? 'linear-gradient(45deg, #00FF7F, #32CD32)'
                                  : 'linear-gradient(45deg, #FF6347, #FFA500)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}
                            >
                              {verificationResult.isValid ? 'Valid Credential' : 'Invalid Credential'}
                            </Typography>
                          </Box>

                          <Alert 
                            severity={verificationResult.isValid ? 'success' : 'error'} 
                            sx={{ 
                              mb: 3,
                              background: verificationResult.isValid 
                                ? 'rgba(0, 255, 127, 0.1)' 
                                : 'rgba(255, 99, 71, 0.1)',
                              border: `1px solid ${verificationResult.isValid 
                                ? 'rgba(0, 255, 127, 0.3)' 
                                : 'rgba(255, 99, 71, 0.3)'}`,
                              color: 'white',
                              '& .MuiAlert-icon': { 
                                color: verificationResult.isValid ? '#00FF7F' : '#FF6347' 
                              }
                            }}
                          >
                            {verificationResult.message}
                          </Alert>

                          {verificationResult.credential && (
                            <Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  color: 'white', 
                                  fontWeight: 600, 
                                  mb: 3,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <VerifiedUser sx={{ mr: 2, color: '#00FF7F' }} />
                                Credential Details
                              </Typography>
                              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                              
                              <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ 
                                    p: 2, 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                      Title
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                      {verificationResult.credential.title}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ 
                                    p: 2, 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                      Institution
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                      {verificationResult.credential.institution}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ 
                                    p: 2, 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                      Student ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                      {verificationResult.credential.studentId}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ 
                                    p: 2, 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                      Issue Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                      {formatDate(verificationResult.credential.issueDate)}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ 
                                    p: 2, 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                      Type
                                    </Typography>
                                    <Chip 
                                      label={verificationResult.credential.credentialType}
                                      sx={{
                                        background: 'linear-gradient(45deg, rgba(0, 255, 127, 0.2), rgba(50, 205, 50, 0.2))',
                                        color: '#00FF7F',
                                        border: '1px solid rgba(0, 255, 127, 0.3)',
                                        fontWeight: 600
                                      }}
                                    />
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ 
                                    p: 2, 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                      Verification Hash
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontFamily: 'monospace', 
                                        wordBreak: 'break-all',
                                        color: '#00FF7F',
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        p: 1,
                                        borderRadius: 1
                                      }}
                                    >
                                      {verificationResult.credential.verificationHash}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>

                              {verificationResult.credential.metadata && (
                                <Box sx={{ mt: 3 }}>
                                  <Paper sx={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    p: 3,
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 255, 127, 0.2)'
                                  }}>
                                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                                      Additional Information
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontFamily: 'monospace',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        p: 2,
                                        borderRadius: 1,
                                        whiteSpace: 'pre-wrap'
                                      }}
                                    >
                                      {JSON.stringify(JSON.parse(verificationResult.credential.metadata), null, 2)}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Fade>
                  )}
                </Box>
              </Fade>
            </TabPanel>

            {/* QR Scanner Tab */}
            <TabPanel value={tabValue} index={1}>
              <Fade in timeout={800}>
                <Box sx={{ p: 4 }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      backdropFilter: 'blur(15px)',
                      borderRadius: 4,
                      p: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, transparent 0%, rgba(0, 255, 127, 0.05) 100%)',
                        zIndex: -1
                      }
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'white',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <QrCodeScanner sx={{ mr: 2, color: '#00FF7F' }} />
                      QR Code Scanner
                    </Typography>
                    <VerifyCredentialScanner />
                  </Paper>
                </Box>
              </Fade>
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifyCredential;
