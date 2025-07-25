import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert, 
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Cloud as CloudIcon,
  CheckCircle as CheckIcon,
  ContentCopy as CopyIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { universalTrustService, getDfxCommands } from '../services/universalTrustService';
import { IC_PRODUCTION_CONFIG, DEPLOYMENT_INFO } from '../config/ic-production';

export const ProductionBackendDemo: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const dfxCommands = getDfxCommands();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const openBackendUrl = () => {
    window.open(IC_PRODUCTION_CONFIG.BACKEND_URL, '_blank');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CloudIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            TrustChain Universal - LIVE on Internet Computer
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Your Universal TrustBoard Infrastructure is Successfully Deployed!
        </Typography>
      </Paper>

      {/* Deployment Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckIcon color="success" />
                Deployment Status
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Canister ID" 
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontFamily="monospace">
                          {DEPLOYMENT_INFO.CANISTER_ID}
                        </Typography>
                        <Tooltip title={copied === 'canister' ? 'Copied!' : 'Copy Canister ID'}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopy(DEPLOYMENT_INFO.CANISTER_ID, 'canister')}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Network" 
                    secondary={DEPLOYMENT_INFO.NETWORK} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={DEPLOYMENT_INFO.STATUS} 
                        color="success" 
                        size="small" 
                      />
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Deployed" 
                    secondary={DEPLOYMENT_INFO.DEPLOYED_AT} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Backend Access
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Backend URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    fontFamily="monospace" 
                    sx={{ 
                      backgroundColor: 'grey.100', 
                      p: 1, 
                      borderRadius: 1,
                      flex: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {IC_PRODUCTION_CONFIG.BACKEND_URL}
                  </Typography>
                  <Tooltip title="Copy URL">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(IC_PRODUCTION_CONFIG.BACKEND_URL, 'url')}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open Backend">
                    <IconButton size="small" onClick={openBackendUrl}>
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                onClick={openBackendUrl}
                startIcon={<LaunchIcon />}
                fullWidth
              >
                Open Backend Interface
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🚀 Enabled Features
          </Typography>
          <Grid container spacing={1}>
            {DEPLOYMENT_INFO.FEATURES_ENABLED.map((feature, index) => (
              <Grid item key={index}>
                <Chip 
                  label={feature} 
                  variant="outlined" 
                  size="small" 
                  color="primary"
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* DFX Commands */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🛠️ Test Your Backend with DFX Commands
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Copy and paste these commands in your terminal to interact with your live backend
          </Alert>

          {Object.entries(dfxCommands).map(([name, command], index) => (
            <Box key={name} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                {name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 1,
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography 
                  variant="body2" 
                  fontFamily="monospace" 
                  sx={{ flex: 1, fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}
                >
                  {command}
                </Typography>
                <Tooltip title={copied === name ? 'Copied!' : 'Copy Command'}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy(command, name)}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {index < Object.entries(dfxCommands).length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🎯 Next Steps
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="1. Test Basic Functions"
                secondary="Run 'getSystemInfo' and 'initializeTestData' commands to verify your backend"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Create Your First TrustBoard"
                secondary="Use the 'createHealthcareTrustBoard' command as an example"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Add Records and Test Verification"
                secondary="Add test records and verify them using the TrustGate engine"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Integrate with Frontend"
                secondary="Connect your React components to the live backend for full functionality"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};
