import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  SwipeableDrawer,
  Chip,
  Card,
  CardContent,
  Box,
  Badge,
  Avatar,
  useTheme,
  useMediaQuery,
  Slide,
  Zoom,
  Collapse,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  LinearProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ViewList as TrustBoardsIcon,
  Security as TrustGatesIcon,
  AccountTree as TrustBridgeIcon,
  Analytics as AnalyticsIcon,
  Api as ApiIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  QrCodeScanner as QrScannerIcon,
  CameraAlt as CameraIcon,
  Share as ShareIcon,
  CloudSync as CloudSyncIcon,
  WifiOff as OfflineIcon,
  SignalWifi4Bar as OnlineIcon,
  TouchApp as TouchIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  notifications?: number;
  isOnline?: boolean;
  syncProgress?: number;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
  notifications = 0,
  isOnline = true,
  syncProgress
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string>('');
  const [touchStartY, setTouchStartY] = useState(0);
  const [pullToRefresh, setPullToRefresh] = useState(false);
  const [refreshThreshold] = useState(100);

  const pages = [
    // { id: 'dashboard', label: 'Command Center', icon: DashboardIcon },
    { id: 'trustboards', label: 'TrustBoards', icon: TrustBoardsIcon },
    { id: 'trustgates', label: 'TrustGates', icon: TrustGatesIcon },
    { id: 'trustbridge', label: 'TrustBridge', icon: TrustBridgeIcon },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { id: 'api', label: 'API & Widgets', icon: ApiIcon }
  ];

  const speedDialActions = [
    { icon: <AddIcon />, name: 'Create TrustBoard', action: 'create' },
    { icon: <SearchIcon />, name: 'Verify Records', action: 'verify' },
    { icon: <ShareIcon />, name: 'Share Board', action: 'share' },
    { icon: <CloudSyncIcon />, name: 'Sync Data', action: 'sync' }
  ];

  // Swipe handlers for navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = pages.findIndex(p => p.id === currentPage);
      if (currentIndex < pages.length - 1) {
        onPageChange(pages[currentIndex + 1].id);
        setSwipeDirection('left');
      }
    },
    onSwipedRight: () => {
      const currentIndex = pages.findIndex(p => p.id === currentPage);
      if (currentIndex > 0) {
        onPageChange(pages[currentIndex - 1].id);
        setSwipeDirection('right');
      }
    },
    onSwipedDown: () => {
      if (window.scrollY === 0) {
        triggerRefresh();
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50
  });

  // Pull-to-refresh functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0) return;

    const touchY = e.touches[0].clientY;
    const pullDistance = touchY - touchStartY;

    if (pullDistance > 0 && pullDistance < refreshThreshold * 2) {
      setPullToRefresh(pullDistance > refreshThreshold);
    }
  };

  const handleTouchEnd = () => {
    if (pullToRefresh) {
      triggerRefresh();
    }
    setPullToRefresh(false);
    setTouchStartY(0);
  };

  const triggerRefresh = () => {
    // Trigger app refresh/sync
    window.location.reload();
  };

  const handleSpeedDialAction = (action: string) => {
    switch (action) {
      case 'scan':
        // Open QR scanner
        break;
      case 'camera':
        // Open camera
        break;
      case 'share':
        // Open share dialog
        break;
      case 'sync':
        // Trigger manual sync
        break;
    }
    setSpeedDialOpen(false);
  };

  // Haptic feedback for mobile devices
  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  if (!isMobile) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Desktop layout */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              background: 'linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white'
            }
          }}
        >
          <Toolbar />
          <List>
            {pages.map((page) => (
              <ListItem
                button
                key={page.id}
                selected={currentPage === page.id}
                onClick={() => onPageChange(page.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <page.icon />
                </ListItemIcon>
                <ListItemText primary={page.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        overflow: 'hidden'
      }}
      {...swipeHandlers}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <Collapse in={pullToRefresh}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: theme.palette.primary.main,
            color: 'white',
            textAlign: 'center',
            py: 1
          }}
        >
          <Typography variant="body2">Release to refresh</Typography>
        </Box>
      </Collapse>

      {/* Sync progress indicator */}
      {syncProgress !== undefined && syncProgress < 100 && (
        <LinearProgress
          variant="determinate"
          value={syncProgress}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9998
          }}
        />
      )}

      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => {
              setDrawerOpen(true);
              hapticFeedback('light');
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            TrustChain
          </Typography>

          {/* Connection status */}
          <Chip
            icon={isOnline ? <OnlineIcon /> : <OfflineIcon />}
            label={isOnline ? 'Online' : 'Offline'}
            size="small"
            color={isOnline ? 'success' : 'warning'}
            sx={{ mr: 1 }}
          />

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={() => hapticFeedback('medium')}
          >
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        disableSwipeToOpen={false}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white'
          }
        }}
      >
        <Toolbar />
        
        {/* User Profile Section */}
        <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 1,
              background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            TC
          </Avatar>
          <Typography variant="h6">TrustChain User</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            5 Active TrustBoards
          </Typography>
        </Box>

        <List>
          {pages.map((page) => (
            <ListItem
              button
              key={page.id}
              selected={currentPage === page.id}
              onClick={() => {
                onPageChange(page.id);
                setDrawerOpen(false);
                hapticFeedback('light');
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRight: '3px solid white',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <page.icon />
              </ListItemIcon>
              <ListItemText 
                primary={page.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          ))}
          
          <ListItem
            button
            onClick={() => {
              setDrawerOpen(false);
              hapticFeedback('light');
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </SwipeableDrawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8, // Account for app bar
          mb: 7, // Account for bottom navigation
          p: 1,
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ 
              opacity: 0, 
              x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0 
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0 
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ height: '100%' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={currentPage}
        onChange={(event, newValue) => {
          onPageChange(newValue);
          hapticFeedback('light');
        }}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: 'white',
            },
          },
        }}
      >
        {pages.map((page) => (
          <BottomNavigationAction
            key={page.id}
            label={page.label}
            value={page.id}
            icon={<page.icon />}
          />
        ))}
      </BottomNavigation>

      {/* Floating Action Button with Speed Dial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          '& .MuiFab-primary': {
            background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
          },
        }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => {
          setSpeedDialOpen(true);
          hapticFeedback('medium');
        }}
        open={speedDialOpen}
        direction="up"
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              handleSpeedDialAction(action.action);
              hapticFeedback('light');
            }}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        ))}
      </SpeedDial>

      {/* Touch Gestures Helper */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 120,
          left: 16,
          right: 16,
          textAlign: 'center',
          opacity: 0.3,
          pointerEvents: 'none',
          display: swipeDirection ? 'block' : 'none'
        }}
      >
        <Chip
          icon={<TouchIcon />}
          label={`Swipe ${swipeDirection} to navigate`}
          size="small"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default MobileLayout;
