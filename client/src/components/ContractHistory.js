import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

const ContractHistory = ({ 
  open, 
  contracts, 
  onContractSelect, 
  onContractDelete,
  selectedContract,
  width = 300 
}) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          mt: '64px',
          height: 'calc(100% - 64px)'
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Contract History
        </Typography>
      </Box>
      <Divider />
      <List>
        {contracts.map((contract) => (
          <ListItem
            key={contract.id}
            button
            selected={selectedContract?.id === contract.id}
            onClick={() => onContractSelect(contract)}
          >
            <FolderIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary={contract.name}
              secondary={new Date(contract.timestamp).toLocaleDateString()}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onContractDelete(contract.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default ContractHistory; 