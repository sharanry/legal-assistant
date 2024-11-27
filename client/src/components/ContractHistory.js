import React, { useState } from 'react';
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
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ContractHistory = ({ 
  open, 
  contracts, 
  onContractSelect, 
  onContractDelete,
  selectedContract,
  width = 300 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const drawerWidth = isCollapsed ? 40 : width;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.2s ease-in-out',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          mt: '64px',
          height: 'calc(100% - 64px)',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        },
      }}
    >
      <Box sx={{ 
        p: isCollapsed ? 0.5 : 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        minHeight: '48px'
      }}>
        {!isCollapsed && (
          <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
            Contract History
          </Typography>
        )}
        <IconButton 
          onClick={() => setIsCollapsed(!isCollapsed)}
          size={isCollapsed ? "small" : "medium"}
          sx={{ 
            ml: isCollapsed ? 'auto' : 0,
            mr: isCollapsed ? 'auto' : 0,
            p: isCollapsed ? 0.5 : 1
          }}
        >
          {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ p: isCollapsed ? 0 : 1 }}>
        {!isCollapsed && contracts.map((contract) => (
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
        {isCollapsed && contracts.map((contract) => (
          <Tooltip title={contract.name} placement="right" key={contract.id}>
            <ListItem
              button
              selected={selectedContract?.id === contract.id}
              onClick={() => onContractSelect(contract)}
              sx={{ 
                justifyContent: 'center',
                px: 0.5,
                py: 1,
                minHeight: '40px'
              }}
            >
              <FolderIcon 
                sx={{ 
                  fontSize: '1.2rem',
                  color: selectedContract?.id === contract.id ? 'primary.main' : 'text.secondary'
                }} 
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default ContractHistory; 