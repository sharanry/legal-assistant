import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  TextField,
  Tooltip,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ContractHeader = ({ metadata, contractName, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(contractName);

  const handleSave = () => {
    onRename(newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(contractName);
    setIsEditing(false);
  };

  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {isEditing ? (
            <>
              <TextField
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                size="small"
                sx={{ mr: 1 }}
                autoFocus
              />
              <IconButton size="small" onClick={handleSave}>
                <CheckIcon />
              </IconButton>
              <IconButton size="small" onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="h5" component="h1" sx={{ 
                mr: 1, 
                fontSize: '1.5rem',
                fontWeight: 500
              }}>
                {contractName}
              </Typography>
              <Tooltip title="Rename">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        {metadata ? (
          <>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '1.1rem',
                color: 'text.secondary',
                mb: 2
              }}
            >
              {metadata.contractType || 'Contract Type Not Specified'}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Effective Date
                  </Typography>
                  <Typography variant="body1">
                    {metadata.effectiveDate || 'Not Specified'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contract Value
                  </Typography>
                  <Typography variant="body1">
                    {metadata.contractValue || 'Not Specified'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Provider
                  </Typography>
                  <Typography variant="body1">
                    {metadata?.parties?.provider || 'Not Specified'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Client
                  </Typography>
                  <Typography variant="body1">
                    {metadata?.parties?.client || 'Not Specified'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="body1" color="error">
            No contract metadata available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ContractHeader;