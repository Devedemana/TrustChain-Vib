import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Visibility,
  CheckCircle,
  Error,
  Warning,
  Delete,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';

interface CSVRecord {
  row: number;
  ownerPrincipal?: string;
  recipientName?: string;
  institution?: string;
  credentialType?: string;
  title?: string;
  metadata?: string;
  [key: string]: any;
}

interface ProcessingResult {
  row: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  credentialId?: string;
  error?: string;
  record: CSVRecord;
}

interface CSVUploadProps {
  principal: Principal | null;
  identity: Identity | null;
}

const CSVUploadProcessor: React.FC<CSVUploadProps> = ({ principal, identity }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<CSVRecord[]>([]);
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Expected CSV columns
  const expectedColumns = [
    'ownerPrincipal',
    'recipientName', 
    'institution',
    'credentialType',
    'title',
    'metadata'
  ];

  const parseCSV = (csvText: string): CSVRecord[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new window.Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records: CSVRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record: CSVRecord = { row: i };
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      
      records.push(record);
    }

    return records;
  };

  const validateCSVData = (data: CSVRecord[]): string[] => {
    const errors: string[] = [];
    
    // Check for required columns
    if (data.length === 0) {
      errors.push('No data found in CSV');
      return errors;
    }

    const firstRecord = data[0];
    const missingColumns = expectedColumns.filter(col => !(col in firstRecord));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate each record
    data.forEach((record, index) => {
      const rowNum = index + 2; // +2 because array is 0-indexed and CSV has header
      
      if (!record.ownerPrincipal) {
        errors.push(`Row ${rowNum}: Missing owner principal`);
      } else {
        try {
          Principal.fromText(record.ownerPrincipal);
        } catch {
          errors.push(`Row ${rowNum}: Invalid principal format`);
        }
      }
      
      if (!record.recipientName) {
        errors.push(`Row ${rowNum}: Missing recipient name`);
      }
      
      if (!record.institution) {
        errors.push(`Row ${rowNum}: Missing institution`);
      }
      
      if (!record.credentialType) {
        errors.push(`Row ${rowNum}: Missing credential type`);
      } else if (!['transcript', 'certificate', 'badge'].includes(record.credentialType)) {
        errors.push(`Row ${rowNum}: Invalid credential type. Must be: transcript, certificate, or badge`);
      }
      
      if (!record.title) {
        errors.push(`Row ${rowNum}: Missing title`);
      }
      
      if (record.metadata) {
        try {
          JSON.parse(record.metadata);
        } catch {
          errors.push(`Row ${rowNum}: Invalid JSON in metadata`);
        }
      }
    });

    return errors;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        const errors = validateCSVData(parsedData);
        
        setCsvData(parsedData);
        setValidationErrors(errors);
        
        // Initialize processing results
        const initialResults: ProcessingResult[] = parsedData.map((record, index) => ({
          row: index + 2,
          status: 'pending',
          record
        }));
        setProcessingResults(initialResults);
        
        if (errors.length === 0) {
          setPreviewDialog(true);
        }
      } catch (error: any) {
        setError(`Error parsing CSV: ${error?.message || 'Unknown error'}`);
      }
    };

    reader.readAsText(file);
  };

  const processCredential = async (record: CSVRecord): Promise<{ success: boolean; credentialId?: string; error?: string }> => {
    try {
      // Simulate API call to issue credential
      // In real implementation, this would call the IC canister
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      // Simulate some failures for demonstration
      if (Math.random() < 0.1) { // 10% failure rate
        throw new window.Error('Simulated network error');
      }
      
      const credentialId = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return { success: true, credentialId };
    } catch (error: any) {
      return { 
        success: false, 
        error: error?.message || 'Unknown error' 
      };
    }
  };

  const handleBulkProcess = async () => {
    if (!principal || !identity) {
      setError('Authentication required');
      return;
    }

    if (validationErrors.length > 0) {
      setError('Please fix validation errors before processing');
      return;
    }

    setIsProcessing(true);
    setIsPaused(false);
    setProcessingProgress(0);

    for (let i = 0; i < processingResults.length; i++) {
      if (isPaused) {
        break;
      }

      const result = processingResults[i];
      if (result.status !== 'pending') continue;

      // Update status to processing
      setProcessingResults(prev => prev.map((r, index) => 
        index === i ? { ...r, status: 'processing' } : r
      ));

      try {
        const processResult = await processCredential(result.record);
        
        // Update with result
        setProcessingResults(prev => prev.map((r, index) => 
          index === i ? {
            ...r,
            status: processResult.success ? 'success' : 'error',
            credentialId: processResult.credentialId,
            error: processResult.error
          } : r
        ));
        
      } catch (error: any) {
        setProcessingResults(prev => prev.map((r, index) => 
          index === i ? {
            ...r,
            status: 'error',
            error: error?.message || 'Unknown error'
          } : r
        ));
      }

      setProcessingProgress(((i + 1) / processingResults.length) * 100);
    }

    setIsProcessing(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsProcessing(false);
    setIsPaused(false);
  };

  const getStatusIcon = (status: ProcessingResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'error':
        return <Error sx={{ color: '#f44336' }} />;
      case 'processing':
        return <CircularProgress size={20} />;
      default:
        return <Warning sx={{ color: '#ff9800' }} />;
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      expectedColumns.join(','),
      'rdmx6-jaaaa-aaaah-qacaa-cai,John Doe,MIT,certificate,Computer Science Certificate,"{""gpa"": ""3.8"", ""year"": ""2024""}"',
      'rdmx6-jaaaa-aaaah-qacaa-cai,Jane Smith,Stanford,badge,Blockchain Certification,"{""skills"": [""Smart Contracts"", ""DeFi""]}"'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'credential_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportResults = () => {
    const csvContent = [
      'Row,Status,Credential ID,Error,Recipient Name,Institution,Title',
      ...processingResults.map(result => [
        result.row,
        result.status,
        result.credentialId || '',
        result.error || '',
        result.record.recipientName || '',
        result.record.institution || '',
        result.record.title || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processing_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
          Please login to access bulk credential upload
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
          <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
          Bulk Credential Upload
        </Typography>
        
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          Upload a CSV file to issue multiple credentials at once
        </Typography>

        {/* Upload Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
                }}
              >
                Select CSV File
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={downloadTemplate}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Download Template
              </Button>
            </Box>

            {selectedFile && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Required Columns:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {expectedColumns.map(col => (
                    <Chip 
                      key={col}
                      label={col} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Errors:
            </Typography>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              {validationErrors.slice(0, 10).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
              {validationErrors.length > 10 && (
                <li>... and {validationErrors.length - 10} more errors</li>
              )}
            </ul>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Processing Controls */}
        {csvData.length > 0 && validationErrors.length === 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handleBulkProcess}
                disabled={isProcessing || validationErrors.length > 0}
                sx={{ 
                  background: '#4caf50', 
                  '&:hover': { background: '#45a049' }
                }}
              >
                Start Processing
              </Button>
              
              {isProcessing && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={isPaused ? <PlayArrow /> : <Pause />}
                    onClick={handlePauseResume}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.6)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Stop />}
                    onClick={handleStop}
                    sx={{
                      color: '#f44336',
                      borderColor: '#f44336',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)'
                      }
                    }}
                  >
                    Stop
                  </Button>
                </>
              )}

              {processingResults.some(r => r.status !== 'pending') && (
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={exportResults}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Export Results
                </Button>
              )}
            </Box>

            {/* Progress Bar */}
            {isProcessing && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Processing: {processingProgress.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={processingProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4caf50'
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Results Table */}
        {processingResults.length > 0 && (
          <TableContainer 
            component={Paper} 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)',
              maxHeight: 400
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Row</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Recipient</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Institution</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Credential ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', background: 'rgba(0, 0, 0, 0.3)' }}>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processingResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Tooltip title={result.status}>
                        {getStatusIcon(result.status)}
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>{result.row}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{result.record.recipientName}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{result.record.institution}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{result.record.title}</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {result.credentialId || '-'}
                    </TableCell>
                    <TableCell sx={{ color: result.error ? '#f44336' : 'white' }}>
                      {result.error || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>CSV Data Preview</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Found {csvData.length} records. Review the data before processing.
          </Typography>
          
          <TableContainer sx={{ maxHeight: 400, mt: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Row</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.slice(0, 10).map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.row}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {record.ownerPrincipal?.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{record.recipientName}</TableCell>
                    <TableCell>{record.institution}</TableCell>
                    <TableCell>
                      <Chip label={record.credentialType} size="small" />
                    </TableCell>
                    <TableCell>{record.title}</TableCell>
                  </TableRow>
                ))}
                {csvData.length > 10 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                      ... and {csvData.length - 10} more records
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setPreviewDialog(false);
              handleBulkProcess();
            }}
            variant="contained"
          >
            Start Processing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CSVUploadProcessor;
