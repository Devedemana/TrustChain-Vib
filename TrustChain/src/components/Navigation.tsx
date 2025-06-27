import React from 'react';
import { Button, Box, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  School, 
  Business, 
  VerifiedUser 
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home, color: '#4ECDC4' },
    { path: '/student', label: 'Student', icon: School, color: '#45B7D1' },
    { path: '/institution', label: 'Institution', icon: Business, color: '#8A2BE2' },
    { path: '/verify', label: 'Verify', icon: VerifiedUser, color: '#00FF7F' }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2,
      alignItems: 'center',
      p: 1,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Button
            key={item.path}
            onClick={() => navigate(item.path)}
            startIcon={<IconComponent />}
            sx={{
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              position: 'relative',
              background: isActive 
                ? `linear-gradient(45deg, ${item.color}, ${item.color}88)`
                : 'transparent',
              backdropFilter: isActive ? 'blur(10px)' : 'none',
              border: isActive 
                ? `1px solid ${item.color}44`
                : '1px solid transparent',
              '&:hover': {
                background: isActive 
                  ? `linear-gradient(45deg, ${item.color}, ${item.color}88)`
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: isActive 
                  ? `0 10px 30px ${item.color}44`
                  : '0 8px 25px rgba(255, 255, 255, 0.1)'
              },
              '&::before': isActive ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, ${item.color}22, transparent)`,
                borderRadius: 2,
                zIndex: -1
              } : {},
              transition: 'all 0.3s ease',
              '& .MuiButton-startIcon': {
                color: isActive ? 'white' : item.color,
                transition: 'color 0.3s ease'
              }
            }}
          >
            {item.label}
            {isActive && (
              <Chip
                size="small"
                sx={{
                  ml: 1,
                  height: 20,
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.7rem',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            )}
          </Button>
        );
      })}
    </Box>
  );
};

export default Navigation;
