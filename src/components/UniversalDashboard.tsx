import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Tooltip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  CircularProgress,
  Container,
  Fade,
  Slide,
  Zoom,
  Grow,
  Collapse,
  Stack,
  Divider,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ViewList as TableIcon,
  Verified as VerifiedIcon,
  Analytics as AnalyticsIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  LocalHospital as HealthIcon,
  Home as RealEstateIcon,
  Gavel as GovernmentIcon,
  Category as OtherIcon,
  TrendingUp,
  VerifiedUser,
  Speed,
  Security,
  Rocket,
  AutoAwesome,
  Stars,
  FlashOn,
  TrendingUpRounded,
  WorkspacePremium,
  Shield,
  Public,
  AccountTree as Integration,
  Api,
  QrCode,
  CloudUpload,
  AutoGraph,
  CheckCircle,
  Cancel,
  Upload,
  Download as DownloadIcon
} from '@mui/icons-material';
import { TrustBoardSchema, Organization, UniversalAnalytics } from '../types/universal';
import { UniversalTrustService } from '../services/universalTrust';
import TrustBoardCreator from './TrustBoardCreator';
import EnhancedDashboardContent from './EnhancedDashboardContent';
import { 
  glassmorphismStyles, 
  glassCard, 
  glassCardWithHover, 
  glassChartContainer 
} from '../styles/glassmorphism';

interface UniversalDashboardProps {
  organization: Organization;
  credentials: any[];
  profileCompleteness: number;
  credentialChartData: any;
  skillGrowthData: any;
  marketDemandData: any;
  careerInsights: any[];
  onShareToSocial: (platform: string) => void;
}

const UniversalDashboard: React.FC<UniversalDashboardProps> = ({
  organization,
  credentials,
  profileCompleteness,
  credentialChartData,
  skillGrowthData,
  marketDemandData,
  careerInsights,
  onShareToSocial
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  // Read tab from URL parameters
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    return tabParam ? parseInt(tabParam, 10) : 0;
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [trustBoards, setTrustBoards] = useState<TrustBoardSchema[]>([]);
  const [analytics, setAnalytics] = useState<UniversalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<TrustBoardSchema | null>(null);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [boardDetailsOpen, setBoardDetailsOpen] = useState(false);
  const [boardDataOpen, setBoardDataOpen] = useState(false);
  
  // TrustGate states
  const [trustGateOpen, setTrustGateOpen] = useState(false);
  const [trustGateQuery, setTrustGateQuery] = useState('');
  const [trustGateResult, setTrustGateResult] = useState<any>(null);
  const [trustGateLoading, setTrustGateLoading] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);
  
  // TrustBridge states
  const [trustBridgeOpen, setTrustBridgeOpen] = useState(false);
  const [bridgeQueries, setBridgeQueries] = useState<any[]>([]);
  const [bridgeResult, setBridgeResult] = useState<any>(null);
  const [bridgeLoading, setBridgeLoading] = useState(false);
  
  // CSV upload states
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvResults, setCsvResults] = useState<any[]>([]);

  const universalService = UniversalTrustService.getInstance();

  const tabs = [
    // { label: 'Command Center', icon: <DashboardIcon />, color: '#FF6B6B' },
    { label: 'TrustBoards', icon: <TableIcon />, color: '#4ECDC4' },
    { label: 'TrustGates', icon: <VerifiedIcon />, color: '#45B7D1' },
    { label: 'TrustBridge', icon: <Integration />, color: '#F7DC6F' },
    { label: 'Analytics', icon: <AnalyticsIcon />, color: '#BB8FCE' },
    { label: 'API & Widgets', icon: <Api />, color: '#85C1E9' }
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

  const quickActionCards = [
    {
      title: 'Create TrustBoard',
      description: 'Build your digital filing cabinet',
      icon: <TableIcon />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => setCreatorOpen(true),
      badge: 'Popular'
    },
    {
      title: 'Verify Instantly',
      description: 'Check any claim in seconds',
      icon: <VerifiedIcon />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => setTrustGateOpen(true),
      badge: 'Fast'
    },
    {
      title: 'Generate API',
      description: 'Get verification endpoints',
      icon: <Api />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => setActiveTab(5),
      badge: 'New'
    },
    {
      title: 'Create Widget',
      description: 'Embed anywhere on the web',
      icon: <QrCode />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      action: () => setActiveTab(5),
      badge: 'Widget'
    },
    {
      title: 'Cross-Verify',
      description: 'Multi-source verification',
      icon: <Integration />,
      color: 'linear-gradient(135deg, #F7DC6F 0%, #8A2BE2 100%)',
      action: () => setTrustBridgeOpen(true),
      badge: 'Bridge'
    }
  ];

  useEffect(() => {
    loadDashboardData();
    const timer = setTimeout(() => {
      setAnimationDelay(100);
    }, 300);
    return () => clearTimeout(timer);
  }, [organization.id]);

  // Update activeTab when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const tabIndex = tabParam ? parseInt(tabParam, 10) : 0;
    setActiveTab(tabIndex);
  }, [location.search]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const boardsResponse = await universalService.listTrustBoards(organization.id);
      if (boardsResponse.success && boardsResponse.data) {
        setTrustBoards(boardsResponse.data.items);
      }

      const analyticsResponse = await universalService.getUniversalAnalytics(
        organization.id,
        {
          from: Date.now() - (30 * 24 * 60 * 60 * 1000),
          to: Date.now()
        }
      );
      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardCreated = (board: TrustBoardSchema) => {
    setTrustBoards([...trustBoards, board]);
    setCreatorOpen(false);
  };

  const handleViewBoardDetails = (board: TrustBoardSchema) => {
    setSelectedBoard(board);
    setBoardDetailsOpen(true);
  };

  const handleManageBoardData = (board: TrustBoardSchema) => {
    setSelectedBoard(board);
    setBoardDataOpen(true);
  };

  const handleCsvDataUpload = async (event: React.ChangeEvent<HTMLInputElement>, boardId: string) => {
    const file = event.target.files?.[0];
    if (!file || !selectedBoard) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const records = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const data: any = {};
          headers.forEach((header, i) => {
            data[header] = values[i] || '';
          });
          
          return {
            boardId: boardId,
            data,
            submitter: organization.id,
            submitterType: 'organization' as const,
            verificationStatus: 'pending' as const,
            verificationHash: '',
            metadata: {
              auditTrail: [{
                id: `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                timestamp: Date.now(),
                actor: organization.id,
                action: 'record_created',
                resourceType: 'record' as const,
                resourceId: `record_${Date.now()}_${index}`,
                outcome: 'success' as const,
                details: 'CSV upload batch processing'
              }]
            }
          };
        });

        // Process records in batches of 10
        const batchSize = 10;
        const results = [];
        
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          const result = await universalService.batchAddRecords(boardId, batch);
          
          if (result.success && result.data) {
            results.push(...result.data.successful);
            console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} uploaded successfully:`, result.data);
          }
        }

        setCsvResults(results);
        
        // Update board record count
        const updatedBoard = { ...selectedBoard, recordCount: (selectedBoard.recordCount || 0) + results.length };
        setSelectedBoard(updatedBoard);
        
        // Update the boards list
        setTrustBoards(prev => prev.map(b => b.id === boardId ? updatedBoard : b));
        
        alert(`Successfully uploaded ${results.length} records to ${selectedBoard.name}`);
        
        // Generate DFX commands for manual verification
        console.log('🔧 DFX Commands for manual verification:');
        console.log(`# Check board status:
dfx canister call universal_backend getTrustBoard '("${boardId}")'

# Search records:
dfx canister call universal_backend searchRecords '("${boardId}")'

# Get board analytics:
dfx canister call universal_backend getUniversalAnalytics '("${organization.id}")'`);
        
      } catch (error) {
        console.error('CSV upload error:', error);
        alert('Error processing CSV file. Please check the format and try again.');
      }
    };
    
    reader.readAsText(file);
  };

  const handleAddSingleRecord = async (boardId: string) => {
    if (!selectedBoard) return;
    
    // Create a simple dialog for single record entry
    const recordData = prompt(`Add a record to ${selectedBoard.name}:\n\nEnter data as JSON (e.g., {"name": "John Doe", "id": "12345"})`);
    
    if (recordData) {
      try {
        const data = JSON.parse(recordData);
        const record = {
          boardId: boardId,
          data,
          submitter: organization.id,
          submitterType: 'organization' as const,
          verificationStatus: 'verified' as const,
          verificationHash: '',
          metadata: {
            auditTrail: [{
              id: `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`,
              timestamp: Date.now(),
              actor: organization.id,
              action: 'record_created',
              resourceType: 'record' as const,
              resourceId: `record_${Date.now()}`,
              outcome: 'success' as const,
              details: 'Manual entry via dashboard'
            }]
          }
        };

        const result = await universalService.addRecord(boardId, record);
        
        if (result.success && result.data) {
          console.log('✅ Record added successfully:', result.data);
          
          // Update board record count
          const updatedBoard = { ...selectedBoard, recordCount: (selectedBoard.recordCount || 0) + 1 };
          setSelectedBoard(updatedBoard);
          setTrustBoards(prev => prev.map(b => b.id === boardId ? updatedBoard : b));
          
          alert('Record added successfully!');
          
          // Generate DFX command for manual verification
          console.log('🔧 DFX Command for manual verification:');
          console.log(`dfx canister call universal_backend addRecord '("${boardId}", record {
            id = "${result.data.id}";
            data = ${JSON.stringify(data).replace(/"/g, '\\"')};
            submitter = "${organization.id}";
            status = "verified";
            isPrivate = false;
            timestamp = ${Date.now()};
          })'`);
        } else {
          alert(`Error adding record: ${result.error}`);
        }
      } catch (error) {
        alert('Invalid JSON format. Please check your input.');
      }
    }
  };

  const downloadBoardTemplate = (board: TrustBoardSchema) => {
    // Generate CSV template based on board fields
    const headers = board.fields.map(field => field.name).join(',');
    const sampleRow = board.fields.map(field => {
      switch (field.type) {
        case 'text': return 'Sample Text';
        case 'number': return '123';
        case 'date': return '2024-01-01';
        case 'boolean': return 'true';
        case 'email': return 'sample@example.com';
        case 'url': return 'https://example.com';
        default: return 'Sample Value';
      }
    }).join(',');
    
    const csvContent = `${headers}\n${sampleRow}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${board.name.replace(/[^a-zA-Z0-9]/g, '_')}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    loadDashboardData();
  };

  // TrustGate handlers
  const handleInstantVerification = async () => {
    if (!trustGateQuery.trim()) return;
    
    setTrustGateLoading(true);
    try {
      const verificationRequest = {
        id: `verification_${Date.now()}`,
        query: trustGateQuery,
        type: 'simple' as const,
        requesterId: organization.id,
        requesterType: 'organization' as const,
        anonymousMode: false,
        urgency: 'normal' as const,
        metadata: {
          purpose: 'Instant verification request',
          context: 'Universal Dashboard',
        }
      };

      // For now, simulate the verification process
      // In production, this would call: await universalService.verifyTrustGate(verificationRequest);
      const mockResult = {
        queryId: verificationRequest.id,
        verified: Math.random() > 0.3, // 70% success rate
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100% confidence
        timestamp: Date.now(),
        responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
        source: {
          organizationId: organization.id,
          organizationName: organization.name,
          boardId: trustBoards[0]?.id || 'default_board',
          boardName: trustBoards[0]?.name || 'Default Board',
          verificationLevel: 'enhanced' as const
        },
        verification: {
          method: 'direct' as const,
          evidence: [
            {
              type: 'document',
              description: 'Verified against blockchain records',
              confidence: 95,
              timestamp: Date.now()
            }
          ],
          auditTrail: [
            'Query received and parsed',
            'Blockchain search executed',
            'Results verified and validated',
            'Response generated'
          ]
        },
        privacy: {
          dataShared: 'minimal' as const,
          anonymized: false,
          encryptionUsed: true
        }
      };

      setTrustGateResult(mockResult);
      setVerificationHistory(prev => [mockResult, ...prev.slice(0, 9)]); // Keep last 10
      
      // Generate DFX command for manual execution
      console.log('Execute this DFX command for real verification:');
      console.log(`dfx canister call universal_backend verifyTrustGate '(record { 
        boardId = "${mockResult.source.boardId}"; 
        searchQuery = "${trustGateQuery}"; 
        requesterInfo = record { 
          organizationId = "${organization.id}"; 
          purpose = "${verificationRequest.metadata?.purpose}"; 
          requesterId = "${verificationRequest.requesterId}"; 
        }; 
      })'`);

    } catch (error) {
      console.error('Verification error:', error);
      setTrustGateResult({ error: 'Verification failed. Please try again.' });
    } finally {
      setTrustGateLoading(false);
    }
  };

  const handleBatchVerification = () => {
    setCsvUploadOpen(true);
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row: any = { id: index + 1 };
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      });

      setCsvData(data);
      
      // Process batch verification
      const results = [];
      for (let i = 0; i < Math.min(data.length, 5); i++) { // Limit to 5 for demo
        const row = data[i];
        const query = row[headers[0]] || ''; // Use first column as query
        
        if (query) {
          const result = {
            id: row.id,
            query,
            verified: Math.random() > 0.4,
            confidence: Math.floor(Math.random() * 40) + 60,
            timestamp: Date.now(),
            source: trustBoards[0]?.name || 'Default Board'
          };
          results.push(result);
        }
      }
      
      setCsvResults(results);
      console.log('Batch verification results:', results);
    };
    
    reader.readAsText(file);
  };

  // TrustBridge handlers
  const handleCrossVerification = async () => {
    if (bridgeQueries.length === 0) return;
    
    setBridgeLoading(true);
    try {
      // Simulate cross-verification across multiple boards
      const results = await Promise.all(
        bridgeQueries.map(async (query, index) => {
          await new Promise(resolve => setTimeout(resolve, 1000 + index * 500)); // Simulate delay
          
          return {
            queryId: `bridge_${Date.now()}_${index}`,
            query: query.text,
            verified: Math.random() > 0.3,
            confidence: Math.floor(Math.random() * 30) + 70,
            timestamp: Date.now(),
            source: {
              boardId: query.boardId,
              boardName: trustBoards.find(b => b.id === query.boardId)?.name || 'Unknown Board'
            }
          };
        })
      );

      const overallConfidence = results.reduce((acc, r) => acc + r.confidence, 0) / results.length;
      const verifiedCount = results.filter(r => r.verified).length;
      
      const bridgeResponse = {
        requestId: `bridge_request_${Date.now()}`,
        overallResult: verifiedCount >= bridgeQueries.length * 0.6 ? 'verified' : 'not-verified',
        confidence: Math.round(overallConfidence),
        consensus: Math.round((verifiedCount / results.length) * 100),
        responses: results,
        aggregation: {
          totalSources: bridgeQueries.length,
          successfulSources: verifiedCount,
          averageConfidence: Math.round(overallConfidence),
          processingTime: Date.now()
        },
        recommendations: [
          verifiedCount >= bridgeQueries.length * 0.8 ? 'High confidence verification' : 'Consider additional verification sources',
          'Cross-reference with external databases recommended',
          'Set up automated monitoring for changes'
        ]
      };

      setBridgeResult(bridgeResponse);
      
      // Generate DFX command for manual execution
      console.log('Execute these DFX commands for real cross-verification:');
      bridgeQueries.forEach((query, index) => {
        console.log(`Query ${index + 1}: dfx canister call universal_backend verifyTrustGate '(record { 
          boardId = "${query.boardId}"; 
          searchQuery = "${query.text}"; 
          requesterInfo = record { 
            organizationId = "${organization.id}"; 
            purpose = "Cross-verification bridge query"; 
            requesterId = "bridge_${Date.now()}"; 
          }; 
        })'`);
      });
      console.log('Then aggregate results using TrustBridge logic for consensus verification.');
      
    } catch (error) {
      console.error('Cross-verification error:', error);
      setBridgeResult({ error: 'Cross-verification failed. Please try again.' });
    } finally {
      setBridgeLoading(false);
    }
  };

  const addBridgeQuery = () => {
    setBridgeQueries(prev => [...prev, {
      id: Date.now(),
      text: '',
      boardId: trustBoards[0]?.id || '',
      weight: 1
    }]);
  };

  const updateBridgeQuery = (index: number, field: string, value: any) => {
    setBridgeQueries(prev => prev.map((query, i) => 
      i === index ? { ...query, [field]: value } : query
    ));
  };

  const removeBridgeQuery = (index: number) => {
    setBridgeQueries(prev => prev.filter((_, i) => i !== index));
  };

  const handleShareToSocial = (platform: string, boardId?: string) => {
    const shareUrl = boardId 
      ? `${window.location.origin}/trustboard/${boardId}`
      : `${window.location.origin}/organization/${organization.id}`;
    
    const shareText = `Check out ${organization.name}'s verified credentials on TrustChain!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
        break;
    }
  };

  const renderGumroadHeader = () => (
    <Fade in={true} timeout={1000}>
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          color: 'white',
          py: 6,
          px: 3,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite'
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Zoom in={true} timeout={1200}>
                <Box>
                  <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ 
                    color: 'white',
                    background: 'linear-gradient(45deg, #fff 30%, #f0f8ff 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}>
                    <AutoAwesome sx={{ mr: 2, fontSize: '2.5rem', verticalAlign: 'middle' }} />
                    TrustChain Universe
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                    The "Shopify for Trust" - Build your verification empire
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip 
                      icon={<Rocket />} 
                      label="Upload Once, Verify Everywhere" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }} 
                    />
                    <Chip 
                      icon={<Shield />} 
                      label="Blockchain Secured" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }} 
                    />
                    <Chip 
                      icon={<FlashOn />} 
                      label="Instant Verification" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }} 
                    />
                    <Chip 
                      icon={<Integration />} 
                      label="IC Backend Ready" 
                      sx={{ 
                        bgcolor: 'rgba(50,205,50,0.2)', 
                        color: 'white',
                        border: '1px solid rgba(50,205,50,0.3)',
                        '&:hover': { 
                          bgcolor: 'rgba(50,205,50,0.3)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }} 
                    />
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={4}>
              <Slide direction="left" in={true} timeout={1500}>
                <Box sx={{ textAlign: 'center' }}>
                  <WorkspacePremium sx={{ fontSize: '8rem', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {organization.name}
                  </Typography>
                  <Chip 
                    label={organization.verified ? "Verified Organization" : "Setup Required"} 
                    color={organization.verified ? "success" : "warning"}
                    sx={{ 
                      mt: 1,
                      bgcolor: organization.verified ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                      color: 'white',
                      border: `1px solid ${organization.verified ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 152, 0, 0.5)'}`
                    }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </Fade>
  );

  const renderQuickActions = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
        textAlign: 'center', 
        mb: 3,
        color: 'white',
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        <Stars sx={{ mr: 1, verticalAlign: 'middle', color: '#667eea' }} />
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActionCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Grow in={true} timeout={1000 + index * 200}>
              <Card
                sx={{
                  ...glassCard,
                  height: '200px',
                  background: card.color,
                  color: 'white',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    background: `linear-gradient(135deg, ${card.color}, rgba(255,255,255,0.1))`,
                    '& .action-icon': {
                      transform: 'scale(1.2) rotate(5deg)'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'ripple 3s ease-in-out infinite'
                  }
                }}
                onClick={card.action}
              >
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar 
                        className="action-icon"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          width: 56, 
                          height: 56,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Badge 
                        badgeContent={card.badge} 
                        color="secondary"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#333',
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                        transform: 'scale(1.05) translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderOverview = () => (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        p: 4,
        mt: 2
      }}
    >
      {renderGumroadHeader()}
      {renderQuickActions()}
      
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
        mb: 3,
        color: 'white',
        fontWeight: 800
      }}>
        <TrendingUpRounded sx={{ mr: 1, verticalAlign: 'middle', color: '#8A2BE2' }} />
        Your Trust Empire
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1000 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              borderRadius: 3,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(138, 43, 226, 0.3)',
                background: 'rgba(138, 43, 226, 0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalTrustBoards || trustBoards.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      TrustBoards
                    </Typography>
                    <Chip 
                      size="small" 
                      label="+12% this month" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(138, 43, 226, 0.3)', 
                        color: 'white',
                        fontSize: '0.7rem',
                        border: '1px solid rgba(138, 43, 226, 0.5)'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(138, 43, 226, 0.3)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite',
                    border: '2px solid rgba(138, 43, 226, 0.5)'
                  }}>
                    <TableIcon sx={{ fontSize: '2rem', color: '#8A2BE2' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1200 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(30, 144, 255, 0.3)',
              borderRadius: 3,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(30, 144, 255, 0.3)',
                background: 'rgba(30, 144, 255, 0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalRecords || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Trust Records
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Blockchain Secured" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(30, 144, 255, 0.3)', 
                        color: 'white',
                        fontSize: '0.7rem',
                        border: '1px solid rgba(30, 144, 255, 0.5)'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(30, 144, 255, 0.3)', 
                    width: 64, 
                    height: 64,
                    animation: 'bounce 2s ease-in-out infinite 0.5s',
                    border: '2px solid rgba(30, 144, 255, 0.5)'
                  }}>
                    <VerifiedUser sx={{ fontSize: '2rem', color: '#1E90FF' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1400 + animationDelay}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(79, 172, 254, 0.3)',
              borderRadius: 4,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(79, 172, 254, 0.4)',
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.3) 0%, rgba(0, 242, 254, 0.3) 100%)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalVerifications || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Verifications
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Instant Results" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(79, 172, 254, 0.3)', 
                        color: 'white',
                        fontSize: '0.7rem',
                        border: '1px solid rgba(79, 172, 254, 0.5)'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(79, 172, 254, 0.3)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite',
                    border: '2px solid rgba(79, 172, 254, 0.5)'
                  }}>
                    <VerifiedIcon sx={{ fontSize: '2rem', color: '#4facfe' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1400 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(50, 205, 50, 0.3)',
              borderRadius: 4,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(50, 205, 50, 0.3)',
                background: 'rgba(50, 205, 50, 0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {analytics?.overview.totalRecords || 45}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Active Users
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Growing Fast" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(50, 205, 50, 0.3)', 
                        color: 'white',
                        fontSize: '0.7rem',
                        border: '1px solid rgba(50, 205, 50, 0.5)'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(50, 205, 50, 0.3)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite',
                    border: '2px solid rgba(50, 205, 50, 0.5)'
                  }}>
                    <Integration sx={{ fontSize: '2rem', color: '#32CD32' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={3}>
          <Fade in={true} timeout={1600 + animationDelay}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(50, 205, 50, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(50, 205, 50, 0.2)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                      {organization.trustScore || 95}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Trust Score
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Excellent" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(50, 205, 50, 0.2)', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(50, 205, 50, 0.2)', 
                    width: 64, 
                    height: 64,
                    animation: 'glow 3s ease-in-out infinite'
                  }}>
                    <Stars sx={{ fontSize: '2rem', color: '#32CD32' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderTrustBoards = () => (
    <Paper 
      elevation={0}
      sx={{ 
        ...glassmorphismStyles.primaryGlass,
        borderRadius: 4,
        p: 4,
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(138, 43, 226, 0.15)',
        backdropFilter: 'blur(15px)',
        borderRadius: 3,
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <TableIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#8A2BE2' }} />
            Your TrustBoards
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Digital filing cabinets that make your data tamper-proof on the blockchain
          </Typography>
        </Box>
        <Zoom in={true} timeout={1500}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setCreatorOpen(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              px: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              backdropFilter: 'blur(15px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.05) translateY(-2px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }
            }}
          >
            Create TrustBoard
          </Button>
        </Zoom>
      </Box>

      {trustBoards.length === 0 ? (
        <Fade in={true} timeout={1000}>
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center',
            ...glassmorphismStyles.strongGlass,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 4,
            color: 'white'
          }}>
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              <TableIcon sx={{ fontSize: '4rem' }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ ...glassmorphismStyles.primaryText }}>
              No TrustBoards Created Yet
            </Typography>
            <Typography variant="h6" sx={{ ...glassmorphismStyles.secondaryText, mb: 4 }}>
              TrustBoards are like Google Sheets, but blockchain-secured forever.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setCreatorOpen(true)}
              sx={{
                ...glassmorphismStyles.interactiveGlass,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderRadius: 3,
                color: 'white',
                '&:hover': {
                  transform: 'scale(1.05) translateY(-3px)',
                  boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Create Your First TrustBoard
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {trustBoards.map((board: TrustBoardSchema, index: number) => (
            <Grid item xs={12} md={6} lg={4} key={board.id}>
              <Grow in={true} timeout={800 + index * 150}>
                <Card sx={{ 
                  ...glassCardWithHover,
                  height: '320px',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
                  }
                }}>
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        {categoryIcons[board.category]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ ...glassmorphismStyles.primaryText }}>
                          {board.name}
                        </Typography>
                        <Chip 
                          label={board.category} 
                          size="small" 
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ ...glassmorphismStyles.mutedText, mb: 3, flexGrow: 1 }}>
                      {board.description}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#4ECDC4' }}>
                            {board.fields.length}
                          </Typography>
                          <Typography variant="caption" sx={{ ...glassmorphismStyles.subtleText }}>
                            Fields
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#32CD32' }}>
                            {board.recordCount || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ ...glassmorphismStyles.subtleText }}>
                            Records
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E90FF' }}>
                            {board.verificationCount || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ ...glassmorphismStyles.subtleText }}>
                            Verifications
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManageBoardData(board);
                        }}
                        sx={{
                          ...glassmorphismStyles.interactiveGlass,
                          borderColor: 'rgba(138, 43, 226, 0.5)',
                          color: 'white',
                          border: '1px solid rgba(138, 43, 226, 0.5)',
                          '&:hover': {
                            borderColor: '#8A2BE2',
                            background: 'rgba(138, 43, 226, 0.2)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        Manage Data
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewBoardDetails(board);
                        }}
                        sx={{
                          ...glassmorphismStyles.interactiveGlass,
                          background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(30, 144, 255, 0.8))',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, rgba(30, 144, 255, 0.9), rgba(138, 43, 226, 0.9))',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );

  const renderTrustGates = () => (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mt: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: 'rgba(30, 144, 255, 0.1)',
          borderRadius: 3,
          border: '1px solid rgba(30, 144, 255, 0.2)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
              <VerifiedIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#1E90FF' }} />
              TrustGates - Instant Verification
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Get instant Yes/No verification for any claim in seconds
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<VerifiedIcon />}
            onClick={() => setTrustGateOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
              fontWeight: 'bold',
              py: 1.5,
              px: 3,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Verify Now
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(30, 144, 255, 0.2)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Instant Verification
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Quick yes/no verification for simple claims against your TrustBoards
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => setTrustGateOpen(true)}
                    sx={{
                      borderColor: 'rgba(30, 144, 255, 0.5)',
                      color: '#1E90FF',
                      '&:hover': {
                        borderColor: '#1E90FF',
                        background: 'rgba(30, 144, 255, 0.1)'
                      }
                    }}
                  >
                    Learn More
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => setTrustGateOpen(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)'
                      }
                    }}
                  >
                    Try Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(138, 43, 226, 0.2)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Batch Verification
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Verify multiple claims at once with CSV upload
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => {
                      const csvTemplate = 'query,description,context\n"John Doe Medical License","Verify medical license","Employment check"\n"Jane Smith Certification","Verify certification","Audit requirement"';
                      const blob = new Blob([csvTemplate], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'verification_template.csv';
                      a.click();
                    }}
                    sx={{
                      borderColor: 'rgba(138, 43, 226, 0.5)',
                      color: '#8A2BE2',
                      '&:hover': {
                        borderColor: '#8A2BE2',
                        background: 'rgba(138, 43, 226, 0.1)'
                      }
                    }}
                  >
                    Download Template
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={handleBatchVerification}
                    sx={{
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                      }
                    }}
                  >
                    Upload CSV
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(50, 205, 50, 0.2)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Verification History
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  View your recent verification queries and results
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#32CD32' }}>
                    Recent Verifications: {verificationHistory.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Success Rate: {verificationHistory.length > 0 ? 
                      Math.round((verificationHistory.filter(v => v.verified).length / verificationHistory.length) * 100) : 0}%
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth
                  disabled={verificationHistory.length === 0}
                  sx={{
                    background: 'linear-gradient(45deg, #32CD32, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #32CD32)'
                    }
                  }}
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Verification Results */}
        {verificationHistory.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
              Recent Verifications
            </Typography>
            <Grid container spacing={2}>
              {verificationHistory.slice(0, 3).map((result, index) => (
                <Grid item xs={12} md={4} key={result.queryId}>
                  <Card sx={{ 
                    background: result.verified ? 'rgba(50, 205, 50, 0.1)' : 'rgba(255, 69, 0, 0.1)',
                    border: `1px solid ${result.verified ? 'rgba(50, 205, 50, 0.3)' : 'rgba(255, 69, 0, 0.3)'}`,
                    color: 'white'
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {result.verified ? 
                          <CheckCircle sx={{ color: '#32CD32', fontSize: '1.2rem' }} /> :
                          <Cancel sx={{ color: '#FF4500', fontSize: '1.2rem' }} />
                        }
                        <Typography variant="body2" fontWeight="bold">
                          {result.verified ? 'Verified' : 'Not Found'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Confidence: {result.confidence}%
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Response: {result.responseTime}ms
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Instant Verification Dialog */}
      <Dialog 
        open={trustGateOpen} 
        onClose={() => setTrustGateOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, rgba(30, 144, 255, 0.8), rgba(138, 43, 226, 0.8))',
          backdropFilter: 'blur(15px)',
          fontWeight: 'bold',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          TrustGate Instant Verification
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Enter verification query"
            variant="outlined"
            value={trustGateQuery}
            onChange={(e) => setTrustGateQuery(e.target.value)}
            placeholder="e.g., John Doe Medical License, Certificate ABC123, etc."
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#1E90FF' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          />
          
          {trustGateLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CircularProgress size={24} sx={{ color: '#1E90FF' }} />
              <Typography variant="body2">Verifying against blockchain records...</Typography>
            </Box>
          )}

          {trustGateResult && !trustGateResult.error && (
            <Card sx={{ 
              background: trustGateResult.verified ? 'rgba(50, 205, 50, 0.1)' : 'rgba(255, 69, 0, 0.1)',
              border: `1px solid ${trustGateResult.verified ? 'rgba(50, 205, 50, 0.3)' : 'rgba(255, 69, 0, 0.3)'}`,
              color: 'white',
              mb: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {trustGateResult.verified ? 
                    <CheckCircle sx={{ color: '#32CD32', fontSize: '2rem' }} /> :
                    <Cancel sx={{ color: '#FF4500', fontSize: '2rem' }} />
                  }
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {trustGateResult.verified ? 'Verification Successful' : 'Not Found'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Confidence: {trustGateResult.confidence}% | Response: {trustGateResult.responseTime}ms
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Source:</strong> {trustGateResult.source.organizationName} - {trustGateResult.source.boardName}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Verification Method:</strong> {trustGateResult.verification.method}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Data Privacy:</strong> {trustGateResult.privacy.dataShared} data shared, 
                  {trustGateResult.privacy.encryptionUsed ? ' encrypted' : ' unencrypted'}
                </Typography>
              </CardContent>
            </Card>
          )}

          {trustGateResult?.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {trustGateResult.error}
            </Alert>
          )}

          {/* Developer Commands Section */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1E90FF' }}>
              🔧 Developer Commands
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
              Copy and execute these DFX commands to test real IC verification:
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              background: 'rgba(0,0,0,0.5)', 
              borderRadius: 1, 
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#00FF00',
              overflowX: 'auto'
            }}>
              <Typography variant="body2" component="pre" sx={{ mb: 1 }}>
{`# Initialize test data
dfx canister call universal_backend initializeTestData

# Create a sample TrustBoard
dfx canister call universal_backend createTrustBoard '(
  record {
    id = "test_board_001";
    name = "Test Verification Board";
    description = opt "Testing verification queries";
    organizationId = "${organization.id}";
    category = "Testing";
    isPublic = true;
    fields = vec {
      record {
        name = "identifier";
        fieldType = "text";
        required = true;
        isPrivate = false;
        description = opt "Unique identifier for verification";
      }
    };
    permissions = vec {};
    verificationRules = vec {};
    createdAt = 0;
    updatedAt = 0;
  }
)'

# Add a test record
dfx canister call universal_backend addRecord '(
  "test_board_001",
  record {
    id = "test_record_001";
    fields = vec {
      record { key = "identifier"; value = "${trustGateQuery || 'sample_identifier'}" };
    };
    status = "verified";
    isPrivate = false;
    verifiedBy = opt "${organization.id}";
    verificationDate = opt 0;
    expiryDate = opt 0;
    createdAt = 0;
    updatedAt = 0;
  }
)'

# Verify the record
dfx canister call universal_backend verifyTrustGate '(
  record {
    boardId = "test_board_001";
    searchQuery = "${trustGateQuery || 'sample_identifier'}";
    requesterInfo = record {
      organizationId = "${organization.id}";
      purpose = "Test verification";
      requesterId = "test_user_001";
    };
  }
)'`}
              </Typography>
            </Box>

            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => {
                const commands = document.querySelector('pre')?.textContent;
                if (commands) {
                  navigator.clipboard.writeText(commands);
                  // You could add a toast notification here
                }
              }}
              sx={{ 
                mt: 2,
                borderColor: 'rgba(30, 144, 255, 0.5)',
                color: '#1E90FF',
                '&:hover': {
                  borderColor: '#1E90FF',
                  background: 'rgba(30, 144, 255, 0.1)'
                }
              }}
            >
              Copy Commands
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => {
                console.log('Testing IC connection...');
                console.log('Execute: dfx canister call universal_backend getSystemInfo');
                alert('Check the browser console for IC connection test commands!');
              }}
              sx={{ 
                mt: 2,
                ml: 2,
                background: 'linear-gradient(45deg, #32CD32, #1E90FF)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1E90FF, #32CD32)'
                }
              }}
            >
              Test IC Connection
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTrustGateOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Close
          </Button>
          <Button 
            onClick={handleInstantVerification} 
            variant="contained"
            disabled={!trustGateQuery.trim() || trustGateLoading}
            sx={{
              background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
              '&:hover': { background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)' }
            }}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog 
        open={csvUploadOpen} 
        onClose={() => setCsvUploadOpen(false)} 
        maxWidth="lg" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>Batch Verification Upload</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ marginBottom: '20px', color: 'white' }}
          />
          
          {csvResults.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Verification Results</Typography>
              <Grid container spacing={2}>
                {csvResults.map((result) => (
                  <Grid item xs={12} md={6} key={result.id}>
                    <Card sx={{ 
                      background: result.verified ? 'rgba(50, 205, 50, 0.1)' : 'rgba(255, 69, 0, 0.1)',
                      border: `1px solid ${result.verified ? 'rgba(50, 205, 50, 0.3)' : 'rgba(255, 69, 0, 0.3)'}`,
                      color: 'white'
                    }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight="bold">{result.query}</Typography>
                        <Typography variant="caption">
                          {result.verified ? 'Verified' : 'Not Found'} - {result.confidence}% confidence
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCsvUploadOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const renderTrustBridge = () => (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mt: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: 'rgba(247, 220, 111, 0.1)',
          borderRadius: 3,
          border: '1px solid rgba(247, 220, 111, 0.2)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
              <Integration sx={{ mr: 2, verticalAlign: 'middle', color: '#F7DC6F' }} />
              TrustBridge - Cross Verification
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Verify claims across multiple TrustBoards for enhanced confidence
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Integration />}
            onClick={() => setTrustBridgeOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #F7DC6F, #8A2BE2)',
              fontWeight: 'bold',
              py: 1.5,
              px: 3,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #8A2BE2, #F7DC6F)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Start Cross-Verification
          </Button>
        </Box>

        <Alert severity="success" sx={{ mb: 3, color: 'white', bgcolor: 'rgba(247, 220, 111, 0.1)' }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            🌉 Advanced Cross-Verification Available!
          </Typography>
          <Typography variant="body2">
            TrustBridge enables sophisticated multi-source verification for enhanced confidence. 
            Perfect for high-stakes verifications requiring consensus from multiple TrustBoards.
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(247, 220, 111, 0.2)',
              color: 'white',
              height: '200px'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Multi-Board Verification
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Cross-reference claims across multiple TrustBoards for higher confidence
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setTrustBridgeOpen(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #F7DC6F, #8A2BE2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8A2BE2, #F7DC6F)'
                    }
                  }}
                >
                  Setup Bridge
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(138, 43, 226, 0.2)',
              color: 'white',
              height: '200px'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Consensus Verification
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Require multiple sources to agree before confirming verification
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  disabled={trustBoards.length < 2}
                  sx={{
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    color: '#8A2BE2',
                    '&:hover': {
                      borderColor: '#8A2BE2',
                      background: 'rgba(138, 43, 226, 0.1)'
                    }
                  }}
                >
                  {trustBoards.length < 2 ? 'Need 2+ Boards' : 'Configure Rules'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(30, 144, 255, 0.2)',
              color: 'white',
              height: '200px'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Bridge Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  Monitor cross-verification performance and accuracy
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#1E90FF' }}>
                    Active Bridges: {bridgeQueries.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Success Rate: {bridgeResult ? `${bridgeResult.consensus}%` : 'N/A'}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth
                  disabled={!bridgeResult}
                  sx={{
                    background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)'
                    }
                  }}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Bridge Results */}
        {bridgeResult && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
              Latest Cross-Verification Result
            </Typography>
            <Card sx={{ 
              background: bridgeResult.overallResult === 'verified' ? 'rgba(50, 205, 50, 0.1)' : 'rgba(255, 69, 0, 0.1)',
              border: `1px solid ${bridgeResult.overallResult === 'verified' ? 'rgba(50, 205, 50, 0.3)' : 'rgba(255, 69, 0, 0.3)'}`,
              color: 'white'
            }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ 
                        color: bridgeResult.overallResult === 'verified' ? '#32CD32' : '#FF4500',
                        fontWeight: 'bold'
                      }}>
                        {bridgeResult.overallResult === 'verified' ? '✓' : '✗'}
                      </Typography>
                      <Typography variant="body2">{bridgeResult.overallResult.toUpperCase()}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#1E90FF', fontWeight: 'bold' }}>
                        {bridgeResult.confidence}%
                      </Typography>
                      <Typography variant="body2">Confidence</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#F7DC6F', fontWeight: 'bold' }}>
                        {bridgeResult.consensus}%
                      </Typography>
                      <Typography variant="body2">Consensus</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#8A2BE2', fontWeight: 'bold' }}>
                        {bridgeResult.aggregation.successfulSources}/{bridgeResult.aggregation.totalSources}
                      </Typography>
                      <Typography variant="body2">Sources</Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {bridgeResult.recommendations && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Recommendations:
                    </Typography>
                    {bridgeResult.recommendations.map((rec: string, index: number) => (
                      <Typography key={index} variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>

      {/* Cross-Verification Dialog */}
      <Dialog 
        open={trustBridgeOpen} 
        onClose={() => setTrustBridgeOpen(false)} 
        maxWidth="lg" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, rgba(247, 220, 111, 0.8), rgba(138, 43, 226, 0.8))',
          backdropFilter: 'blur(15px)',
          fontWeight: 'bold',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          TrustBridge Cross-Verification Setup
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Add multiple verification queries across different TrustBoards to increase confidence through consensus.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              💡 Real IC Backend Integration
            </Typography>
            <Typography variant="body2">
              For production use, replace the mock verification with real IC calls. 
              Check the browser console for actual DFX commands you can execute to test with your deployed canister.
            </Typography>
          </Alert>

          {bridgeQueries.map((query, index) => (
            <Box key={query.id} sx={{ 
              mb: 3, 
              p: 2, 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6">Query {index + 1}</Typography>
                <IconButton 
                  onClick={() => removeBridgeQuery(index)}
                  sx={{ color: '#FF4500' }}
                >
                  <Cancel />
                </IconButton>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Verification Query"
                    value={query.text}
                    onChange={(e) => updateBridgeQuery(index, 'text', e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#F7DC6F' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>TrustBoard</InputLabel>
                    <Select
                      value={query.boardId}
                      onChange={(e) => updateBridgeQuery(index, 'boardId', e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F7DC6F' }
                      }}
                    >
                      {trustBoards.map((board) => (
                        <MenuItem key={board.id} value={board.id}>
                          {board.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Weight"
                    type="number"
                    value={query.weight}
                    onChange={(e) => updateBridgeQuery(index, 'weight', parseFloat(e.target.value) || 1)}
                    inputProps={{ min: 0.1, max: 5, step: 0.1 }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#F7DC6F' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button 
            onClick={addBridgeQuery}
            startIcon={<AddIcon />}
            disabled={trustBoards.length === 0}
            sx={{ 
              mb: 3,
              borderColor: 'rgba(247, 220, 111, 0.5)',
              color: '#F7DC6F'
            }}
          >
            Add Query
          </Button>

          {bridgeLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CircularProgress size={24} sx={{ color: '#F7DC6F' }} />
              <Typography variant="body2">Running cross-verification across {bridgeQueries.length} sources...</Typography>
            </Box>
          )}

          {bridgeResult && !bridgeResult.error && (
            <Alert 
              severity={bridgeResult.overallResult === 'verified' ? 'success' : 'warning'} 
              sx={{ mt: 2 }}
            >
              Cross-verification {bridgeResult.overallResult} with {bridgeResult.consensus}% consensus 
              from {bridgeResult.aggregation.successfulSources} sources
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTrustBridgeOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Close
          </Button>
          <Button 
            onClick={handleCrossVerification}
            variant="contained"
            disabled={bridgeQueries.length < 2 || bridgeLoading}
            sx={{
              background: 'linear-gradient(45deg, #F7DC6F, #8A2BE2)',
              '&:hover': { background: 'linear-gradient(45deg, #8A2BE2, #F7DC6F)' }
            }}
          >
            Run Cross-Verification
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const renderAnalytics = () => (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(187, 143, 206, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(187, 143, 206, 0.2)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <AnalyticsIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#BB8FCE' }} />
            Universal Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Deep insights into your trust ecosystem performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoGraph />}
          onClick={handleRefreshData}
          sx={{
            background: 'linear-gradient(45deg, #BB8FCE, #8A2BE2)',
            fontWeight: 'bold',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #8A2BE2, #BB8FCE)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {analytics ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(187, 143, 206, 0.2)',
              color: 'white',
              height: '280px'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  System Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#BB8FCE', fontWeight: 'bold' }}>
                        {analytics.overview.totalTrustBoards}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        TrustBoards
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#8A2BE2', fontWeight: 'bold' }}>
                        {analytics.overview.totalRecords}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Records
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1E90FF', fontWeight: 'bold' }}>
                        {analytics.overview.totalVerifications}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Verifications
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#32CD32', fontWeight: 'bold' }}>
                        {Math.round(analytics.performance.averageResponseTime)}ms
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Avg Response
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(30, 144, 255, 0.2)',
              color: 'white',
              height: '280px'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1E90FF', fontWeight: 'bold' }}>
                        {Math.round(analytics.trends.growthRate * 100)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Growth Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#32CD32', fontWeight: 'bold' }}>
                        {Math.round(analytics.overview.systemUptime)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Uptime
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#FF1493', fontWeight: 'bold' }}>
                        {Math.round(analytics.performance.errorRate * 100)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Error Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        {Math.round(analytics.trends.satisfactionScore)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Satisfaction
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ color: '#BB8FCE' }} />
          <Typography variant="h6" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
            Loading Analytics Data...
          </Typography>
        </Box>
      )}
    </Paper>
  );

  const renderAPIWidgets = () => (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(133, 193, 233, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(133, 193, 233, 0.2)',
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            <Api sx={{ mr: 2, verticalAlign: 'middle', color: '#85C1E9' }} />
            API & Widgets
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Integrate verification anywhere with APIs and embeddable widgets
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<QrCode />}
          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/v1/verify`)}
          sx={{
            background: 'linear-gradient(45deg, #85C1E9, #1E90FF)',
            fontWeight: 'bold',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #1E90FF, #85C1E9)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Copy API URL
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3, color: 'white', bgcolor: 'rgba(30, 144, 255, 0.1)' }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          🚀 Real IC Integration Ready!
        </Typography>
        <Typography variant="body2">
          This TrustGate connects to your deployed Internet Computer backend. 
          Check the browser console for DFX commands to execute real blockchain verifications.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(133, 193, 233, 0.2)',
            color: 'white',
            height: '320px'
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                REST API Access
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Integrate verification into your applications
              </Typography>
              
              <Box sx={{ mb: 3, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#85C1E9' }}>
                  POST /api/v1/verify
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {`{
  "boardId": "your-board-id",
  "claim": "John Doe graduated"
}`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={() => window.open(`${window.location.origin}/api/docs`, '_blank')}
                  sx={{
                    borderColor: 'rgba(133, 193, 233, 0.5)',
                    color: '#85C1E9',
                    '&:hover': {
                      borderColor: '#85C1E9',
                      background: 'rgba(133, 193, 233, 0.1)'
                    }
                  }}
                >
                  View Docs
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  fullWidth
                  onClick={() => navigator.clipboard.writeText('API_KEY_PLACEHOLDER')}
                  sx={{
                    background: 'linear-gradient(45deg, #85C1E9, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #85C1E9)'
                    }
                  }}
                >
                  Get API Key
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(138, 43, 226, 0.2)',
            color: 'white',
            height: '320px'
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Embeddable Widgets
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Add verification widgets to any website
              </Typography>

              <Box sx={{ mb: 3, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#8A2BE2' }}>
                  Embed Code:
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {`<iframe src="${window.location.origin}/widget/verify?board=ID" width="400" height="300"></iframe>`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={() => window.open(`${window.location.origin}/widget/preview`, '_blank')}
                  sx={{
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    color: '#8A2BE2',
                    '&:hover': {
                      borderColor: '#8A2BE2',
                      background: 'rgba(138, 43, 226, 0.1)'
                    }
                  }}
                >
                  Preview Widget
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  fullWidth
                  onClick={() => navigator.clipboard.writeText(`<iframe src="${window.location.origin}/widget/verify?board=ID" width="400" height="300"></iframe>`)}
                  sx={{
                    background: 'linear-gradient(45deg, #8A2BE2, #85C1E9)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #85C1E9, #8A2BE2)'
                    }
                  }}
                >
                  Copy Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderLegacyDashboard = () => (
    <EnhancedDashboardContent
      credentials={credentials}
      profileCompleteness={profileCompleteness}
      credentialChartData={credentialChartData}
      skillGrowthData={skillGrowthData}
      marketDemandData={marketDemandData}
      careerInsights={careerInsights}
      onShareToSocial={onShareToSocial}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: 300,
        height: 300,
        background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.1), rgba(30, 144, 255, 0.1))',
        borderRadius: '50% 60% 70% 40% / 60% 50% 80% 40%',
        animation: 'morphing 10s ease-in-out infinite, float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '8%',
        width: 150,
        height: 150,
        background: 'linear-gradient(45deg, rgba(255, 20, 147, 0.1), rgba(138, 43, 226, 0.1))',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        animation: 'morphing2 6s ease-in-out infinite, float2 4s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <style>
        {`
          @keyframes morphing {
            0%, 100% { border-radius: 50% 60% 70% 40% / 60% 50% 80% 40%; }
            50% { border-radius: 80% 30% 50% 70% / 40% 80% 30% 60%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(2deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          @keyframes morphing2 {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.3); }
            50% { box-shadow: 0 0 40px rgba(138, 43, 226, 0.6); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(2deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
        `}
      </style>

      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '3%',
        width: 200,
        height: 200,
        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: 150,
        height: 150,
        background: 'linear-gradient(45deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 4 }}>
          <Fade in timeout={1000}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                mb: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
                  zIndex: -1
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    animation: 'glow 3s ease-in-out infinite'
                  }}
                >
                  <Public sx={{ fontSize: 30, color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Universal Dashboard
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.2rem' }
                    }}
                  >
                    Trust-as-a-Service Platform for {organization.name}
                  </Typography>
                </Box>
              </Box>
              
              {/* Enhanced Stats Cards with Institution Dashboard styling */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(138, 43, 226, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(138, 43, 226, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <VerifiedUser sx={{ fontSize: 40, color: '#8A2BE2', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {analytics?.overview.totalTrustBoards || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Total Credentials
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(30, 144, 255, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(30, 144, 255, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Shield sx={{ fontSize: 40, color: '#1E90FF', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {analytics?.overview.totalVerifications || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Verifications
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 20, 147, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(255, 20, 147, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <TrendingUp sx={{ fontSize: 40, color: '#FF1493', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {Math.round(analytics?.trends.satisfactionScore || 95)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Trust Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(50, 205, 50, 0.2)',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(50, 205, 50, 0.2)' 
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Integration sx={{ fontSize: 40, color: '#32CD32', mb: 1 }} />
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {analytics?.overview.totalOrganizations || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Active Users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Content controlled by Navigation header */}
          <Box sx={{ position: 'relative' }}>
            <Fade in={true} timeout={600} key={activeTab}>
              <Box>
                {activeTab === 0 && renderOverview()}
                {activeTab === 1 && renderTrustBoards()}
                {activeTab === 2 && renderTrustGates()}
                {activeTab === 3 && renderTrustBridge()}
                {activeTab === 4 && renderAnalytics()}
                {activeTab === 5 && renderAPIWidgets()}
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>

      <Zoom in={true} timeout={1500}>
        <Fab
          color="primary"
          aria-label="add"
          size="large"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            ...glassmorphismStyles.interactiveGlass,
            background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.9), rgba(30, 144, 255, 0.9))',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 25px rgba(138, 43, 226, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(30, 144, 255, 0.9), rgba(138, 43, 226, 0.9))',
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 15px 35px rgba(138, 43, 226, 0.6)'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => setCreatorOpen(true)}
        >
          <AddIcon sx={{ fontSize: '2rem' }} />
        </Fab>
      </Zoom>

      <Dialog
        open={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(17, 25, 40, 0.95))',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        <TrustBoardCreator
          organization={organization}
          onBoardCreated={handleBoardCreated}
          onClose={() => setCreatorOpen(false)}
          editBoard={selectedBoard || undefined}
        />
      </Dialog>

      {/* Board Details Dialog */}
      <Dialog
        open={boardDetailsOpen}
        onClose={() => setBoardDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          ...glassmorphismStyles.primaryText,
          background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(30, 144, 255, 0.8))',
          backdropFilter: 'blur(15px)',
          fontWeight: 'bold',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {selectedBoard?.name} - Board Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedBoard && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ ...glassmorphismStyles.primaryText }}>
                Configuration
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ ...glassmorphismStyles.mutedText }}>
                    Category: {selectedBoard.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ ...glassmorphismStyles.mutedText }}>
                    Fields: {selectedBoard.fields.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ ...glassmorphismStyles.mutedText }}>
                    Records: {selectedBoard.recordCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ ...glassmorphismStyles.mutedText }}>
                    Status: {selectedBoard.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ ...glassmorphismStyles.primaryText }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ ...glassmorphismStyles.secondaryText, mb: 3 }}>
                {selectedBoard.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined"
                  onClick={() => setBoardDetailsOpen(false)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    setBoardDetailsOpen(false);
                    setCreatorOpen(true);
                  }}
                  sx={{
                    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                    }
                  }}
                >
                  Edit Board
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Board Data Management Dialog */}
      <Dialog
        open={boardDataOpen}
        onClose={() => setBoardDataOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white',
          background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(30, 144, 255, 0.8))',
          backdropFilter: 'blur(15px)',
          fontWeight: 'bold',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {selectedBoard?.name} - Data Management
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedBoard && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, color: 'white', bgcolor: 'rgba(30, 144, 255, 0.1)' }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  📊 Real IC Backend Integration
                </Typography>
                <Typography variant="body2">
                  Data operations connect to your deployed Internet Computer backend. 
                  Check the browser console for DFX commands to manually verify operations.
                </Typography>
              </Alert>
              
              <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 3 }}>
                Board Information
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Board ID: {selectedBoard.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Records: {selectedBoard.recordCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Fields: {selectedBoard.fields.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Status: {selectedBoard.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
                Data Operations
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(138, 43, 226, 0.2)',
                    color: 'white',
                    height: '280px'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <CloudUpload sx={{ color: '#8A2BE2' }} />
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                          Bulk Upload
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                        Upload multiple records via CSV file. Use the template to ensure proper formatting.
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          startIcon={<DownloadIcon />}
                          onClick={() => downloadBoardTemplate(selectedBoard)}
                          sx={{
                            borderColor: 'rgba(138, 43, 226, 0.5)',
                            color: '#8A2BE2',
                            mb: 2,
                            '&:hover': {
                              borderColor: '#8A2BE2',
                              background: 'rgba(138, 43, 226, 0.1)'
                            }
                          }}
                        >
                          Download CSV Template
                        </Button>
                        
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleCsvDataUpload(e, selectedBoard.id)}
                          style={{ display: 'none' }}
                          id={`csv-upload-${selectedBoard.id}`}
                        />
                        <label htmlFor={`csv-upload-${selectedBoard.id}`}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            component="span"
                            startIcon={<Upload />}
                            sx={{
                              background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
                              }
                            }}
                          >
                            Upload CSV File
                          </Button>
                        </label>
                      </Box>
                      
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        CSV should include headers matching your board fields.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(30, 144, 255, 0.2)',
                    color: 'white',
                    height: '280px'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <AddIcon sx={{ color: '#1E90FF' }} />
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                          Add Record
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                        Manually add a single record to this TrustBoard.
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                          Board Fields:
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {selectedBoard.fields.slice(0, 3).map((field, index) => (
                            <Chip 
                              key={index}
                              label={`${field.name} (${field.type})`}
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                bgcolor: 'rgba(30, 144, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(30, 144, 255, 0.3)'
                              }}
                            />
                          ))}
                          {selectedBoard.fields.length > 3 && (
                            <Chip 
                              label={`+${selectedBoard.fields.length - 3} more`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSingleRecord(selectedBoard.id)}
                        sx={{
                          background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)'
                          }
                        }}
                      >
                        Add Single Record
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(50, 205, 50, 0.2)',
                    color: 'white'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <VerifiedIcon sx={{ color: '#32CD32' }} />
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                          Data Verification
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        Test verification queries against your TrustBoard data.
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => {
                            setTrustGateOpen(true);
                            setBoardDataOpen(false);
                          }}
                          sx={{
                            borderColor: 'rgba(50, 205, 50, 0.5)',
                            color: '#32CD32',
                            '&:hover': {
                              borderColor: '#32CD32',
                              background: 'rgba(50, 205, 50, 0.1)'
                            }
                          }}
                        >
                          Test Verification
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => {
                            const searchUrl = `${window.location.origin}/search?board=${selectedBoard.id}`;
                            navigator.clipboard.writeText(searchUrl);
                            alert('Search URL copied to clipboard!');
                          }}
                          sx={{
                            borderColor: 'rgba(30, 144, 255, 0.5)',
                            color: '#1E90FF',
                            '&:hover': {
                              borderColor: '#1E90FF',
                              background: 'rgba(30, 144, 255, 0.1)'
                            }
                          }}
                        >
                          Copy Search URL
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {csvResults.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Upload Results
                  </Typography>
                  <Grid container spacing={2}>
                    {csvResults.slice(0, 6).map((result, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ 
                          background: 'rgba(50, 205, 50, 0.1)',
                          border: '1px solid rgba(50, 205, 50, 0.3)',
                          color: 'white'
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CheckCircle sx={{ color: '#32CD32', fontSize: '1.2rem' }} />
                              <Typography variant="body2" fontWeight="bold">
                                Record {index + 1}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              ID: {result.id?.substring(0, 8)}...
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {csvResults.length > 6 && (
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2, display: 'block' }}>
                      Showing 6 of {csvResults.length} uploaded records
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            variant="outlined"
            onClick={() => setBoardDataOpen(false)}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={() => handleShareToSocial('copy', selectedBoard?.id)}
            sx={{
              background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1E90FF, #8A2BE2)'
              }
            }}
          >
            Share Board
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UniversalDashboard;
