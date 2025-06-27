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
  useMediaQuery
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { 
  HomePage, 
  StudentDashboard, 
  InstitutionDashboard, 
  VerifyCredential, 
  Navigation,
  LogoutButton 
} from './components';

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

  // Initialize AuthClient on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
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
      } catch (error) {
        console.error('Error initializing auth client:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

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
              </Typography>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                disabled={loading}
                sx={{ 
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(254, 107, 139, 0.4)',
                  '&:hover': { 
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                    boxShadow: '0 6px 25px rgba(254, 107, 139, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Connecting...' : 'Login with Internet Identity'}
              </Button>
            </Toolbar>
          </AppBar>
          
          <HomePage />
        </Box>
      </ThemeProvider>
    );
  }

  // Main authenticated app
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
                color: 'transparent'
              }}
            >
              TrustChain
            </Typography>
            
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
          <Route path="/student" element={<StudentDashboard principal={principal} identity={identity} />} />
          <Route path="/institution" element={<InstitutionDashboard principal={principal} identity={identity} />} />
          <Route path="/verify" element={<VerifyCredential />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
