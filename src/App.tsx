import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Snackbar,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import { 
  GetApp as InstallIcon,
  Update as UpdateIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { 
  HomePage, 
  StudentDashboard, 
  InstitutionDashboard, 
  VerifyCredential, 
  Navigation,
  LogoutButton,
  MobileLayout,
  EnhancedStudentDashboard
} from './components';
import PlaygroundDashboard from './components/PlaygroundDashboard';
import UniversalDashboard from './components/UniversalDashboard';
import UniversalDemo from './components/UniversalDemo';
import pwaService from './services/pwa';
import PerformanceMonitorService from './services/performanceMonitor';
import { RealtimeProvider } from './contexts/RealtimeContext';
import RealtimeDashboard from './components/RealtimeDashboard';
import { IC_CONFIG, USE_PRODUCTION } from './config/ic-config';

// Create beautiful theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#8b9bff',
      dark: '#3f51b5',
    },
    secondary: {
      main: '#764ba2',
      light: '#a477d3',
      dark: '#4a2873',
    },
    background: {
      default: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

function App() {
  // Authentication state
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // PWA state
  const [pwaCapabilities, setPwaCapabilities] = useState(pwaService.getCapabilities());
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [performanceMonitor] = useState(new PerformanceMonitorService({
    pageLoad: 2000,
    apiCall: 3000,
    componentRender: 50
  }));

  // Initialize AuthClient on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const startTime = performance.now();
        
        const client = await AuthClient.create();
        setAuthClient(client);

        // Check if user is already authenticated
        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();
          setIdentity(identity);
          setPrincipal(principal);
          console.log('User authenticated with principal:', principal.toText());
        }

        // Track authentication performance
        const duration = performance.now() - startTime;
        performanceMonitor.measureComponentRender('auth-initialization', () => {});
        
      } catch (error) {
        console.error('Error initializing auth client:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [performanceMonitor]);

  // PWA setup
  useEffect(() => {
    // Set up PWA event listeners
    const unsubscribeInstall = pwaService.onInstallAvailable(() => {
      setShowInstallPrompt(true);
      setPwaCapabilities(pwaService.getCapabilities());
    });

    const unsubscribeUpdate = pwaService.onUpdateAvailable((info) => {
      setUpdateInfo(info);
      setShowUpdateDialog(true);
    });

    const unsubscribeOnline = pwaService.onOnline(() => {
      setIsOnline(true);
    });

    const unsubscribeOffline = pwaService.onOffline(() => {
      setIsOnline(false);
    });

    // Performance monitoring alerts
    const unsubscribePerformance = performanceMonitor.onAlert((alert) => {
      console.warn('[Performance Alert]:', alert);
      // You could show user notifications for critical performance issues
    });

    return () => {
      unsubscribeInstall();
      unsubscribeUpdate();
      unsubscribeOnline();
      unsubscribeOffline();
      unsubscribePerformance();
    };
  }, [performanceMonitor]);

  // Handle login
  const handleLogin = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      
      // Request login with Internet Identity
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider: 'https://identity.ic0.app',
          onSuccess: resolve,
          onError: reject,
        });
      });

      // Update authentication state
      const authenticated = await authClient.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        setIdentity(identity);
        setPrincipal(principal);
        console.log('Login successful! Principal:', principal.toText());
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout - clears Principal state
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal(null);
    console.log('User logged out, state cleared');
  };

  // Show loading spinner during initialization
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress sx={{ color: 'white' }} size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }
          }}
        >
          <AppBar 
            position="static" 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minHeight: { xs: 56, sm: 64 }
            }}
          >
            <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
              <SchoolIcon sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 28, sm: 32 } }} />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 800,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                TrustChain
              </Typography>
              <Button
                variant="contained"
                startIcon={<LoginIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                onClick={handleLogin}
                disabled={loading}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  px: { xs: 1.5, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontWeight: 'bold',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  boxShadow: '0 4px 20px rgba(254, 107, 139, 0.4)',
                  '&:hover': { 
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                    boxShadow: '0 6px 25px rgba(254, 107, 139, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease',
                  // Mobile-specific responsive text
                  '& .MuiButton-startIcon': {
                    marginRight: { xs: 0.5, sm: 1 }
                  }
                }}
              >
                <Box component="span" sx={{ 
                  display: { xs: 'none', sm: 'inline' } 
                }}>
                  {loading ? 'Connecting...' : 'Login with Internet Identity'}
                </Box>
                <Box component="span" sx={{ 
                  display: { xs: 'inline', sm: 'none' } 
                }}>
                  {loading ? 'Connecting...' : 'Login'}
                </Box>
              </Button>
            </Toolbar>
          </AppBar>
          
          <HomePage />
        </Box>
      </ThemeProvider>
    );
  }

  // PWA handlers
  const handleInstallApp = async () => {
    const installed = await pwaService.installApp();
    if (installed) {
      setShowInstallPrompt(false);
      setPwaCapabilities(pwaService.getCapabilities());
    }
  };

  const handleUpdateApp = async () => {
    await pwaService.updateApp();
    setShowUpdateDialog(false);
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <StudentDashboard principal={principal} identity={identity} />;
      case 'credentials':
        return <StudentDashboard principal={principal} identity={identity} />;
      case 'verify':
        return <VerifyCredential />;
      case 'analytics':
        return <StudentDashboard principal={principal} identity={identity} />;
      default:
        return <StudentDashboard principal={principal} identity={identity} />;
    }
  };

  // Main authenticated app
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {isMobile ? (
        <MobileLayout
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          notifications={5}
          isOnline={isOnline}
        >
          {renderMainContent()}
        </MobileLayout>
      ) : (
        <Box 
          sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }
          }}
        >
          <AppBar 
            position="static" 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Toolbar>
              <SchoolIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'opaque'
                }}
              >
                TrustChain
                {USE_PRODUCTION && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      ml: 1, 
                      px: 1, 
                      py: 0.5, 
                      bgcolor: 'success.main', 
                      color: 'white', 
                      borderRadius: 1,
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  >
                    🚀 PRODUCTION
                  </Typography>
                )}
              </Typography>
              
              {/* Production Status */}
              {USE_PRODUCTION && (
                <Box
                  sx={{
                    mr: 2,
                    px: 1,
                    py: 0.5,
                    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                    borderRadius: 1,
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  IC Mainnet
                </Box>
              )}
              
              {/* Connection Status */}
              <IconButton sx={{ mr: 1 }}>
                {isOnline ? (
                  <OnlineIcon sx={{ color: '#4ade80' }} />
                ) : (
                  <OfflineIcon sx={{ color: '#f59e0b' }} />
                )}
              </IconButton>
              
              {/* Display user's principal */}
              {principal && (
                <Box
                  sx={{
                    mr: 2,
                    px: 2,
                    py: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'monospace' }}>
                    {principal.toText().slice(0, 8)}...{principal.toText().slice(-4)}
                  </Typography>
                </Box>
              )}
              
              <Navigation />
              
              {/* Logout button */}
              <Box sx={{ ml: 2 }}>
                <LogoutButton authClient={authClient} onLogout={handleLogout} />
              </Box>
            </Toolbar>
          </AppBar>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/universal" element={
              <UniversalDashboard
                organization={{
                  id: 'universal-demo',
                  name: 'Universal Platform',
                  type: 'corporation',
                  industry: 'Technology',
                  verified: true,
                  trustScore: 95,
                  contact: {
                    email: 'contact@universal.trustchain.io',
                    phone: '+1 (555) 123-4567',
                    website: 'https://universal.trustchain.io',
                    address: '123 Innovation Drive, Tech City, TC 12345'
                  },
                  settings: {
                    allowCrossVerification: true,
                    publicProfile: true,
                    apiAccess: true,
                    webhookUrl: 'https://universal.trustchain.io/webhook'
                  },
                  subscription: {
                    plan: 'professional',
                    maxTrustBoards: 100,
                    maxRecords: 10000,
                    maxVerifications: 50000,
                    customBranding: true
                  },
                  createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
                  lastActive: Date.now()
                }}
                credentials={[]}
                profileCompleteness={85}
                credentialChartData={{}}
                skillGrowthData={{}}
                marketDemandData={{}}
                careerInsights={[]}
                onShareToSocial={(platform: string) => console.log(`Sharing to ${platform}`)}
              />
            } />
            <Route path="/universal-demo" element={<UniversalDemo />} />
            <Route path="/student" element={<StudentDashboard principal={principal} identity={identity} />} />
            <Route path="/institution" element={<InstitutionDashboard principal={principal} identity={identity} />} />
            <Route path="/verify" element={<VerifyCredential />} />
            <Route path="/realtime" element={<RealtimeDashboard />} />
            <Route path="/playground" element={<PlaygroundDashboard />} />
          </Routes>
        </Box>
      )}

      {/* PWA Install Prompt */}
      <Snackbar
        open={showInstallPrompt && pwaCapabilities.isInstallable}
        autoHideDuration={10000}
        onClose={() => setShowInstallPrompt(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          action={
            <>
              <Button color="inherit" size="small" onClick={handleInstallApp}>
                Install
              </Button>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setShowInstallPrompt(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          Install TrustChain as a PWA for a better experience!
        </Alert>
      </Snackbar>

      {/* PWA Update Dialog */}
      <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <UpdateIcon />
            App Update Available
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            A new version of TrustChain is available with improvements and new features.
            {updateInfo?.releaseNotes && (
              <Box sx={{ mt: 1, p: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                {updateInfo.releaseNotes}
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>Later</Button>
          <Button onClick={handleUpdateApp} variant="contained">
            Update Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Install FAB for mobile */}
      {isMobile && pwaCapabilities.isInstallable && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 160,
            left: 16,
            background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)'
          }}
          onClick={handleInstallApp}
        >
          <InstallIcon />
        </Fab>
      )}
    </ThemeProvider>
  );
}

// Export App wrapped with RealtimeProvider
export default function WrappedApp() {
  return (
    <RealtimeProvider>
      <App />
    </RealtimeProvider>
  );
}
