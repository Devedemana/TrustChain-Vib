import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Fade,
  Grid,
  Container
} from '@mui/material';
import { 
  Visibility, 
  Share, 
  Download, 
  QrCode2, 
  ViewList,
  EmojiEvents,
  Verified,
  Security,
  CloudDownload
} from '@mui/icons-material';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import { Credential, CredentialMetadata } from '../types';
import { getTrustChainService } from '../services/serviceSelector';
import CredentialQRGenerator from './CredentialQRGenerator';

interface StudentDashboardProps {
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
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
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

const StudentDashboard: React.FC<StudentDashboardProps> = ({ principal, identity }) => {
  const [tabValue, setTabValue] = useState(0);
  const [studentId, setStudentId] = useState('student_123');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCredentialForQR, setSelectedCredentialForQR] = useState<string>('');

  const trustChainService = getTrustChainService();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const loadCredentials = async () => {
    if (!studentId.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await trustChainService.getStudentCredentials(studentId);
      if (response.success && response.data) {
        setCredentials(response.data);
      } else {
        setError('Failed to load credentials');
        setCredentials([]);
      }
    } catch (error) {
      setError('Network error occurred');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, [studentId]);

  const handleViewCredential = (credential: Credential) => {
    setSelectedCredential(credential);
    setOpenDialog(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getCredentialTypeColor = (type: string) => {
    switch (type) {
      case 'certificate': return 'success';
      case 'transcript': return 'primary';
      case 'badge': return 'secondary';
      default: return 'default';
    }
  };

  const parseMetadata = (metadataString: string): CredentialMetadata => {
    try {
      return JSON.parse(metadataString);
    } catch {
      return {};
    }
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
        top: '20%',
        right: '10%',
        width: 200,
        height: 200,
        background: 'linear-gradient(45deg, rgba(78, 205, 196, 0.1), rgba(69, 183, 209, 0.1))',
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        animation: 'morphing 8s ease-in-out infinite, float 6s ease-in-out infinite',
        zIndex: 0,
        '@keyframes morphing': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' }
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
                  background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, transparent 50%)',
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
                    background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                    animation: 'glow 3s ease-in-out infinite',
                    '@keyframes glow': {
                      '0%, 100%': { boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)' },
                      '50%': { boxShadow: '0 0 40px rgba(78, 205, 196, 0.6)' }
                    }
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 30, color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Student Dashboard
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.2rem' }
                    }}
                  >
                    View and manage your academic credentials
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  label="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  variant="outlined"
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'rgba(78, 205, 196, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(78, 205, 196, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#4ECDC4', borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#4ECDC4' }
                  }}
                />
                
                <Button 
                  variant="contained" 
                  onClick={loadCredentials}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Verified />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45B7D1, #4ECDC4)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Loading...' : 'Load Credentials'}
                </Button>
              </Box>
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
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minHeight: 60,
                    '&.Mui-selected': {
                      color: '#4ECDC4',
                      background: 'rgba(78, 205, 196, 0.1)'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab 
                  icon={<ViewList />} 
                  label="My Credentials" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<QrCode2 />} 
                  label="Generate QR Code" 
                  iconPosition="start"
                />
              </Tabs>
            </Paper>
          </Fade>

          {/* Enhanced Content Area */}
          <Paper 
            elevation={0}
            sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '0 0 16px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: 'none',
              minHeight: '500px'
            }}
          >
        {/* Credentials List Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            )}

            <TableContainer 
              component={Paper} 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(10px)',
                color: 'white'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Institution</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Issue Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {credentials.map((credential) => (
                    <TableRow key={credential.id}>
                      <TableCell sx={{ color: 'white' }}>{credential.institution}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{credential.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={credential.credentialType} 
                          color={getCredentialTypeColor(credential.credentialType) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>{formatDate(credential.issueDate)}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleViewCredential(credential)}
                          sx={{ color: 'white' }}
                          title="View Details"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          sx={{ color: 'white' }}
                          title="Share"
                        >
                          <Share />
                        </IconButton>
                        <IconButton 
                          onClick={() => {
                            setSelectedCredentialForQR(credential.id);
                            setTabValue(1);
                          }}
                          sx={{ color: 'white' }}
                          title="Generate QR Code"
                        >
                          <QrCode2 />
                        </IconButton>
                        <IconButton 
                          sx={{ color: 'white' }}
                          title="Download"
                        >
                          <Download />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* QR Generator Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <CredentialQRGenerator 
              credentialId={selectedCredentialForQR}
            />
            
            {credentials.length > 0 && (
              <Paper 
                elevation={0}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  p: 3,
                  mt: 3,
                  color: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Quick Select
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                  Select one of your credentials to generate a QR code:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {credentials.map((credential) => (
                    <Chip
                      key={credential.id}
                      label={`${credential.title} (${credential.institution})`}
                      onClick={() => setSelectedCredentialForQR(credential.id)}
                      color={selectedCredentialForQR === credential.id ? 'primary' : 'default'}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        </TabPanel>
      </Paper>
        </Box>
      </Container>

      {/* Credential Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Credential Details</DialogTitle>
        <DialogContent>
          {selectedCredential && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedCredential.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Issued by: {selectedCredential.institution}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Issue Date: {formatDate(selectedCredential.issueDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Verification Hash: {selectedCredential.verificationHash}
              </Typography>
              
              {/* Display parsed metadata */}
              {(() => {
                const metadata = parseMetadata(selectedCredential.metadata);
                return (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Additional Information:
                    </Typography>
                    {metadata.gpa && (
                      <Typography variant="body2" color="text.secondary">
                        GPA: {metadata.gpa}
                      </Typography>
                    )}
                    {metadata.honors && metadata.honors.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Honors: {metadata.honors.join(', ')}
                      </Typography>
                    )}
                    {metadata.skillsVerified && metadata.skillsVerified.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Skills: {metadata.skillsVerified.join(', ')}
                      </Typography>
                    )}
                    {metadata.courses && metadata.courses.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Courses: {metadata.courses.join(', ')}
                      </Typography>
                    )}
                    {metadata.issuerContact && (
                      <Typography variant="body2" color="text.secondary">
                        Issuer Contact: {metadata.issuerContact}
                      </Typography>
                    )}
                  </Box>
                );
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button 
            onClick={() => {
              if (selectedCredential) {
                setSelectedCredentialForQR(selectedCredential.id);
                setTabValue(1);
                setOpenDialog(false);
              }
            }}
            variant="contained"
          >
            Generate QR Code
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;
