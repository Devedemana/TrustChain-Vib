import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { Organization, TrustBoardSchema } from '../types/universal';
import UniversalDashboard from './UniversalDashboard';
import TrustGateWidget from './TrustGateWidget';

const UniversalDemo: React.FC = () => {
  const theme = useTheme();
  const [demoStep, setDemoStep] = useState(0);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Mock organization for demo
  const demoOrganization: Organization = {
    id: 'demo_org_1',
    name: 'Demo University',
    type: 'university',
    industry: 'education',
    verified: true,
    trustScore: 95,
    contact: {
      email: 'demo@university.edu',
      website: 'https://demo-university.edu'
    },
    settings: {
      allowCrossVerification: true,
      publicProfile: true,
      apiAccess: true
    },
    subscription: {
      plan: 'professional',
      maxTrustBoards: 50,
      maxRecords: 10000,
      maxVerifications: 1000000,
      customBranding: true
    },
    createdAt: Date.now() - 86400000,
    lastActive: Date.now()
  };

  // Mock data for demo
  const mockCredentials = [
    {
      id: 'demo_1',
      studentId: 'demo_student',
      institution: 'Demo University',
      credentialType: 'degree',
      title: 'Bachelor of Computer Science',
      issueDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
      verificationHash: 'demo_hash_1',
      metadata: '{}'
    }
  ];

  const demoSteps = [
    {
      title: 'Create Your Organization',
      description: 'Set up your organization profile and configure basic settings',
      component: 'organization',
      completed: true
    },
    {
      title: 'Create TrustBoards',
      description: 'Design custom data tables for your specific verification needs',
      component: 'trustboard',
      completed: false
    },
    {
      title: 'Add Records',
      description: 'Upload and manage data records in your TrustBoards',
      component: 'records',
      completed: false
    },
    {
      title: 'Verify Information',
      description: 'Use TrustGate widgets to verify information instantly',
      component: 'verification',
      completed: false
    },
    {
      title: 'Cross-Verification',
      description: 'Link multiple TrustBoards for comprehensive verification',
      component: 'cross-verification',
      completed: false
    }
  ];

  const useCases = [
    {
      title: 'Educational Institutions',
      icon: <SchoolIcon />,
      description: 'Verify degrees, certifications, and academic achievements',
      examples: ['Student transcripts', 'Degree certificates', 'Course completions', 'Professional certifications'],
      color: '#1976d2'
    },
    {
      title: 'Businesses & HR',
      icon: <BusinessIcon />,
      description: 'Verify employment history, skills, and professional background',
      examples: ['Employment verification', 'Skill assessments', 'Performance reviews', 'Background checks'],
      color: '#388e3c'
    },
    {
      title: 'Financial Services',
      icon: <BankIcon />,
      description: 'Verify income, credit history, and financial standing',
      examples: ['Income verification', 'Credit scores', 'Bank statements', 'Asset ownership'],
      color: '#f57c00'
    }
  ];

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < demoSteps.length - 1) {
      setDemoStep(stepIndex + 1);
    }
  };

  const openDashboard = () => {
    setDashboardOpen(true);
    handleStepComplete(1);
  };

  const openWidget = () => {
    setWidgetOpen(true);
    handleStepComplete(3);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          TrustChain Universal
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Trust-as-a-Service Platform
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Transform any organization into a trusted verification authority. Create custom TrustBoards, 
          verify information instantly, and build a universal trust network.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayIcon />}
            onClick={openDashboard}
            sx={{ minWidth: 200 }}
          >
            Try Universal Dashboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<LaunchIcon />}
            onClick={openWidget}
            sx={{ minWidth: 200 }}
          >
            Test Verification Widget
          </Button>
        </Box>
      </Box>

      {/* Core Concepts */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                📊
              </Typography>
              <Typography variant="h6" gutterBottom>
                TrustBoards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Digital filing cabinets that make any data tamper-proof on the blockchain. 
                Create custom tables for your specific needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
                🔍
              </Typography>
              <Typography variant="h6" gutterBottom>
                TrustGates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verification endpoints that provide instant yes/no answers. 
                Verify any claim without revealing underlying data.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 2, color: 'warning.main' }}>
                🌉
              </Typography>
              <Typography variant="h6" gutterBottom>
                TrustBridge
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cross-verification system that links multiple TrustBoards 
                for comprehensive trust decisions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Demo Steps */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Interactive Demo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Follow these steps to experience the complete TrustChain Universal workflow
          </Typography>
          
          <Stepper activeStep={demoStep} orientation="vertical">
            {demoSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel
                  icon={completedSteps.includes(index) ? <CheckIcon color="success" /> : <UncheckedIcon />}
                >
                  <Typography variant="h6">{step.title}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {index === 1 && (
                      <Button variant="contained" onClick={openDashboard}>
                        Open Dashboard
                      </Button>
                    )}
                    {index === 3 && (
                      <Button variant="contained" onClick={openWidget}>
                        Try Widget
                      </Button>
                    )}
                    {(index === 0 || index === 2 || index === 4) && (
                      <Button 
                        variant="outlined" 
                        onClick={() => handleStepComplete(index)}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Universal Applications
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {useCases.map((useCase, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: useCase.color }}>
                    {useCase.icon}
                  </Box>
                  <Typography variant="h6">
                    {useCase.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {useCase.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Example Use Cases:
                </Typography>
                <List dense>
                  {useCase.examples.map((example, exampleIndex) => (
                    <ListItem key={exampleIndex} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {example}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Value Proposition */}
      <Paper sx={{ p: 4, textAlign: 'center', background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)` }}>
        <Typography variant="h4" gutterBottom>
          The Universal Trust Revolution
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              For Organizations
            </Typography>
            <Typography variant="body2">
              Turn your data into trusted verification sources. No blockchain expertise required.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              For Individuals
            </Typography>
            <Typography variant="body2">
              Upload once, verify anywhere. Own your credentials and control who sees what.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              For Verifiers
            </Typography>
            <Typography variant="body2">
              Instant, secure verification from trusted sources. No more manual checks.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Dashboard Demo Dialog */}
      <Dialog
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        maxWidth="xl"
        fullWidth
        fullScreen
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Universal Dashboard Demo
            <Button onClick={() => setDashboardOpen(false)}>
              Close Demo
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <UniversalDashboard
            organization={demoOrganization}
            credentials={mockCredentials}
            profileCompleteness={75}
            credentialChartData={{}}
            skillGrowthData={{}}
            marketDemandData={{}}
            careerInsights={[]}
            onShareToSocial={() => {}}
          />
        </DialogContent>
      </Dialog>

      {/* Widget Demo Dialog */}
      <Dialog
        open={widgetOpen}
        onClose={() => setWidgetOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          TrustGate Verification Widget Demo
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            This is a demo widget. Try searching for "Computer Science" or "Demo University" 
            to see verification responses.
          </Alert>
          
          <TrustGateWidget
            title="University Degree Verification"
            placeholder="Enter student name, degree, or institution..."
            style="modern"
            size="large"
            showMetadata={true}
            anonymousMode={false}
            onVerificationComplete={(result) => {
              console.log('Verification complete:', result);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UniversalDemo;
