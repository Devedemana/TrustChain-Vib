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
import { Actor, HttpAgent } from '@dfinity/agent';

interface IssueCredentialFormProps {
  principal: Principal | null;
  identity: Identity | null;
}

// Define the canister interface for issueCredential
const createTrustChainActor = (identity: Identity) => {
  const agent = new HttpAgent({
    host: process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
    identity,
  });

  // For local development, fetch the root key
  if (process.env.DFX_NETWORK === 'local') {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check if the local replica is running.');
    });
  }

  return Actor.createActor(
    ({ IDL }) => {
      const Result = IDL.Variant({
        Ok: IDL.Text,
        Err: IDL.Text,
      });

      return IDL.Service({
        issueCredential: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
      });
    },
    {
      agent,
      canisterId: process.env.CANISTER_ID_TRUSTCHAIN_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai',
    }
  );
};

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
    setResult(null);

    try {
      // Create actor with authenticated identity
      const actor = createTrustChainActor(identity);

      // Call the canister's issueCredential function
      const response = await actor.issueCredential(principal, metadata.trim()) as any;

      // Handle the Result type response
      if (response && 'Ok' in response) {
        setResult(response.Ok as string);
        setMetadata(''); // Clear form on success
        console.log('Credential issued successfully:', response.Ok);
      } else if (response && 'Err' in response) {
        setError(response.Err as string);
        console.error('Error issuing credential:', response.Err);
      } else {
        setError('Unexpected response format from canister');
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
