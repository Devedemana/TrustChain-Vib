import React, { useState, Suspense } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  ThreeDRotation,
  Visibility,
  VisibilityOff,
  Download,
  Share,
  Security,
  Verified,
  School,
  DateRange,
  QrCode
} from '@mui/icons-material';

import { AdvancedCredential } from '../types/advanced';

interface Credential3DViewerProps {
  credential: AdvancedCredential;
  onVerify?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

// 3D Card Component (simplified version without Three.js for now)
const Credential3DCard: React.FC<{ credential: AdvancedCredential; isRotating: boolean }> = ({ 
  credential, 
  isRotating 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardStyle = {
    width: '350px',
    height: '220px',
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.6s',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    cursor: 'pointer',
    margin: '20px auto'
  };

  const frontStyle = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    background: `linear-gradient(135deg, 
      ${credential.confidentialityLevel === 'public' ? '#1976d2, #42a5f5' : 
        credential.confidentialityLevel === 'private' ? '#9c27b0, #ba68c8' : 
        '#f57c00, #ffb74d'})`,
    borderRadius: '15px',
    padding: '20px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    border: credential.digitalSignature ? '2px solid #4caf50' : 'none'
  };

  const backStyle = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    background: 'linear-gradient(135deg, #263238, #37474f)',
    borderRadius: '15px',
    padding: '20px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    transform: 'rotateY(180deg)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
  };

  const formatMetadata = (metadata: string) => {
    try {
      const parsed = JSON.parse(metadata);
      return Object.entries(parsed).slice(0, 3).map(([key, value]) => (
        <div key={key} style={{ fontSize: '12px', opacity: 0.9 }}>
          <strong>{key}:</strong> {String(value)}
        </div>
      ));
    } catch {
      return <div style={{ fontSize: '12px', opacity: 0.9 }}>{metadata}</div>;
    }
  };

  return (
    <div 
      style={cardStyle} 
      onClick={() => setIsFlipped(!isFlipped)}
      className={isRotating ? 'rotating-card' : ''}
    >
      {/* Front of card */}
      <div style={frontStyle}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {credential.title}
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.9 }}>
                {credential.institution}
              </Typography>
            </div>
            {credential.digitalSignature && (
              <Verified style={{ fontSize: '24px' }} />
            )}
          </div>
        </div>
        
        <div>
          <Typography variant="body2" style={{ opacity: 0.8, marginBottom: '8px' }}>
            {credential.credentialType.toUpperCase()}
          </Typography>
          <Typography variant="caption" style={{ opacity: 0.7 }}>
            Issued: {new Date(credential.issueDate).toLocaleDateString()}
          </Typography>
        </div>
        
        <div style={{ fontSize: '10px', opacity: 0.6 }}>
          ID: {credential.id}
        </div>
      </div>

      {/* Back of card */}
      <div style={backStyle}>
        <div>
          <Typography variant="body2" style={{ marginBottom: '12px', fontWeight: 'bold' }}>
            Credential Details
          </Typography>
          
          <div style={{ marginBottom: '8px' }}>
            <Typography variant="caption" style={{ opacity: 0.8 }}>
              Student ID: {credential.studentId}
            </Typography>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <Typography variant="caption" style={{ opacity: 0.8 }}>
              Status: {credential.revocationStatus.toUpperCase()}
            </Typography>
          </div>
          
          {credential.skillsVerified && credential.skillsVerified.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <Typography variant="caption" style={{ opacity: 0.8 }}>
                Skills: {credential.skillsVerified.slice(0, 2).join(', ')}
                {credential.skillsVerified.length > 2 && '...'}
              </Typography>
            </div>
          )}
        </div>

        <div>
          {formatMetadata(credential.metadata)}
        </div>
        
        <div style={{ fontSize: '10px', opacity: 0.6 }}>
          Hash: {credential.verificationHash.substring(0, 20)}...
        </div>
      </div>
    </div>
  );
};

export const Credential3DViewer: React.FC<Credential3DViewerProps> = ({
  credential,
  onVerify,
  onDownload,
  onShare
}) => {
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const securityLevel = credential.digitalSignature ? 'High' : 
                       (credential.multisigApprovals && credential.multisigApprovals.length > 0) ? 'Medium' : 'Basic';

  const expirationStatus = credential.expirationDate ? 
    (Date.now() > credential.expirationDate ? 'Expired' : 'Valid') : 'No Expiration';

  return (
    <Box sx={{ p: 3 }}>
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          <ThreeDRotation sx={{ mr: 1, verticalAlign: 'middle' }} />
          3D Credential Viewer
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={<Switch checked={is3DEnabled} onChange={(e) => setIs3DEnabled(e.target.checked)} />}
            label="3D View"
          />
          
          <FormControlLabel
            control={<Switch checked={isRotating} onChange={(e) => setIsRotating(e.target.checked)} />}
            label="Auto Rotate"
          />
          
          <Tooltip title="Toggle Details">
            <IconButton onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 3D Credential Display */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={<Typography>Loading 3D view...</Typography>}>
              <Credential3DCard credential={credential} isRotating={isRotating} />
            </Suspense>
          </Paper>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button variant="contained" startIcon={<Verified />} onClick={onVerify}>
              Verify
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={onDownload}>
              Download
            </Button>
            <Button variant="outlined" startIcon={<Share />} onClick={onShare}>
              Share
            </Button>
            <Button variant="outlined" startIcon={<QrCode />}>
              QR Code
            </Button>
          </Box>
        </Grid>

        {/* Credential Information */}
        <Grid item xs={12} md={6}>
          {/* Security Status */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security Status
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Security Level</Typography>
                  <Chip 
                    label={securityLevel}
                    color={securityLevel === 'High' ? 'success' : securityLevel === 'Medium' ? 'warning' : 'default'}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={credential.revocationStatus}
                    color={credential.revocationStatus === 'active' ? 'success' : 'error'}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Expiration</Typography>
                  <Chip 
                    label={expirationStatus}
                    color={expirationStatus === 'Valid' || expirationStatus === 'No Expiration' ? 'success' : 'error'}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Confidentiality</Typography>
                  <Chip 
                    label={credential.confidentialityLevel}
                    color={credential.confidentialityLevel === 'public' ? 'info' : 
                           credential.confidentialityLevel === 'private' ? 'warning' : 'error'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          {showDetails && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Detailed Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Institution</Typography>
                  <Typography variant="body1">{credential.institution}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Issue Date</Typography>
                  <Typography variant="body1">
                    <DateRange sx={{ mr: 1, fontSize: '16px', verticalAlign: 'middle' }} />
                    {new Date(credential.issueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {credential.expirationDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Expiration Date</Typography>
                    <Typography variant="body1">
                      {new Date(credential.expirationDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                
                {credential.skillsVerified && credential.skillsVerified.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Verified Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {credential.skillsVerified.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Verification Hash</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {credential.verificationHash}
                  </Typography>
                </Box>
                
                {credential.digitalSignature && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Digital Signature</Typography>
                    <Typography variant="body2" color="success.main">
                      ✓ Digitally signed with {credential.digitalSignature.algorithm}
                    </Typography>
                  </Box>
                )}
                
                {credential.multisigApprovals && credential.multisigApprovals.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Multi-Signature Approvals</Typography>
                    <Typography variant="body2">
                      {credential.multisigApprovals.length} approvals received
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* CSS for rotation animation */}
      <style>
        {`
          @keyframes rotateCard {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
          
          .rotating-card {
            animation: rotateCard 4s linear infinite;
          }
          
          .rotating-card:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </Box>
  );
};
