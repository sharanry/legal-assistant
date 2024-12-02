import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Box,
  Grid,
  Paper,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import FileUpload from './components/FileUpload';
import ClausesTable from './components/ClausesTable';
import PdfViewer from './components/PdfViewer';
import ContractHeader from './components/ContractHeader';
import ContractHistory from './components/ContractHistory';
import Header from './components/Header';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import logger from './utils/logger';

const BACKEND_BASE_URL = "https://legal-assistant-tau.vercel.app/"
// const BACKEND_BASE_URL = "http://localhost:5001"
function App() {
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('contracts');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [error, setError] = useState(null);
  const [processingError, setProcessingError] = useState({});

  useEffect(() => {
    localStorage.setItem('contracts', JSON.stringify(contracts));
  }, [contracts]);

  const analyzeContract = async (file, contractId = null) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      logger.log('Sending file to server for analysis');
      const response = await axios.post(`${BACKEND_BASE_URL}/api/analyze-contract`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const contractData = {
        id: contractId || Date.now().toString(),
        name: file.name,
        timestamp: new Date().toISOString(),
        file: file,
        status: 'success',
        ...response.data
      };
      
      setContracts(prev => [
        ...prev.filter(c => c.id !== contractData.id),
        contractData
      ]);
      setSelectedContract(contractData);
      setShowUpload(false);
      setProcessingError(prev => ({ ...prev, [contractData.id]: null }));
      
    } catch (error) {
      logger.error('Error analyzing contract', error);
      const errorMessage = error.response?.data?.error || 'Failed to analyze contract';
      
      if (contractId) {
        setProcessingError(prev => ({ ...prev, [contractId]: errorMessage }));
      } else {
        const failedContract = {
          id: Date.now().toString(),
          name: file.name,
          timestamp: new Date().toISOString(),
          file: file,
          status: 'error',
          error: errorMessage
        };
        setContracts(prev => [failedContract, ...prev]);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    logger.log('Starting file upload', { fileName: file.name, fileSize: file.size });
    await analyzeContract(file);
  };

  const handleRetry = async (contract) => {
    await analyzeContract(contract.file, contract.id);
  };

  const handleContractSelect = (contract) => {
    setSelectedContract(contract);
    setShowUpload(false);
  };

  const handleContractDelete = (contractId) => {
    setContracts(prev => prev.filter(c => c.id !== contractId));
    if (selectedContract?.id === contractId) {
      setSelectedContract(null);
      setShowUpload(true);
    }
  };

  const handleContractRename = (newName) => {
    setContracts(prev => prev.map(c => 
      c.id === selectedContract.id ? { ...c, name: newName } : c
    ));
    setSelectedContract(prev => ({ ...prev, name: newName }));
  };

  const handleClauseClick = (clause) => {
    const searchTerm = clause.title
      .replace(/[^\w\s]/g, '')
      .trim();
    setSearchKeyword(searchTerm);
    logger.log('Searching for clause', { title: clause.title });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5', pt: '64px' }}>
      <Header />
      <ContractHistory
        open={true}
        contracts={contracts}
        onContractSelect={handleContractSelect}
        onContractDelete={handleContractDelete}
        onRetry={handleRetry}
        selectedContract={selectedContract}
        processingError={processingError}
      />
      
      <Box sx={{ flexGrow: 1, p: 3, ml: '0', mt: 2 }}>
        {showUpload ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <FileUpload onFileSelect={handleFileUpload} />
          </Box>
        ) : selectedContract && (
          <>
            <ContractHeader
              metadata={selectedContract.metadata}
              contractName={selectedContract.name}
              onRename={handleContractRename}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 'calc(100vh - 250px)', overflow: 'auto' }}>
                  <ClausesTable 
                    clauses={[
                      // Critical clauses at the top
                      ...(selectedContract.criticalClauses?.indemnification?.present ? [{
                        ...selectedContract.criticalClauses.indemnification,
                        type: 'Indemnification',
                        isCritical: true
                      }] : []),
                      ...(selectedContract.criticalClauses?.termination?.present ? [{
                        ...selectedContract.criticalClauses.termination,
                        type: 'Termination',
                        isCritical: true
                      }] : []),
                      ...(selectedContract.criticalClauses?.liability?.present ? [{
                        ...selectedContract.criticalClauses.liability,
                        type: 'Liability',
                        isCritical: true
                      }] : []),
                      // Regular clauses (excluding ones that are already shown as critical)
                      ...selectedContract.clauses.filter(clause => 
                        !clause.title.toLowerCase().includes('indemnification') &&
                        !clause.title.toLowerCase().includes('termination') &&
                        !clause.title.toLowerCase().includes('liability')
                      )
                    ]}
                    onClauseClick={handleClauseClick}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 'calc(100vh - 250px)', overflow: 'auto' }}>
                  <PdfViewer 
                    file={selectedContract.file} 
                    searchKeyword={searchKeyword}
                  />
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={() => setShowUpload(true)}
              >
                Analyze New Contract
              </Button>
            </Box>
          </>
        )}
        
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
