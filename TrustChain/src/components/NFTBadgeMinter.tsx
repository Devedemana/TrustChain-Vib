import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Token,
  Diamond,
  EmojiEvents,
  School,
  AccountBalance,
  Verified,
  Download,
  Share
} from '@mui/icons-material';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';

interface NFTBadgeProps {
  principal: Principal | null;
  identity: Identity | null;
}

interface BadgeTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  category: 'academic' | 'certification' | 'achievement';
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  credential_id: string;
  institution: string;
  recipient: string;
  issue_date: string;
  expiry_date?: string;
}

const badgeTemplates: BadgeTemplate[] = [
  {
    id: 'degree',
    name: 'Academic Degree',
    description: 'Bachelor\'s, Master\'s, or Doctoral degree',
    icon: <School />,
    color: '#2196f3',
    category: 'academic'
  },
  {
    id: 'certificate',
    name: 'Professional Certificate',
    description: 'Industry certification or course completion',
    icon: <Verified />,
    color: '#4caf50',
    category: 'certification'
  },
  {
    id: 'achievement',
    name: 'Achievement Badge',
    description: 'Special recognition or accomplishment',
    icon: <EmojiEvents />,
    color: '#ff9800',
    category: 'achievement'
  },
  {
    id: 'institution',
    name: 'Institution Badge',
    description: 'Official institutional recognition',
    icon: <AccountBalance />,
    color: '#9c27b0',
    category: 'academic'
  }
];

const NFTBadgeMinter: React.FC<NFTBadgeProps> = ({ principal, identity }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<BadgeTemplate | null>(null);
  const [credentialId, setCredentialId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [institution, setInstitution] = useState('');
  const [achievementTitle, setAchievementTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([
    { trait_type: 'Institution', value: '' },
    { trait_type: 'Date Issued', value: '' },
    { trait_type: 'Type', value: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<NFTMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);

  const handleTemplateSelect = (template: BadgeTemplate) => {
    setSelectedTemplate(template);
    setAttributes([
      { trait_type: 'Institution', value: institution },
      { trait_type: 'Date Issued', value: new Date().toISOString().split('T')[0] },
      { trait_type: 'Type', value: template.name },
      { trait_type: 'Category', value: template.category }
    ]);
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const generateNFTMetadata = (): NFTMetadata => {
    if (!selectedTemplate) throw new Error('No template selected');

    const metadata: NFTMetadata = {
      name: achievementTitle || `${selectedTemplate.name} - ${recipientName}`,
      description: description || `${selectedTemplate.description} issued to ${recipientName} by ${institution}`,
      image: generateBadgeImageDataURL(),
      attributes: attributes.filter(attr => attr.trait_type && attr.value),
      credential_id: credentialId,
      institution: institution,
      recipient: recipientName,
      issue_date: new Date().toISOString()
    };

    return metadata;
  };

  const generateBadgeImageDataURL = (): string => {
    // Create a canvas to generate badge image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx || !selectedTemplate) return '';

    canvas.width = 400;
    canvas.height = 400;

    // Background gradient
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    gradient.addColorStop(0, selectedTemplate.color);
    gradient.addColorStop(1, '#ffffff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Border circle
    ctx.strokeStyle = selectedTemplate.color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, 2 * Math.PI);
    ctx.stroke();

    // Text styling
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'bold 24px Arial';
    ctx.fillText(achievementTitle || selectedTemplate.name, 200, 150);
    
    // Recipient
    ctx.font = '18px Arial';
    ctx.fillText(recipientName, 200, 200);
    
    // Institution
    ctx.font = '16px Arial';
    ctx.fillText(institution, 200, 250);
    
    // Date
    ctx.font = '14px Arial';
    ctx.fillText(new Date().toLocaleDateString(), 200, 300);

    return canvas.toDataURL('image/png');
  };

  const handleMintNFT = async () => {
    if (!principal || !identity || !selectedTemplate) {
      setError('Authentication and template selection required');
      return;
    }

    if (!credentialId || !recipientName || !institution || !achievementTitle) {
      setError('All required fields must be filled');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate NFT metadata
      const metadata = generateNFTMetadata();

      // Simulate minting process (in real implementation, this would call IC NFT canister)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful minting
      const mintedToken: NFTMetadata = {
        ...metadata,
        // In real implementation, this would be the actual NFT token ID
        image: generateBadgeImageDataURL()
      };

      setMintedNFT(mintedToken);
      console.log('NFT Badge minted successfully:', mintedToken);

      // Reset form
      setCredentialId('');
      setRecipientName('');
      setInstitution('');
      setAchievementTitle('');
      setDescription('');
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error('Error minting NFT badge:', error);
      setError('Failed to mint NFT badge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBadge = () => {
    if (!mintedNFT) return;

    const link = document.createElement('a');
    link.href = mintedNFT.image;
    link.download = `${mintedNFT.name.replace(/\s+/g, '_')}_badge.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareBadge = async () => {
    if (!mintedNFT) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: mintedNFT.name,
          text: mintedNFT.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing badge:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      setError('Badge link copied to clipboard!');
      setTimeout(() => setError(null), 3000);
    }
  };

  const openPreview = () => {
    if (selectedTemplate && achievementTitle && recipientName && institution) {
      setPreviewDialog(true);
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
          Please login to mint NFT badges
        </Alert>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white'
        }}
      >
        <Typography variant="h5" gutterBottom>
          <Token sx={{ mr: 1, verticalAlign: 'middle' }} />
          NFT Badge Minter
        </Typography>
        
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          Create blockchain-based NFT badges for academic credentials
        </Typography>

        {/* Template Selection */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Select Badge Template
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {badgeTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={3} key={template.id}>
              <Card 
                sx={{ 
                  background: selectedTemplate?.id === template.id 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  border: selectedTemplate?.id === template.id 
                    ? `2px solid ${template.color}` 
                    : '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: template.color, 
                      mx: 'auto', 
                      mb: 1,
                      width: 48,
                      height: 48
                    }}
                  >
                    {template.icon}
                  </Avatar>
                  <Typography variant="subtitle2" gutterBottom>
                    {template.name}
                  </Typography>
                  <Chip 
                    label={template.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }} 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Badge Details Form */}
        {selectedTemplate && (
          <Paper 
            elevation={0}
            sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              p: 3,
              mb: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Badge Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />

                <TextField
                  fullWidth
                  label="Recipient Name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />

                <TextField
                  fullWidth
                  label="Institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Achievement Title"
                  value={achievementTitle}
                  onChange={(e) => setAchievementTitle(e.target.value)}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleMintNFT}
                disabled={loading || !credentialId || !recipientName || !institution || !achievementTitle}
                startIcon={loading ? <CircularProgress size={20} /> : <Diamond />}
                sx={{ 
                  background: selectedTemplate.color, 
                  '&:hover': { 
                    background: selectedTemplate.color,
                    opacity: 0.8
                  }
                }}
              >
                {loading ? 'Minting...' : 'Mint NFT Badge'}
              </Button>

              <Button
                variant="outlined"
                onClick={openPreview}
                disabled={!selectedTemplate || !achievementTitle || !recipientName || !institution}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Preview Badge
              </Button>
            </Box>
          </Paper>
        )}

        {/* Error Display */}
        {error && (
          <Alert 
            severity={error.includes('copied') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Minted NFT Display */}
        {mintedNFT && (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '2px solid #4caf50'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
                <Verified sx={{ mr: 1, verticalAlign: 'middle' }} />
                NFT Badge Minted Successfully!
              </Typography>

              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src={mintedNFT.image} 
                      alt="NFT Badge"
                      style={{ 
                        maxWidth: '200px',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">{mintedNFT.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                    {mintedNFT.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                      Attributes:
                    </Typography>
                    <Grid container spacing={1}>
                      {mintedNFT.attributes.map((attr, index) => (
                        <Grid item key={index}>
                          <Chip 
                            label={`${attr.trait_type}: ${attr.value}`}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white'
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleDownloadBadge}
                      size="small"
                    >
                      Download
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleShareBadge}
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Share
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Badge Preview</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          {selectedTemplate && (
            <Box>
              <img 
                src={generateBadgeImageDataURL()} 
                alt="Badge Preview"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {achievementTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {recipientName} • {institution}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>
            Close
          </Button>
          <Button 
            onClick={() => {
              setPreviewDialog(false);
              handleMintNFT();
            }}
            variant="contained"
            disabled={loading}
          >
            Mint This Badge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NFTBadgeMinter;
