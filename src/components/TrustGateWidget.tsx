import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Grid,
  Paper,
  Divider,
  Fade,
  useTheme
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { TrustGateQuery, TrustGateResponse } from '../types/trustgate';
import { UniversalTrustService } from '../services/universalTrust';

interface TrustGateWidgetProps {
  boardId?: string;
  organizationId?: string;
  title?: string;
  placeholder?: string;
  style?: 'default' | 'minimal' | 'modern';
  size?: 'small' | 'medium' | 'large';
  showMetadata?: boolean;
  anonymousMode?: boolean;
  onVerificationComplete?: (result: TrustGateResponse) => void;
}

const TrustGateWidget: React.FC<TrustGateWidgetProps> = ({
  boardId,
  organizationId,
  title = 'Universal Verification',
  placeholder = 'Enter your verification query...',
  style = 'default',
  size = 'medium',
  showMetadata = true,
  anonymousMode = false,
  onVerificationComplete
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrustGateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const universalService = UniversalTrustService.getInstance();

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { cardPadding: 2, fontSize: 'body2', buttonSize: 'small' as const, textFieldSize: 'small' as const };
      case 'large':
        return { cardPadding: 4, fontSize: 'h6', buttonSize: 'large' as const, textFieldSize: 'medium' as const };
      default:
        return { cardPadding: 3, fontSize: 'body1', buttonSize: 'medium' as const, textFieldSize: 'medium' as const };
    }
  };

  const getStyleProps = () => {
    switch (style) {
      case 'minimal':
        return {
          elevation: 0,
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: 1
        };
      case 'modern':
        return {
          elevation: 8,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`
        };
      default:
        return { elevation: 2, borderRadius: 2 };
    }
  };

  const sizeProps = getSizeProps();
  const styleProps = getStyleProps();

  const handleVerification = async () => {
    if (!query.trim()) {
      setError('Please enter a verification query');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const verificationQuery: TrustGateQuery = {
        id: `query_${Date.now()}`,
        query: query.trim(),
        type: 'simple',
        boardId,
        organizationId,
        requesterId: 'widget_user',
        requesterType: 'individual',
        anonymousMode,
        urgency: 'normal',
        metadata: {
          purpose: 'Widget Verification',
          context: 'TrustGate Widget',
        }
      };

      const response = await universalService.verifyTrustGate(verificationQuery);

      if (response.success && response.data) {
        setResult(response.data);
        onVerificationComplete?.(response.data);
      } else {
        setError(response.error || 'Verification failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during verification');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      handleVerification();
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const isVerified = result.verified;
    const confidence = result.confidence;

    return (
      <Fade in={true} timeout={500}>
        <Box sx={{ mt: 2 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: isVerified ? 'success.light' : 'error.light',
              color: isVerified ? 'success.contrastText' : 'error.contrastText',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {isVerified ? (
                <VerifiedIcon color="inherit" />
              ) : (
                <CancelIcon color="inherit" />
              )}
              <Typography variant="h6" fontWeight="bold">
                {isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
              </Typography>
              <Chip
                label={`${confidence}% confidence`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'inherit',
                  ml: 'auto'
                }}
              />
            </Box>

            {showMetadata && (
              <>
                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SecurityIcon fontSize="small" />
                      <Typography variant="caption">
                        {result.source.organizationName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SpeedIcon fontSize="small" />
                      <Typography variant="caption">
                        {result.responseTime}ms
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon fontSize="small" />
                      <Typography variant="caption">
                        Verified on {new Date(result.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {result.verification.evidence.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Evidence:
                    </Typography>
                    {result.verification.evidence.slice(0, 2).map((evidence, index) => (
                      <Chip
                        key={index}
                        label={evidence.type}
                        size="small"
                        variant="outlined"
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'inherit'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Paper>

          {!anonymousMode && result.privacy.dataShared !== 'none' && (
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="caption">
                Data sharing level: {result.privacy.dataShared}
                {result.privacy.anonymized && ' (anonymized)'}
                {result.privacy.encryptionUsed && ' (encrypted)'}
              </Typography>
            </Alert>
          )}
        </Box>
      </Fade>
    );
  };

  return (
    <Card sx={{ ...styleProps }}>
      <CardContent sx={{ p: sizeProps.cardPadding, '&:last-child': { pb: sizeProps.cardPadding } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <SearchIcon />
          </Avatar>
          <Typography variant={sizeProps.fontSize as any} fontWeight="bold">
            {title}
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          size={sizeProps.textFieldSize}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerification}
          disabled={loading || !query.trim()}
          startIcon={<SearchIcon />}
          size={sizeProps.buttonSize}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {renderResult()}

        {/* Powered by TrustChain branding */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Powered by TrustChain
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrustGateWidget;
