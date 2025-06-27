import React from 'react';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthClient } from '@dfinity/auth-client';

interface LogoutButtonProps {
  authClient: AuthClient | null;
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ authClient, onLogout }) => {
  const handleLogout = async () => {
    if (!authClient) return;

    try {
      // Call authClient.logout()
      await authClient.logout();
      
      // Clear Principal state via callback
      onLogout();
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Still refresh on error to ensure clean state
      window.location.reload();
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{
        color: 'white',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.6)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
