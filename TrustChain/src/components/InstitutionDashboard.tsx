import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Container,
  Avatar,
  Fade,
  Grid
} from '@mui/material';
import { 
  Add,
  Upload,
  QrCode2,
  Token,
  Business,
  Security,
  CloudUpload,
  Badge
} from '@mui/icons-material';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import IssueCredentialForm from './IssueCredentialForm';
import CredentialQRGenerator from './CredentialQRGenerator';
import NFTBadgeMinter from './NFTBadgeMinter';
import CSVUploadProcessor from './CSVUploadProcessor';

interface InstitutionDashboardProps {
  principal: Principal | null;
  identity: Identity | null;
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
      id={`institution-tabpanel-${index}`}
      aria-labelledby={`institution-tab-${index}`}
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

const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({ principal, identity }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        top: '15%',
        left: '5%',
        width: 300,
        height: 300,
        background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.1), rgba(30, 144, 255, 0.1))',
        borderRadius: '50% 60% 70% 40% / 60% 50% 80% 40%',
        animation: 'morphing 10s ease-in-out infinite, float 8s ease-in-out infinite',
        zIndex: 0,
        '@keyframes morphing': {
          '0%, 100%': { borderRadius: '50% 60% 70% 40% / 60% 50% 80% 40%' },
          '50%': { borderRadius: '80% 30% 50% 70% / 40% 80% 30% 60%' }
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(2deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-1deg)' }
        }
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
        zIndex: 0,
        '@keyframes morphing2': {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '50%': { borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%' }
        },
        '@keyframes float2': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' }
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
                    animation: 'glow 3s ease-in-out infinite',
                    '@keyframes glow': {
                      '0%, 100%': { boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)' },
                      '50%': { boxShadow: '0 0 40px rgba(138, 43, 226, 0.6)' }
                    }
                  }}
                >
                  <Business sx={{ fontSize: 30, color: 'white' }} />
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
                    Institution Dashboard
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.2rem' }
                    }}
                  >
                    Issue and manage academic credentials on the blockchain
                  </Typography>
                </Box>
              </Box>
              
              {/* Stats Cards */}
              <Grid container spacing={3}>
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
                      <Security sx={{ fontSize: 40, color: '#8A2BE2', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>247</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Credentials Issued
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
                      <Badge sx={{ fontSize: 40, color: '#1E90FF', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>89</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Active Students
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
                      <QrCode2 sx={{ fontSize: 40, color: '#FF1493', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>156</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        QR Codes Generated
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
                      <Token sx={{ fontSize: 40, color: '#32CD32', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>34</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        NFT Badges Minted
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
                      color: '#8A2BE2',
                      background: 'rgba(138, 43, 226, 0.1)'
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab
                  icon={<Add sx={{ fontSize: 24 }} />}
                  label="Issue Credential"
                />
                <Tab
                  icon={<CloudUpload sx={{ fontSize: 24 }} />}
                  label="Bulk Upload"
                />
                <Tab
                  icon={<QrCode2 sx={{ fontSize: 24 }} />}
                  label="QR Generator"
                />
                <Tab
                  icon={<Token sx={{ fontSize: 24 }} />}
                  label="NFT Badges"
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
                background: 'radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.05) 0%, transparent 50%)',
                zIndex: -1
              }
            }}
          >
            {/* Issue Credential Tab */}
            <TabPanel value={tabValue} index={0}>
              <Fade in timeout={800}>
                <Box sx={{ p: 4 }}>
                  <IssueCredentialForm principal={principal} identity={identity} />
                </Box>
              </Fade>
            </TabPanel>

            {/* Bulk Upload Tab */}
            <TabPanel value={tabValue} index={1}>
              <Fade in timeout={800}>
                <Box sx={{ p: 4 }}>
                  <CSVUploadProcessor principal={principal} identity={identity} />
                </Box>
              </Fade>
            </TabPanel>

            {/* QR Generator Tab */}
            <TabPanel value={tabValue} index={2}>
              <Fade in timeout={800}>
                <Box sx={{ p: 4 }}>
                  <CredentialQRGenerator />
                </Box>
              </Fade>
            </TabPanel>

            {/* NFT Badges Tab */}
            <TabPanel value={tabValue} index={3}>
              <Fade in timeout={800}>
                <Box sx={{ p: 4 }}>
                  <NFTBadgeMinter principal={principal} identity={identity} />
                </Box>
              </Fade>
            </TabPanel>
          </Paper>

          {/* Enhanced Features Card */}
          <Fade in timeout={1400}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: 4,
                mt: 4,
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
                  background: 'linear-gradient(135deg, transparent 0%, rgba(30, 144, 255, 0.05) 100%)',
                  zIndex: -1
                }
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Platform Features
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Chip 
                    label="Single Credential Issuance" 
                    sx={{ 
                      background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.2), rgba(50, 205, 50, 0.1))',
                      color: '#32CD32',
                      border: '1px solid rgba(50, 205, 50, 0.3)',
                      fontWeight: 600,
                      '&:hover': { transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Chip 
                    label="Bulk CSV Upload" 
                    sx={{ 
                      background: 'linear-gradient(45deg, rgba(30, 144, 255, 0.2), rgba(30, 144, 255, 0.1))',
                      color: '#1E90FF',
                      border: '1px solid rgba(30, 144, 255, 0.3)',
                      fontWeight: 600,
                      '&:hover': { transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Chip 
                    label="QR Code Generation" 
                    sx={{ 
                      background: 'linear-gradient(45deg, rgba(255, 20, 147, 0.2), rgba(255, 20, 147, 0.1))',
                      color: '#FF1493',
                      border: '1px solid rgba(255, 20, 147, 0.3)',
                      fontWeight: 600,
                      '&:hover': { transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Chip 
                    label="NFT Badge Minting" 
                    sx={{ 
                      background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(138, 43, 226, 0.1))',
                      color: '#8A2BE2',
                      border: '1px solid rgba(138, 43, 226, 0.3)',
                      fontWeight: 600,
                      '&:hover': { transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Grid>
              </Grid>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  lineHeight: 1.7,
                  fontSize: '1.1rem'
                }}
              >
                Leverage the power of blockchain technology to issue, manage, and verify academic credentials with unprecedented security and transparency. All credentials are immutably stored on the Internet Computer blockchain.
              </Typography>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default InstitutionDashboard;
