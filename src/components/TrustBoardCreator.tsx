import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  Tooltip,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  LocalHospital as HealthIcon,
  Home as RealEstateIcon,
  Gavel as GovernmentIcon,
  Category as OtherIcon
} from '@mui/icons-material';
import { TrustBoardSchema, FieldDefinition, VerificationRule, Organization } from '../types/universal';
import { UniversalTrustService } from '../services/universalTrust';

interface TrustBoardCreatorProps {
  organization: Organization;
  onBoardCreated: (board: TrustBoardSchema) => void;
  onClose: () => void;
  editBoard?: TrustBoardSchema;
}

const TrustBoardCreator: React.FC<TrustBoardCreatorProps> = ({
  organization,
  onBoardCreated,
  onClose,
  editBoard
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Board Basic Info
  const [boardName, setBoardName] = useState(editBoard?.name || '');
  const [boardDescription, setBoardDescription] = useState(editBoard?.description || '');
  const [boardCategory, setBoardCategory] = useState<string>(editBoard?.category || 'other');

  // Fields Configuration
  const [fields, setFields] = useState<FieldDefinition[]>(editBoard?.fields || []);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  // Verification Rules
  const [verificationRules, setVerificationRules] = useState<VerificationRule[]>(editBoard?.verificationRules || []);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);

  // Preview & Validation
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const universalService = UniversalTrustService.getInstance();

  const steps = [
    'Basic Information',
    'Field Configuration', 
    'Verification Rules',
    'Review & Create'
  ];

  const categoryIcons: { [key: string]: React.ReactNode } = {
    education: <SchoolIcon />,
    employment: <BusinessIcon />,
    finance: <BankIcon />,
    healthcare: <HealthIcon />,
    'real-estate': <RealEstateIcon />,
    government: <GovernmentIcon />,
    other: <OtherIcon />
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' }
  ];

  useEffect(() => {
    // Only validate if user has started entering data or trying to proceed
    if (boardName.trim() || boardDescription.trim() || activeStep > 0) {
      validateCurrentStep();
    } else {
      setValidationErrors([]);
    }
  }, [activeStep, boardName, boardDescription, fields, verificationRules]);

  const validateCurrentStep = () => {
    const errors: string[] = [];

    switch (activeStep) {
      case 0: // Basic Information
        if (!boardName.trim()) errors.push('Board name is required');
        if (!boardDescription.trim()) errors.push('Board description is required');
        break;
      case 1: // Field Configuration
        if (fields.length === 0) errors.push('At least one field is required');
        fields.forEach((field, index) => {
          if (!field.name.trim()) errors.push(`Field ${index + 1} name is required`);
        });
        break;
      case 2: // Verification Rules
        // Rules are optional, but validate if they exist
        verificationRules.forEach((rule, index) => {
          if (!rule.name.trim()) errors.push(`Rule ${index + 1} name is required`);
          if (rule.condition.length === 0) errors.push(`Rule ${index + 1} must have at least one condition`);
        });
        break;
    }

    setValidationErrors(errors);
  };

  const handleNext = () => {
    validateCurrentStep();
    if (validationErrors.length === 0) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const addField = () => {
    setEditingFieldIndex(null);
    setFieldDialogOpen(true);
  };

  const editField = (index: number) => {
    setEditingFieldIndex(index);
    setFieldDialogOpen(true);
  };

  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveField = (field: FieldDefinition) => {
    if (editingFieldIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = field;
      setFields(updatedFields);
    } else {
      setFields([...fields, field]);
    }
    setFieldDialogOpen(false);
  };

  const addVerificationRule = () => {
    const newRule: VerificationRule = {
      id: Math.random().toString(36).substring(2),
      name: `Rule ${verificationRules.length + 1}`,
      condition: [],
      action: 'allow',
      description: ''
    };
    setVerificationRules([...verificationRules, newRule]);
  };

  const updateVerificationRule = (index: number, rule: VerificationRule) => {
    const updatedRules = [...verificationRules];
    updatedRules[index] = rule;
    setVerificationRules(updatedRules);
  };

  const deleteVerificationRule = (index: number) => {
    setVerificationRules(verificationRules.filter((_, i) => i !== index));
  };

  const createTrustBoard = async () => {
    setLoading(true);
    setError(null);

    try {
      const boardData: Omit<TrustBoardSchema, 'id' | 'createdAt' | 'updatedAt'> = {
        organizationId: organization.id,
        name: boardName,
        description: boardDescription,
        category: boardCategory as any,
        fields,
        verificationRules,
        permissions: [{
          userId: organization.id,
          role: 'owner',
          permissions: {
            canRead: true,
            canWrite: true,
            canVerify: true,
            canManageUsers: true,
            canDelete: true
          }
        }],
        isActive: true
      };

      const response = await universalService.createTrustBoard(boardData);

      if (response.success && response.data) {
        // Check if this was created using fallback mode
        const isLocalStorage = localStorage.getItem('trustchain_boards');
        if (isLocalStorage) {
          console.info('✅ TrustBoard created successfully using local storage (development mode)');
        }
        
        onBoardCreated(response.data);
        onClose();
      } else {
        setError(response.error || 'Failed to create TrustBoard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('TrustBoard creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInformation = () => (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        background: 'rgba(255, 255, 255, 0.02)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        mb: 3
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 600,
          mb: 3
        }}
      >
        Basic Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="e.g., Student Degrees, Employee Records, Property Ownership"
            helperText="A clear, descriptive name for your TrustBoard"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4ECDC4',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#4ECDC4',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
            placeholder="Describe what kind of information this TrustBoard will store and verify"
            helperText="Help others understand the purpose of this TrustBoard"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4ECDC4',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#4ECDC4',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={boardCategory}
              onChange={(e) => setBoardCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="education">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon /> Education
                </Box>
              </MenuItem>
              <MenuItem value="employment">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon /> Employment
                </Box>
              </MenuItem>
              <MenuItem value="finance">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BankIcon /> Finance
                </Box>
              </MenuItem>
              <MenuItem value="healthcare">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HealthIcon /> Healthcare
                </Box>
              </MenuItem>
              <MenuItem value="real-estate">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RealEstateIcon /> Real Estate
                </Box>
              </MenuItem>
              <MenuItem value="government">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GovernmentIcon /> Government
                </Box>
              </MenuItem>
              <MenuItem value="other">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <OtherIcon /> Other
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Category-specific templates */}
      {boardCategory !== 'other' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            We have pre-built templates for {boardCategory} TrustBoards. 
            You can use these as starting points in the next step.
          </Typography>
        </Alert>
      )}
    </Paper>
  );

  const renderFieldConfiguration = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Field Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addField}
          size="small"
        >
          Add Field
        </Button>
      </Box>

      {fields.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No fields configured yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add fields to define what information your TrustBoard will store
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addField}>
            Add Your First Field
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {field.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {field.description || 'No description'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={field.type} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        {field.required && (
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="error" 
                            variant="outlined" 
                          />
                        )}
                        {field.isPrivate && (
                          <Chip 
                            label="Private" 
                            size="small" 
                            color="warning" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => editField(index)}>
                        <DragIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => deleteField(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderVerificationRules = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">
            Verification Rules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define rules for automatic verification of records (optional)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addVerificationRule}
          size="small"
        >
          Add Rule
        </Button>
      </Box>

      {verificationRules.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body2">
            No verification rules configured. Records will be manually verified by default.
            You can add rules to automatically verify records based on specific conditions.
          </Typography>
        </Alert>
      ) : (
        verificationRules.map((rule, index) => (
          <Accordion key={rule.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="subtitle1">
                  {rule.name}
                </Typography>
                <Chip 
                  label={rule.action} 
                  size="small" 
                  color={rule.action === 'allow' ? 'success' : rule.action === 'deny' ? 'error' : 'warning'}
                />
                <Box sx={{ ml: 'auto' }}>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteVerificationRule(index);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {rule.description || 'No description provided'}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Conditions: {rule.condition.length}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );

  const renderReviewAndCreate = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Review & Create TrustBoard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {categoryIcons[boardCategory]}
                Basic Information
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Name:</strong> {boardName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Category:</strong> {boardCategory}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Description:</strong> {boardDescription}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Fields:</strong> {fields.length} configured
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Required Fields:</strong> {fields.filter(f => f.required).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Private Fields:</strong> {fields.filter(f => f.isPrivate).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Verification Rules:</strong> {verificationRules.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fields Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {fields.map((field, index) => (
                  <Chip
                    key={index}
                    label={`${field.name} (${field.type})`}
                    variant="outlined"
                    color={field.required ? 'error' : 'default'}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  return (
    <>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #000 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 4
      }}>
        {/* Animated Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: 200,
          height: 200,
          background: 'linear-gradient(45deg, rgba(255, 107, 139, 0.1), rgba(78, 205, 196, 0.1))',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 0,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }} />

        <Paper 
          elevation={0}
          sx={{ 
            maxWidth: 1000, 
            mx: 'auto',
            background: 'rgba(255, 255, 255, 0.03)', 
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h4"
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #FF6B8B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {editBoard ? 'Edit TrustBoard' : 'Create New TrustBoard'}
              </Typography>
              <Button 
                onClick={onClose} 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { 
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>

          <Stepper 
            activeStep={activeStep} 
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': {
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                '&.Mui-active': {
                  color: '#4ECDC4'
                },
                '&.Mui-completed': {
                  color: '#FF6B8B'
                }
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.3)',
                '&.Mui-active': {
                  color: '#4ECDC4'
                },
                '&.Mui-completed': {
                  color: '#FF6B8B'
                }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Please fix the following errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Development Mode Notice */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Development Mode:</strong> TrustBoards are currently stored locally. 
              In production, they will be stored on the Internet Computer blockchain for immutable verification.
            </Typography>
          </Alert>

          {activeStep === 0 && renderBasicInformation()}
          {activeStep === 1 && renderFieldConfiguration()}
          {activeStep === 2 && renderVerificationRules()}
          {activeStep === 3 && renderReviewAndCreate()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.05)',
                px: 3,
                py: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={() => setPreviewOpen(true)}
                disabled={fields.length === 0}
                sx={{
                  color: '#4ECDC4',
                  borderColor: '#4ECDC4',
                  background: 'rgba(78, 205, 196, 0.1)',
                  backdropFilter: 'blur(10px)',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    background: 'rgba(78, 205, 196, 0.2)',
                    borderColor: '#4ECDC4',
                  },
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.3)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Preview
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={createTrustBoard}
                  disabled={loading || validationErrors.length > 0}
                  startIcon={<SaveIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B8B, #4ECDC4)',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    border: 'none',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5A7A, #3DBDB4)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 139, 0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  {loading ? 'Creating...' : editBoard ? 'Update TrustBoard' : 'Create TrustBoard'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={validationErrors.length > 0}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B8B, #4ECDC4)',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    border: 'none',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5A7A, #3DBDB4)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 139, 0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Paper>
      </Box>

      {/* Field Editor Dialog */}
      <FieldEditorDialog
        open={fieldDialogOpen}
        onClose={() => setFieldDialogOpen(false)}
        onSave={saveField}
        field={editingFieldIndex !== null ? fields[editingFieldIndex] : undefined}
        existingFieldNames={fields.map(f => f.name)}
      />

      {/* Preview Dialog */}
      <TrustBoardPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        boardName={boardName}
        fields={fields}
      />
    </>
  );
};

// Field Editor Dialog Component
interface FieldEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: FieldDefinition) => void;
  field?: FieldDefinition;
  existingFieldNames: string[];
}

const FieldEditorDialog: React.FC<FieldEditorDialogProps> = ({
  open,
  onClose,
  onSave,
  field,
  existingFieldNames
}) => {
  const [name, setName] = useState(field?.name || '');
  const [type, setType] = useState(field?.type || 'text');
  const [description, setDescription] = useState(field?.description || '');
  const [required, setRequired] = useState(field?.required || false);
  const [private_, setPrivate] = useState(field?.isPrivate || false);
  const [validation, setValidation] = useState(field?.validation || {});

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' }
  ];

  const handleSave = () => {
    const newField: FieldDefinition = {
      name: name.trim(),
      type: type as any,
      description: description.trim(),
      required,
      isPrivate: private_,
      validation: Object.keys(validation).length > 0 ? validation : undefined
    };
    onSave(newField);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setType('text');
    setDescription('');
    setRequired(false);
    setPrivate(false);
    setValidation({});
    onClose();
  };

  const nameExists = existingFieldNames.includes(name.trim()) && name.trim() !== field?.name;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <DialogTitle
        sx={{
          color: 'white',
          fontWeight: 600,
          background: 'linear-gradient(45deg, rgba(255, 107, 139, 0.1), rgba(78, 205, 196, 0.1))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {field ? 'Edit Field' : 'Add New Field'}
      </DialogTitle>
      <DialogContent sx={{ background: 'transparent' }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Field Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameExists}
              helperText={nameExists ? 'Field name already exists' : 'Enter a unique field name'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ECDC4',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#4ECDC4',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#4ECDC4' }
                }}
              >
                Field Type
              </InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                label="Field Type"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4ECDC4',
                  },
                  '& .MuiSelect-select': {
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(0, 0, 0, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&.Mui-selected': {
                          background: 'rgba(78, 205, 196, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                {fieldTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this field represents"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                />
              }
              label="Required Field"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={private_}
                  onChange={(e) => setPrivate(e.target.checked)}
                />
              }
              label="Private Field (hidden in verification responses)"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          background: 'linear-gradient(45deg, rgba(255, 107, 139, 0.05), rgba(78, 205, 196, 0.05))',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          p: 3,
          gap: 2
        }}
      >
        <Button 
          onClick={handleClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.05)',
            px: 3,
            py: 1,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!name.trim() || nameExists}
          sx={{
            background: 'linear-gradient(45deg, #FF6B8B, #4ECDC4)',
            color: 'white',
            fontWeight: 600,
            px: 4,
            py: 1,
            border: 'none',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5A7A, #3DBDB4)',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(255, 107, 139, 0.3)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          {field ? 'Update' : 'Add'} Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// TrustBoard Preview Dialog Component
interface TrustBoardPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  boardName: string;
  fields: FieldDefinition[];
}

const TrustBoardPreviewDialog: React.FC<TrustBoardPreviewDialogProps> = ({
  open,
  onClose,
  boardName,
  fields
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        TrustBoard Preview: {boardName}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This is how your TrustBoard will look when adding records:
        </Typography>
        
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Grid container spacing={2}>
            {fields.map((field, index) => (
              <Grid item xs={12} sm={field.type === 'boolean' ? 6 : 12} key={index}>
                {field.type === 'boolean' ? (
                  <FormControlLabel
                    control={<Switch disabled />}
                    label={`${field.name}${field.required ? ' *' : ''}`}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label={`${field.name}${field.required ? ' *' : ''}`}
                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    helperText={field.description}
                    disabled
                    size="small"
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrustBoardCreator;
