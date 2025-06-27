import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  CameraAlt,
  Stop,
  QrCodeScanner,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import jsQR from 'jsqr';
import { Actor, HttpAgent } from '@dfinity/agent';

// Define the canister interface for verifyCredential
const createTrustChainActor = () => {
  const agent = new HttpAgent({
    host: process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
  });

  // For local development, fetch the root key
  if (process.env.DFX_NETWORK === 'local') {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check if the local replica is running.');
    });
  }

  return Actor.createActor(
    ({ IDL }) => {
      return IDL.Service({
        verifyCredential: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
      });
    },
    {
      agent,
      canisterId: process.env.CANISTER_ID_TRUSTCHAIN_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai',
    }
  );
};

interface VerificationResult {
  found: boolean;
  credentialId: string;
  metadata?: string;
}

const VerifyCredentialScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');

  // Start camera and QR scanning
  const startScanning = async () => {
    try {
      setError(null);
      setResult(null);
      
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setScanning(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  // Stop camera and scanning
  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setScanning(false);
    setLastScannedCode('');
  };

  // Verify credential with the canister
  const verifyCredential = async (credentialId: string) => {
    if (credentialId === lastScannedCode) {
      return; // Prevent duplicate scans
    }

    setLastScannedCode(credentialId);
    setLoading(true);
    setError(null);

    try {
      const actor = createTrustChainActor();
      const response = await actor.verifyCredential(credentialId) as any;

      if (response && Array.isArray(response) && response.length > 0 && response[0]) {
        // Credential found
        setResult({
          found: true,
          credentialId,
          metadata: response[0] as string
        });
        console.log('Credential verified:', credentialId);
      } else {
        // Credential not found
        setResult({
          found: false,
          credentialId
        });
        console.log('Credential not found:', credentialId);
      }
    } catch (error) {
      console.error('Error verifying credential:', error);
      setError('Network error: Failed to verify credential');
    } finally {
      setLoading(false);
      // Reset last scanned code after a delay to allow re-scanning
      setTimeout(() => setLastScannedCode(''), 3000);
    }
  };

  // QR code scanning loop
  const scanFrame = useCallback(() => {
    if (!scanning || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Scan for QR codes
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (qrCode && qrCode.data) {
        console.log('QR Code detected:', qrCode.data);
        verifyCredential(qrCode.data);
      }
    }

    // Continue scanning
    if (scanning) {
      requestAnimationFrame(scanFrame);
    }
  }, [scanning, lastScannedCode]);

  // Start scanning loop when camera is ready
  useEffect(() => {
    if (scanning && videoRef.current) {
      const video = videoRef.current;
      const handleLoadedData = () => {
        scanFrame();
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      return () => video.removeEventListener('loadeddata', handleLoadedData);
    }
  }, [scanning, scanFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

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
        QR Code Credential Scanner
      </Typography>
      
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
        Scan a QR code containing a credential ID to verify its authenticity
      </Typography>

      {/* Camera Controls */}
      <Box sx={{ mb: 3 }}>
        {!scanning ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<CameraAlt />}
            onClick={startScanning}
            sx={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            Start Camera
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="large"
            startIcon={<Stop />}
            onClick={stopScanning}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Stop Scanning
          </Button>
        )}
      </Box>

      {/* Camera View */}
      {scanning && (
        <Box sx={{ mb: 3, position: 'relative', display: 'inline-block' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              borderRadius: '8px',
              backgroundColor: 'black'
            }}
            playsInline
            muted
          />
          
          {/* QR Scanner Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              pointerEvents: 'none'
            }}
          >
            <QrCodeScanner 
              sx={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '48px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            />
          </Box>
          
          {/* Loading indicator */}
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '16px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <Typography variant="body2">Verifying...</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Verification Result */}
      {result && (
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          color: 'white',
          border: result.found ? '2px solid #4caf50' : '2px solid #f44336'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {result.found ? (
                <CheckCircle sx={{ color: '#4caf50', mr: 2, fontSize: 32 }} />
              ) : (
                <Cancel sx={{ color: '#f44336', mr: 2, fontSize: 32 }} />
              )}
              <Typography variant="h6">
                {result.found ? 'Credential Verified' : 'Credential Not Found'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
              Credential ID:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2, wordBreak: 'break-all' }}>
              {result.credentialId}
            </Typography>

            {result.found && result.metadata ? (
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                  Metadata:
                </Typography>
                <Typography variant="body2" sx={{ 
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 1,
                  p: 2,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap'
                }}>
                  {result.metadata}
                </Typography>
              </Box>
            ) : (
              <Alert severity="error">
                This credential could not be verified. It may be invalid or not exist in the system.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default VerifyCredentialScanner;
