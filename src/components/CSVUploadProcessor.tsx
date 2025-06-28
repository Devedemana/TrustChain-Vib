import React, { useState, useRef } from "react";
import { Box, Paper, Typography, Button, Alert, LinearProgress, Chip } from "@mui/material";
import { CloudUpload, Download } from "@mui/icons-material";
import { Principal } from "@dfinity/principal";
import { Identity } from "@dfinity/agent";
import { getTrustChainService } from "../services/serviceSelector";

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
  success: number;
  failed: number;
  errors: string[];
}

interface CSVUploadProps {
  principal: Principal | null;
  identity: Identity | null;
}

const CSVUploadProcessor: React.FC<CSVUploadProps> = ({
  principal,
  identity,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  // Parse CSV content properly handling quoted fields
  const parseCSV = (csvContent: string): CSVRecord[] => {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = parseCSVLine(lines[0]);
    const records: CSVRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const record: CSVRecord = { row: i + 1 };
      
      headers.forEach((header, index) => {
        record[header.trim()] = values[index]?.trim() || '';
      });
      
      records.push(record);
    }

    return records;
  };

  // Parse a single CSV line handling quoted fields and escaped quotes
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    result.push(current);
    return result;
  };

  // Validate a single CSV record
  const validateRecord = (record: CSVRecord): string[] => {
    const errors: string[] = [];
    
    // Check required fields
    if (!record.ownerPrincipal) {
      errors.push('Missing ownerPrincipal');
    } else {
      try {
        Principal.fromText(record.ownerPrincipal);
      } catch (e) {
        errors.push(`Invalid principal format: ${record.ownerPrincipal}`);
      }
    }
    
    if (!record.recipientName) errors.push('Missing recipientName');
    if (!record.institution) errors.push('Missing institution');
    if (!record.credentialType) errors.push('Missing credentialType');
    if (!record.title) errors.push('Missing title');
    
    // Validate metadata JSON
    if (record.metadata) {
      try {
        JSON.parse(record.metadata);
      } catch (e) {
        errors.push(`Invalid JSON metadata: ${record.metadata}`);
      }
    }
    
    return errors;
  };

  // Process CSV file and issue credentials
  const processCSVFile = async (file: File) => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const content = await file.text();
      const records = parseCSV(content);
      
      console.log('Parsed CSV records:', records);

      // Validate all records first
      let hasValidationErrors = false;
      const allErrors: string[] = [];
      
      records.forEach(record => {
        const errors = validateRecord(record);
        if (errors.length > 0) {
          hasValidationErrors = true;
          allErrors.push(`Row ${record.row}: ${errors.join(', ')}`);
        }
      });

      if (hasValidationErrors) {
        setError(`Validation errors:\n${allErrors.join('\n')}`);
        return;
      }

      // Process valid records
      const service = getTrustChainService();
      const processingResult: ProcessingResult = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        setProgress(((i + 1) / records.length) * 100);

        try {
          const metadata = record.metadata ? JSON.parse(record.metadata) : {};
          
          await service.issueCredential(
            record.ownerPrincipal!,
            record.institution!,
            record.credentialType!,
            record.title!,
            {
              recipientName: record.recipientName,
              ...metadata
            }
          );

          processingResult.success++;
          console.log(`Successfully issued credential for row ${record.row}`);
        } catch (error) {
          processingResult.failed++;
          const errorMsg = `Row ${record.row}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          processingResult.errors.push(errorMsg);
          console.error(`Failed to issue credential for row ${record.row}:`, error);
        }
      }

      setResult(processingResult);
      if (processingResult.failed === 0) {
        setSuccess(`Successfully processed ${processingResult.success} credentials!`);
      } else {
        setError(`Processed with errors: ${processingResult.success} success, ${processingResult.failed} failed`);
      }

    } catch (error) {
      console.error('Error processing CSV:', error);
      setError(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    await processCSVFile(file);
  };
  const downloadTemplate = () => {
    const csvContent = [
      "ownerPrincipal,recipientName,institution,credentialType,title,metadata",
      '2vxsx-fae,John Doe,MIT,certificate,Computer Science Certificate,"{""gpa"": 3.8, ""year"": 2024}"',
      '2vxsx-fae,Jane Smith,Stanford University,badge,Blockchain Development Certification,"{""skills"": [""Smart Contracts"", ""DeFi""]}"'
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "credential_upload_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!principal || !identity) {
    return (
      <Paper
        sx={{ p: 4, color: "white", background: "rgba(255, 255, 255, 0.1)" }}
      >
        <Alert severity="warning">
          Please login to access bulk credential upload
        </Alert>
      </Paper>
    );
  }

  return (
    <Box>      <Paper
        sx={{
          p: 4,
          mb: 4,
          color: "white",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          <CloudUpload sx={{ mr: 1, verticalAlign: "middle" }} />
          Bulk Credential Upload {processing ? '(Processing...)' : '(Mock Mode)'}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          Upload a CSV file to issue multiple credentials at once
        </Typography>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={processing}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            sx={{ background: "rgba(255, 255, 255, 0.2)" }}
            disabled={processing}
          >
            Select CSV File
          </Button>

          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadTemplate}
            sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
            disabled={processing}
          >
            Download Template
          </Button>
        </Box>

        {processing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Processing credentials... {Math.round(progress)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "white"
                }
              }}
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, whiteSpace: "pre-line" }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {result && (
          <Paper sx={{ p: 2, backgroundColor: "rgba(255, 255, 255, 0.05)", mb: 2 }}>
            <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
              Processing Results
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Chip 
                label={`Success: ${result.success}`} 
                color="success" 
                variant="outlined"
                sx={{ color: "white", borderColor: "green" }}
              />
              <Chip 
                label={`Failed: ${result.failed}`} 
                color="error" 
                variant="outlined"
                sx={{ color: "white", borderColor: "red" }}
              />
            </Box>
            {result.errors.length > 0 && (
              <Alert severity="warning" sx={{ whiteSpace: "pre-line" }}>
                Errors:\n{result.errors.join('\n')}
              </Alert>
            )}
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default CSVUploadProcessor;
