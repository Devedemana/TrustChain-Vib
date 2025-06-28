import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import { getTrustChainService } from '../services/serviceSelector';

interface IssueCredentialFormProps {
  principal: Principal | null;
  identity: Identity | null;
}

const IssueCredentialForm: React.FC<IssueCredentialFormProps> = ({ principal, identity }) => {
  const [metadata, setMetadata] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!principal || !identity) {
      setError('Authentication required');
      return;
    }

    if (!metadata.trim()) {
      setError('Metadata is required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);    try {
      // Use the service selector to get the appropriate service (mock or real)
      const trustChainService = getTrustChainService();
      
      // Parse metadata as JSON to validate it
      let parsedMetadata;
      try {
        parsedMetadata = JSON.parse(metadata.trim());
      } catch (parseError) {
        setError('Invalid JSON format in metadata');
        setLoading(false);
        return;
      }

      // Issue credential using the service
      const response = await trustChainService.issueCredential(
        principal.toText(),
        'TrustChain Institution', // Default institution name
        'certificate', // Default credential type
        'Academic Credential', // Default title
        parsedMetadata
      );

      if (response.success && response.data) {
        setResult(response.data.id);
        setMetadata(''); // Clear form on success
        console.log('Credential issued successfully:', response.data);
      } else {
        setError(response.error || 'Failed to issue credential');
        console.error('Error issuing credential:', response.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error: Failed to connect to canister');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  if (!principal || !identity) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 4,
          color: 'white'
        }}
      >
        <Alert severity="warning">
          Please login to issue credentials
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        p: 4,
        color: 'white'
      }}
    >
      <Typography variant="h5" gutterBottom>
        Issue New Credential
      </Typography>
      
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
        Issuer: {principal.toText().slice(0, 8)}...{principal.toText().slice(-4)}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Credential Metadata"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder='Enter credential details (e.g., {"degree": "Bachelor of Computer Science", "institution": "Digital University", "gpa": "3.8", "graduationDate": "2024-06-15"})'
          disabled={loading}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': { 
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={loading || !metadata.trim()}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            '&:hover': { background: 'rgba(255, 255, 255, 0.3)' },
            '&:disabled': { background: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          {loading ? 'Issuing...' : 'Issue Credential'}
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Credential issued successfully!
          </Alert>
          
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Credential ID:
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 1,
              p: 2
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'monospace', 
                wordBreak: 'break-all',
                flexGrow: 1 
              }}
            >
              {result}
            </Typography>
            
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={copyToClipboard}
              sx={{ 
                minWidth: 'auto',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { color: 'white' }
              }}
            >
              Copy
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default IssueCredentialForm;
