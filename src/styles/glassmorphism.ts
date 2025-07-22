// Glassmorphism design system for TrustChain
import { SxProps, Theme } from '@mui/material/styles';

export const glassmorphismStyles = {
  // Primary glass card
  primaryGlass: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  } as SxProps<Theme>,

  // Secondary glass card (slightly more transparent)
  secondaryGlass: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
  } as SxProps<Theme>,

  // Strong glass (more opaque)
  strongGlass: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
  } as SxProps<Theme>,

  // Text colors for glass components
  primaryText: {
    color: 'white',
  } as SxProps<Theme>,

  secondaryText: {
    color: 'rgba(255, 255, 255, 0.9)',
  } as SxProps<Theme>,

  mutedText: {
    color: 'rgba(255, 255, 255, 0.7)',
  } as SxProps<Theme>,

  subtleText: {
    color: 'rgba(255, 255, 255, 0.6)',
  } as SxProps<Theme>,

  // Hover effects
  glassHover: {
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease',
    }
  } as SxProps<Theme>,

  // Interactive glass elements
  interactiveGlass: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-4px)',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
    }
  } as SxProps<Theme>,
};

// Helper functions for applying glassmorphism styles
export const applyGlassmorphism = (variant: keyof typeof glassmorphismStyles = 'primaryGlass') => {
  return glassmorphismStyles[variant];
};

// Combined styles for common patterns
export const glassCard = {
  ...glassmorphismStyles.primaryGlass,
  p: 3,
  position: 'relative',
  overflow: 'hidden',
} as SxProps<Theme>;

export const glassCardWithHover = {
  ...glassmorphismStyles.primaryGlass,
  ...glassmorphismStyles.glassHover,
  p: 3,
  position: 'relative',
  overflow: 'hidden',
} as SxProps<Theme>;

// Chart container glass styling
export const glassChartContainer = {
  ...glassmorphismStyles.primaryGlass,
  p: 3,
  height: { xs: 300, md: 350 },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #4ECDC4, #45B7D1, #F7B731)',
  }
} as SxProps<Theme>;
