import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Divider,
  Tooltip,
  Avatar,
  LinearProgress,
  Tab,
  Tabs,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  AccountTree as BridgeIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Sync as SyncIcon,
  CheckCircle as VerifiedIcon,
  Warning as WarningIcon,
  Business as OrgIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

// Types for TrustBridge
interface TrustBridge {
  id: string;
  name: string;
  description: string;
  sourceOrganization: string;
  targetOrganization: string;
  sourceTrustBoard: string;
  targetTrustBoard: string;
  bridgeType: 'bilateral' | 'unidirectional' | 'multi-party';
  status: 'active' | 'pending' | 'suspended' | 'archived';
  permissions: BridgePermission[];
  fieldMappings: FieldMapping[];
  verificationRules: BridgeVerificationRule[];
  isPublic: boolean;
  autoSync: boolean;
  syncFrequency: string;
  createdAt: number;
  lastSync: number;
  totalVerifications: number;
  successRate: number;
}

interface BridgePermission {
  organizationId: string;
  canRead: boolean;
  canWrite: boolean;
  canVerify: boolean;
  canManage: boolean;
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformRule?: string;
  required: boolean;
}

interface BridgeVerificationRule {
  id: string;
  name: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_approval';
  priority: number;
}

interface Organization {
  id: string;
  name: string;
  type: string;
  logo?: string;
  verified: boolean;
}

interface TrustBoard {
  id: string;
  name: string;
  organizationId: string;
  category: string;
  recordCount: number;
}

export const TrustBridgesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [bridges, setBridges] = useState<TrustBridge[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [trustBoards, setTrustBoards] = useState<TrustBoard[]>([]);
  const [selectedBridge, setSelectedBridge] = useState<TrustBridge | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    setOrganizations([
      { id: 'health_org_001', name: 'Metro Health Network', type: 'Healthcare', verified: true },
      { id: 'edu_org_001', name: 'University Consortium', type: 'Education', verified: true },
      { id: 'gov_org_001', name: 'Department of Professional Licensing', type: 'Government', verified: true },
      { id: 'corp_org_001', name: 'Global Tech Solutions', type: 'Corporate', verified: true },
      { id: 'cert_org_001', name: 'International Certification Board', type: 'Certification', verified: true }
    ]);

    setTrustBoards([
      { id: 'medical_licenses', name: 'Medical Licenses', organizationId: 'health_org_001', category: 'Healthcare', recordCount: 15420 },
      { id: 'nursing_certs', name: 'Nursing Certifications', organizationId: 'health_org_001', category: 'Healthcare', recordCount: 8932 },
      { id: 'academic_degrees', name: 'Academic Degrees', organizationId: 'edu_org_001', category: 'Education', recordCount: 45678 },
      { id: 'professional_certs', name: 'Professional Certifications', organizationId: 'edu_org_001', category: 'Education', recordCount: 12345 },
      { id: 'govt_licenses', name: 'Government Licenses', organizationId: 'gov_org_001', category: 'Government', recordCount: 23456 },
      { id: 'tech_skills', name: 'Technology Skills', organizationId: 'corp_org_001', category: 'Corporate', recordCount: 9876 }
    ]);

    setBridges([
      {
        id: 'bridge_001',
        name: 'Healthcare-Education Bridge',
        description: 'Cross-verification between medical licenses and academic degrees',
        sourceOrganization: 'health_org_001',
        targetOrganization: 'edu_org_001',
        sourceTrustBoard: 'medical_licenses',
        targetTrustBoard: 'academic_degrees',
        bridgeType: 'bilateral',
        status: 'active',
        permissions: [],
        fieldMappings: [],
        verificationRules: [],
        isPublic: true,
        autoSync: true,
        syncFrequency: 'daily',
        createdAt: Date.now() - 86400000,
        lastSync: Date.now() - 3600000,
        totalVerifications: 1247,
        successRate: 98.5
      },
      {
        id: 'bridge_002',
        name: 'Government-Corporate Bridge',
        description: 'Professional licensing verification for corporate hiring',
        sourceOrganization: 'gov_org_001',
        targetOrganization: 'corp_org_001',
        sourceTrustBoard: 'govt_licenses',
        targetTrustBoard: 'tech_skills',
        bridgeType: 'unidirectional',
        status: 'active',
        permissions: [],
        fieldMappings: [],
        verificationRules: [],
        isPublic: false,
        autoSync: true,
        syncFrequency: 'hourly',
        createdAt: Date.now() - 172800000,
        lastSync: Date.now() - 1800000,
        totalVerifications: 892,
        successRate: 99.2
      },
      {
        id: 'bridge_003',
        name: 'Multi-Party Certification Network',
        description: 'Unified verification across health, education, and certification bodies',
        sourceOrganization: 'cert_org_001',
        targetOrganization: 'health_org_001',
        sourceTrustBoard: 'professional_certs',
        targetTrustBoard: 'medical_licenses',
        bridgeType: 'multi-party',
        status: 'pending',
        permissions: [],
        fieldMappings: [],
        verificationRules: [],
        isPublic: true,
        autoSync: false,
        syncFrequency: 'weekly',
        createdAt: Date.now() - 259200000,
        lastSync: 0,
        totalVerifications: 0,
        successRate: 0
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getBridgeTypeIcon = (type: string) => {
    switch (type) {
      case 'bilateral': return <SyncIcon />;
      case 'unidirectional': return <LaunchIcon />;
      case 'multi-party': return <GroupIcon />;
      default: return <LinkIcon />;
    }
  };

  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.name || orgId;
  };

  const getTrustBoardName = (boardId: string) => {
    const board = trustBoards.find(b => b.id === boardId);
    return board?.name || boardId;
  };

  const handleCreateBridge = () => {
    setCreateDialogOpen(true);
  };

  const handleViewBridge = (bridge: TrustBridge) => {
    setSelectedBridge(bridge);
    setViewDialogOpen(true);
  };

  const handleSyncBridge = async (bridgeId: string) => {
    setLoading(true);
    // Simulate sync operation
    setTimeout(() => {
      setBridges(prev => prev.map(bridge => 
        bridge.id === bridgeId 
          ? { ...bridge, lastSync: Date.now() }
          : bridge
      ));
      setLoading(false);
    }, 2000);
  };

  const BridgeCard: React.FC<{ bridge: TrustBridge }> = ({ bridge }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getBridgeTypeIcon(bridge.bridgeType)}
            <Typography variant="h6" component="h3" fontWeight="bold">
              {bridge.name}
            </Typography>
          </Box>
          <Chip 
            label={bridge.status} 
            color={getStatusColor(bridge.status) as any}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {bridge.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Organizations:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
              <OrgIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2">
              {getOrganizationName(bridge.sourceOrganization)}
            </Typography>
            <LinkIcon fontSize="small" color="action" />
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
              <OrgIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2">
              {getOrganizationName(bridge.targetOrganization)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            TrustBoards:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getTrustBoardName(bridge.sourceTrustBoard)} ↔ {getTrustBoardName(bridge.targetTrustBoard)}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main">
                {bridge.totalVerifications.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verifications
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {bridge.successRate}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Success Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {bridge.isPublic && <Chip label="Public" size="small" icon={<PublicIcon />} />}
          {!bridge.isPublic && <Chip label="Private" size="small" icon={<PrivateIcon />} />}
          {bridge.autoSync && <Chip label="Auto-Sync" size="small" icon={<SyncIcon />} />}
          <Chip label={bridge.bridgeType} size="small" variant="outlined" />
        </Box>

        {bridge.lastSync > 0 && (
          <Typography variant="caption" color="text.secondary">
            Last synced: {new Date(bridge.lastSync).toLocaleString()}
          </Typography>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<ViewIcon />}
              onClick={() => handleViewBridge(bridge)}
            >
              View
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<RefreshIcon />}
              onClick={() => handleSyncBridge(bridge.id)}
              disabled={loading}
            >
              Sync
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<SettingsIcon />}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const CreateBridgeDialog: React.FC = () => {
    const [newBridge, setNewBridge] = useState({
      name: '',
      description: '',
      sourceOrganization: '',
      targetOrganization: '',
      sourceTrustBoard: '',
      targetTrustBoard: '',
      bridgeType: 'bilateral' as const,
      isPublic: true,
      autoSync: true,
      syncFrequency: 'daily'
    });

    const handleSave = () => {
      // Implementation would create the bridge
      setCreateDialogOpen(false);
    };

    return (
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New TrustBridge</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper orientation="vertical" activeStep={0}>
              <Step>
                <StepLabel>Basic Information</StepLabel>
                <StepContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bridge Name"
                        value={newBridge.name}
                        onChange={(e) => setNewBridge({...newBridge, name: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={newBridge.description}
                        onChange={(e) => setNewBridge({...newBridge, description: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Bridge Type</InputLabel>
                        <Select
                          value={newBridge.bridgeType}
                          onChange={(e) => setNewBridge({...newBridge, bridgeType: e.target.value as any})}
                        >
                          <MenuItem value="bilateral">Bilateral</MenuItem>
                          <MenuItem value="unidirectional">Unidirectional</MenuItem>
                          <MenuItem value="multi-party">Multi-Party</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Sync Frequency</InputLabel>
                        <Select
                          value={newBridge.syncFrequency}
                          onChange={(e) => setNewBridge({...newBridge, syncFrequency: e.target.value})}
                        >
                          <MenuItem value="realtime">Real-time</MenuItem>
                          <MenuItem value="hourly">Hourly</MenuItem>
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="manual">Manual</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Organizations & TrustBoards</StepLabel>
                <StepContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Source Organization</InputLabel>
                        <Select
                          value={newBridge.sourceOrganization}
                          onChange={(e) => setNewBridge({...newBridge, sourceOrganization: e.target.value})}
                        >
                          {organizations.map(org => (
                            <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Target Organization</InputLabel>
                        <Select
                          value={newBridge.targetOrganization}
                          onChange={(e) => setNewBridge({...newBridge, targetOrganization: e.target.value})}
                        >
                          {organizations.map(org => (
                            <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Source TrustBoard</InputLabel>
                        <Select
                          value={newBridge.sourceTrustBoard}
                          onChange={(e) => setNewBridge({...newBridge, sourceTrustBoard: e.target.value})}
                        >
                          {trustBoards
                            .filter(board => board.organizationId === newBridge.sourceOrganization)
                            .map(board => (
                              <MenuItem key={board.id} value={board.id}>{board.name}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Target TrustBoard</InputLabel>
                        <Select
                          value={newBridge.targetTrustBoard}
                          onChange={(e) => setNewBridge({...newBridge, targetTrustBoard: e.target.value})}
                        >
                          {trustBoards
                            .filter(board => board.organizationId === newBridge.targetOrganization)
                            .map(board => (
                              <MenuItem key={board.id} value={board.id}>{board.name}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Settings & Permissions</StepLabel>
                <StepContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newBridge.isPublic}
                          onChange={(e) => setNewBridge({...newBridge, isPublic: e.target.checked})}
                        />
                      }
                      label="Public Bridge (visible to all organizations)"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newBridge.autoSync}
                          onChange={(e) => setNewBridge({...newBridge, autoSync: e.target.checked})}
                        />
                      }
                      label="Enable automatic synchronization"
                    />
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Create Bridge</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const ViewBridgeDialog: React.FC = () => {
    if (!selectedBridge) return null;

    return (
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getBridgeTypeIcon(selectedBridge.bridgeType)}
            <Typography variant="h6">{selectedBridge.name}</Typography>
            <Chip 
              label={selectedBridge.status} 
              color={getStatusColor(selectedBridge.status) as any}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Tabs value={0}>
              <Tab label="Overview" />
              <Tab label="Field Mappings" />
              <Tab label="Verification Rules" />
              <Tab label="Analytics" />
            </Tabs>
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Bridge Configuration
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Type" secondary={selectedBridge.bridgeType} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Auto-Sync" secondary={selectedBridge.autoSync ? 'Enabled' : 'Disabled'} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Sync Frequency" secondary={selectedBridge.syncFrequency} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Public" secondary={selectedBridge.isPublic ? 'Yes' : 'No'} />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Last Sync" 
                            secondary={selectedBridge.lastSync > 0 ? new Date(selectedBridge.lastSync).toLocaleString() : 'Never'} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Performance Metrics
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Success Rate: {selectedBridge.successRate}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedBridge.successRate} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="primary.main">
                              {selectedBridge.totalVerifications.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total Verifications
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">
                              {Math.round(selectedBridge.totalVerifications * selectedBridge.successRate / 100).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Successful
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />}>Edit Bridge</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BridgeIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                TrustBridges
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Cross-Organization Verification Network
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateBridge}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
            }}
          >
            Create Bridge
          </Button>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <BridgeIcon />
              </Avatar>
              <Typography variant="h4" color="primary.main">
                {bridges.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Bridges
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <VerifiedIcon />
              </Avatar>
              <Typography variant="h4" color="success.main">
                {bridges.reduce((sum, bridge) => sum + bridge.totalVerifications, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Verifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <SpeedIcon />
              </Avatar>
              <Typography variant="h4" color="warning.main">
                {(bridges.reduce((sum, bridge) => sum + bridge.successRate, 0) / bridges.length).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                <GroupIcon />
              </Avatar>
              <Typography variant="h4" color="info.main">
                {organizations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connected Organizations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="All Bridges" />
          <Tab label="Active" />
          <Tab label="Pending" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Bridge Cards */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {bridges.map((bridge) => (
            <Grid item xs={12} md={6} lg={4} key={bridge.id}>
              <BridgeCard bridge={bridge} />
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 1 && (
        <Grid container spacing={3}>
          {bridges.filter(bridge => bridge.status === 'active').map((bridge) => (
            <Grid item xs={12} md={6} lg={4} key={bridge.id}>
              <BridgeCard bridge={bridge} />
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 2 && (
        <Grid container spacing={3}>
          {bridges.filter(bridge => bridge.status === 'pending').map((bridge) => (
            <Grid item xs={12} md={6} lg={4} key={bridge.id}>
              <BridgeCard bridge={bridge} />
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bridge Performance
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">
                    Analytics charts would be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Verification Trends
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">
                    Trend analysis would be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Dialogs */}
      <CreateBridgeDialog />
      <ViewBridgeDialog />
    </Box>
  );
};
