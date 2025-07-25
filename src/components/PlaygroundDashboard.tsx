import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grow
} from '@mui/material';
import {
  Verified,
  School,
  Speed,
  TrendingUp,
  NetworkCheck,
  Security,
  QrCodeScanner,
  Add,
  Refresh
} from '@mui/icons-material';
import { enhancedBlockchainService } from '../services/playgroundService';
import { glassmorphismStyles } from '../styles/glassmorphism';

interface PlaygroundDashboardProps {}

const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = () => {
  const [networkMetrics, setNetworkMetrics] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [credentialId, setCredentialId] = useState('');
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);
  const [showIssuanceDialog, setShowIssuanceDialog] = useState(false);
  const [newCredentialData, setNewCredentialData] = useState({
    studentName: '',
    institution: '',
    degree: '',
    graduationDate: '',
    gpa: ''
  });

  useEffect(() => {
    loadNetworkMetrics();
    
    // Subscribe to real-time updates
    const unsubscribe = enhancedBlockchainService.subscribeToUpdates((update) => {
      setRealtimeUpdates(prev => [update, ...prev.slice(0, 9)]);
    });

    return unsubscribe;
  }, []);

  const loadNetworkMetrics = async () => {
    try {
      const metrics = await enhancedBlockchainService.getNetworkStatus();
      setNetworkMetrics(metrics);
    } catch (error) {
      console.error('Failed to load network metrics:', error);
    }
  };

  const handleVerifyCredential = async () => {
    if (!credentialId.trim()) return;
    
    setIsVerifying(true);
    try {
      const result = await enhancedBlockchainService.verifyCredential(credentialId);
      setVerificationResult(result);
    } catch (error: any) {
      setVerificationResult({ error: error.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleIssueCredential = async () => {
    setIsIssuing(true);
    try {
      const result = await enhancedBlockchainService.issueCredential(newCredentialData);
      setShowIssuanceDialog(false);
      setNewCredentialData({
        studentName: '', institution: '', degree: '', graduationDate: '', gpa: ''
      });
      alert(`Credential issued successfully! ID: ${result.credential.id}`);
      loadNetworkMetrics(); // Refresh metrics
    } catch (error: any) {
      alert(`Failed to issue credential: ${error.message}`);
    } finally {
      setIsIssuing(false);
    }
  };

  const loadSampleCredential = () => {
    const sampleIds = enhancedBlockchainService.getSampleCredentials();
    const randomId = sampleIds[Math.floor(Math.random() * sampleIds.length)];
    setCredentialId(randomId);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: 'white' }}>
          🌐 TrustChain Mainnet Playground
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Experience real-time blockchain credential verification on Internet Computer
        </Typography>
        <Chip
          icon={<NetworkCheck />}
          label="Connected to IC Mainnet Simulation"
          color="success"
          variant="outlined"
          sx={{ 
            borderColor: 'rgba(76, 175, 80, 0.5)',
            color: 'rgba(76, 175, 80, 1)',
            bgcolor: 'rgba(76, 175, 80, 0.1)'
          }}
        />
      </Box>

      {/* Network Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {networkMetrics && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={glassmorphismStyles.primaryGlass}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Verified sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {networkMetrics.totalCredentialsIssued.toLocaleString()}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Total Credentials
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={glassmorphismStyles.primaryGlass}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Speed sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {networkMetrics.avgBlockTime}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Avg Block Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={glassmorphismStyles.primaryGlass}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {networkMetrics.verificationSuccessRate.toFixed(2)}%
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Success Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={glassmorphismStyles.primaryGlass}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Security sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {networkMetrics.blockHeight.toLocaleString()}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Block Height
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Credential Verification */}
        <Grid item xs={12} md={8}>
          <Card sx={glassmorphismStyles.primaryGlass}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>
                <QrCodeScanner sx={{ mr: 1, verticalAlign: 'middle' }} />
                Verify Academic Credential
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="Enter credential ID (e.g., cred_IC_0x1a2b3c4d5e6f7890)"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#2196f3' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={loadSampleCredential}
                  sx={{ 
                    minWidth: 120,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                  }}
                >
                  Sample
                </Button>
              </Box>

              <Button
                variant="contained"
                onClick={handleVerifyCredential}
                disabled={isVerifying || !credentialId.trim()}
                startIcon={isVerifying ? <CircularProgress size={20} /> : <Verified />}
                sx={{ 
                  mb: 3,
                  bgcolor: '#2196f3',
                  '&:hover': { bgcolor: '#1976d2' }
                }}
              >
                {isVerifying ? 'Verifying on Mainnet...' : 'Verify Credential'}
              </Button>

              {verificationResult && (
                <Fade in={!!verificationResult}>
                  <Box>
                    {verificationResult.error ? (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {verificationResult.error}
                      </Alert>
                    ) : (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        ✅ Credential verified successfully on IC Mainnet!
                      </Alert>
                    )}
                    
                    {!verificationResult.error && (
                      <Card sx={{ ...glassmorphismStyles.secondaryGlass, mt: 2 }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            📄 Credential Details
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                <strong>Student:</strong> {verificationResult.studentName}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                <strong>Institution:</strong> {verificationResult.institution}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                <strong>Degree:</strong> {verificationResult.degree}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                <strong>GPA:</strong> {verificationResult.gpa}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                <strong>Block Height:</strong> {verificationResult.blockHeight?.toLocaleString()}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                <strong>Network Fees:</strong> {verificationResult.verificationResult?.networkFees} ICP
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>

          {/* Issue New Credential */}
          <Card sx={{ ...glassmorphismStyles.primaryGlass, mt: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>
                <Add sx={{ mr: 1, verticalAlign: 'middle' }} />
                Issue New Credential
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowIssuanceDialog(true)}
                startIcon={<School />}
                sx={{ 
                  bgcolor: '#4caf50',
                  '&:hover': { bgcolor: '#388e3c' }
                }}
              >
                Issue Academic Credential
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Updates */}
        <Grid item xs={12} md={4}>
          <Card sx={glassmorphismStyles.primaryGlass}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                  📡 Live Network Activity
                </Typography>
                <Button
                  size="small"
                  onClick={loadNetworkMetrics}
                  startIcon={<Refresh />}
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Refresh
                </Button>
              </Box>
              
              <List>
                {realtimeUpdates.map((update, index) => (
                  <Grow in key={index} timeout={300}>
                    <ListItem sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      borderRadius: 1, 
                      mb: 1,
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <ListItemIcon>
                        {update.type === 'credential_verified' && <Verified sx={{ color: '#4caf50' }} />}
                        {update.type === 'network_update' && <NetworkCheck sx={{ color: '#2196f3' }} />}
                        {update.type === 'institution_activity' && <School sx={{ color: '#ff9800' }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>
                            {update.type === 'credential_verified' && `New verification: ${update.data.institution}`}
                            {update.type === 'network_update' && `Block ${update.data.blockHeight}`}
                            {update.type === 'institution_activity' && `${update.data.institutionName} activity`}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                            {new Date(update.data.timestamp).toLocaleTimeString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grow>
                ))}
                {realtimeUpdates.length === 0 && (
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 2 }}>
                    Listening for network updates...
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Credential Issuance Dialog */}
      <Dialog 
        open={showIssuanceDialog} 
        onClose={() => setShowIssuanceDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            ...glassmorphismStyles.primaryGlass,
            bgcolor: 'rgba(30, 41, 59, 0.95)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          🎓 Issue New Academic Credential
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Student Name"
              value={newCredentialData.studentName}
              onChange={(e) => setNewCredentialData(prev => ({ ...prev, studentName: e.target.value }))}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              label="Institution"
              value={newCredentialData.institution}
              onChange={(e) => setNewCredentialData(prev => ({ ...prev, institution: e.target.value }))}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              label="Degree"
              value={newCredentialData.degree}
              onChange={(e) => setNewCredentialData(prev => ({ ...prev, degree: e.target.value }))}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              label="Graduation Date"
              type="date"
              value={newCredentialData.graduationDate}
              onChange={(e) => setNewCredentialData(prev => ({ ...prev, graduationDate: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              label="GPA"
              value={newCredentialData.gpa}
              onChange={(e) => setNewCredentialData(prev => ({ ...prev, gpa: e.target.value }))}
              fullWidth
              placeholder="e.g., 3.85/4.0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowIssuanceDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleIssueCredential}
            variant="contained"
            disabled={isIssuing || !newCredentialData.studentName || !newCredentialData.institution}
            startIcon={isIssuing ? <CircularProgress size={20} /> : <Add />}
            sx={{ 
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#388e3c' }
            }}
          >
            {isIssuing ? 'Issuing...' : 'Issue Credential'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlaygroundDashboard;
