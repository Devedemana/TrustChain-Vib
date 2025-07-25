// Organization Management Components - Admin Panel and Team Management
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Alert,
  LinearProgress,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

import { OrganizationService } from '../services/organizationService';
import { 
  Organization, 
  OrganizationMember, 
  MemberInvitation, 
  TeamRole,
  AccessLevel 
} from '../types/organizations';

interface OrganizationManagementProps {
  organizationId: string;
  currentUserId: string;
  userRole: TeamRole;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`org-tabpanel-${index}`}
      aria-labelledby={`org-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const OrganizationManagement: React.FC<OrganizationManagementProps> = ({
  organizationId,
  currentUserId,
  userRole
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const organizationService = OrganizationService.getInstance();

  // Form states
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'viewer' as TeamRole,
    accessLevel: 'limited' as AccessLevel,
    message: ''
  });

  const [orgSettings, setOrgSettings] = useState({
    privacy: 'private' as const,
    allowPublicVerification: false,
    requireMemberApproval: true,
    dataRetention: 365,
    maxMembers: 50
  });

  useEffect(() => {
    loadOrganizationData();
  }, [organizationId]);

  const loadOrganizationData = async () => {
    setLoading(true);
    try {
      const [orgResult, statsResult] = await Promise.all([
        organizationService.getOrganization(organizationId),
        organizationService.getOrganizationStats(organizationId)
      ]);

      if (orgResult.success && orgResult.data) {
        setOrganization(orgResult.data);
        setOrgSettings({
          privacy: orgResult.data.settings.privacy,
          allowPublicVerification: orgResult.data.settings.allowPublicVerification,
          requireMemberApproval: orgResult.data.settings.requireMemberApproval,
          dataRetention: orgResult.data.settings.dataRetention,
          maxMembers: orgResult.data.settings.maxMembers
        });
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      setError('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    try {
      const result = await organizationService.inviteMember(organizationId, {
        ...inviteForm,
        invitedBy: currentUserId
      });

      if (result.success) {
        setSuccess('Invitation sent successfully');
        setInviteDialogOpen(false);
        setInviteForm({
          email: '',
          name: '',
          role: 'viewer',
          accessLevel: 'limited',
          message: ''
        });
        await loadOrganizationData();
      } else {
        setError(result.error || 'Failed to send invitation');
      }
    } catch (error) {
      setError('Failed to send invitation');
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    try {
      const result = await organizationService.updateMember(
        organizationId,
        selectedMember.userId,
        selectedMember
      );

      if (result.success) {
        setSuccess('Member updated successfully');
        setEditMemberDialogOpen(false);
        setSelectedMember(null);
        await loadOrganizationData();
      } else {
        setError(result.error || 'Failed to update member');
      }
    } catch (error) {
      setError('Failed to update member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const result = await organizationService.removeMember(organizationId, userId);
        if (result.success) {
          setSuccess('Member removed successfully');
          await loadOrganizationData();
        } else {
          setError(result.error || 'Failed to remove member');
        }
      } catch (error) {
        setError('Failed to remove member');
      }
    }
  };

  const handleUpdateSettings = async () => {
    if (!organization) return;

    try {
      const result = await organizationService.updateOrganization(organizationId, {
        settings: {
          ...organization.settings,
          ...orgSettings
        }
      });

      if (result.success) {
        setSuccess('Settings updated successfully');
        await loadOrganizationData();
      } else {
        setError(result.error || 'Failed to update settings');
      }
    } catch (error) {
      setError('Failed to update settings');
    }
  };

  const getRoleColor = (role: TeamRole) => {
    const colors = {
      owner: 'error',
      admin: 'warning',
      manager: 'info',
      editor: 'success',
      viewer: 'default'
    };
    return colors[role.name as keyof typeof colors] as any;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      suspended: 'error'
    };
    return (colors[status as keyof typeof colors] || 'default') as 'success' | 'warning' | 'error' | 'default';
  };

  const canManageMembers = ['owner', 'admin'].includes(userRole);
  const canManageSettings = ['owner', 'admin'].includes(userRole);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Loading organization data...
        </Typography>
      </Box>
    );
  }

  if (!organization) {
    return (
      <Alert severity="error">
        Organization not found or you don't have access to view it.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Organization Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <BusinessIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {organization.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {organization.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={organization.type}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={organization.industry}
                size="small"
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={organization.subscription.plan}
                size="small"
                color="success"
              />
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadOrganizationData}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" icon={<AnalyticsIcon />} />
          <Tab label="Members" icon={<PersonIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
          <Tab label="Security" icon={<SecurityIcon />} />
          <Tab label="Billing" icon={<BusinessIcon />} />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {organization.stats.totalMembers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {organization.stats.totalTrustBoards}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TrustBoards
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {organization.stats.totalRecords?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {organization.stats.totalVerifications?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics Charts */}
          {stats?.insights && (
            <>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Member Growth
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={stats.insights.memberGrowth.map((value: number, index: number) => ({ month: index + 1, members: value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="members" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Verification Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={stats.insights.verificationTrends.map((value: number, index: number) => ({ day: index + 1, verifications: value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="verifications" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List>
                      {stats.insights.recentActivity.map((activity: any, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.action}
                            secondary={`by ${activity.user} • ${new Date(activity.timestamp).toLocaleString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </TabPanel>

      {/* Members Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Team Members ({organization.members.length})
          </Typography>
          {canManageMembers && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setInviteDialogOpen(true)}
            >
              Invite Member
            </Button>
          )}
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Access Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                {canManageMembers && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {organization.members.map((member: OrganizationMember) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.role}
                      size="small"
                      color={getRoleColor(member.role)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {member.accessLevel}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      size="small"
                      color={getStatusColor(member.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  {canManageMembers && (
                    <TableCell>
                      <Tooltip title="Edit Member">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedMember(member);
                            setEditMemberDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {member.role !== 'owner' && member.userId !== currentUserId && (
                        <Tooltip title="Remove Member">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveMember(member.userId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={2}>
        {canManageSettings ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Privacy Level</InputLabel>
                      <Select
                        value={orgSettings.privacy}
                        onChange={(e) => setOrgSettings({ ...orgSettings, privacy: e.target.value as any })}
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                        <MenuItem value="restricted">Restricted</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Data Retention (days)"
                      type="number"
                      value={orgSettings.dataRetention}
                      onChange={(e) => setOrgSettings({ ...orgSettings, dataRetention: parseInt(e.target.value) })}
                      fullWidth
                    />

                    <TextField
                      label="Maximum Members"
                      type="number"
                      value={orgSettings.maxMembers}
                      onChange={(e) => setOrgSettings({ ...orgSettings, maxMembers: parseInt(e.target.value) })}
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Verification Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Allow Public Verification"
                        secondary="Enable external verification requests"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={orgSettings.allowPublicVerification}
                          onChange={(e) => setOrgSettings({ ...orgSettings, allowPublicVerification: e.target.checked })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Require Member Approval"
                        secondary="New members need approval to join"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={orgSettings.requireMemberApproval}
                          onChange={(e) => setOrgSettings({ ...orgSettings, requireMemberApproval: e.target.checked })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={loadOrganizationData}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdateSettings}>
                  Save Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            You don't have permission to manage organization settings.
          </Alert>
        )}
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Compliance Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon color={organization.compliance.gdprCompliant ? 'success' : 'disabled'} />
                      <Typography variant="body2">GDPR</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon color={organization.compliance.hipaaCompliant ? 'success' : 'disabled'} />
                      <Typography variant="body2">HIPAA</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon color={organization.compliance.soc2Compliant ? 'success' : 'disabled'} />
                      <Typography variant="body2">SOC 2</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon color={organization.compliance.auditingEnabled ? 'success' : 'disabled'} />
                      <Typography variant="body2">Auditing</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Organization Verification
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={organization.verification.status}
                    color={organization.verification.status === 'verified' ? 'success' : 'warning'}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Level: {organization.verification.verificationLevel}
                  </Typography>
                </Box>
                {organization.verification.verificationNotes && (
                  <Typography variant="body2">
                    {organization.verification.verificationNotes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Billing Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Plan
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {organization.subscription.plan.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status: {organization.subscription.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Billing Email: {organization.subscription.billingEmail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Usage Limits
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="body2">
                      TrustBoards: {organization.stats.totalTrustBoards} / {organization.subscription.limits.maxTrustBoards}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(organization.stats.totalTrustBoards / organization.subscription.limits.maxTrustBoards) * 100}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Members: {organization.stats.totalMembers} / {organization.subscription.limits.maxMembers}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(organization.stats.totalMembers / organization.subscription.limits.maxMembers) * 100}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Records: {organization.stats.totalRecords || 0} / {organization.subscription.limits.maxRecords}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={((organization.stats.totalRecords || 0) / organization.subscription.limits.maxRecords) * 100}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plan Features
                </Typography>
                <Grid container spacing={2}>
                  {organization.subscription.features.map((feature: string) => (
                    <Grid item xs={12} sm={6} md={4} key={feature}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckIcon color="success" fontSize="small" />
                        <Typography variant="body2">
                          {feature.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite New Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Email Address"
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Full Name"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as TeamRole })}
              >
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                {userRole === 'owner' && <MenuItem value="admin">Admin</MenuItem>}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Access Level</InputLabel>
              <Select
                value={inviteForm.accessLevel}
                onChange={(e) => setInviteForm({ ...inviteForm, accessLevel: e.target.value as AccessLevel })}
              >
                <MenuItem value="limited">Limited</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Welcome Message (Optional)"
              multiline
              rows={3}
              value={inviteForm.message}
              onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInviteMember} variant="contained">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editMemberDialogOpen} onClose={() => setEditMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Full Name"
                value={selectedMember.name}
                onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedMember.role}
                  onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value as TeamRole })}
                >
                  <MenuItem value="viewer">Viewer</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  {userRole === 'owner' && <MenuItem value="admin">Admin</MenuItem>}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Access Level</InputLabel>
                <Select
                  value={selectedMember.accessLevel}
                  onChange={(e) => setSelectedMember({ ...selectedMember, accessLevel: e.target.value as AccessLevel })}
                >
                  <MenuItem value="limited">Limited</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="full">Full</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedMember.status}
                  onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value as any })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMemberDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateMember} variant="contained">
            Update Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationManagement;
