import React from 'react';
import { Box, Typography } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

const Header = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#1a237e',
        color: 'white',
        p: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        boxShadow: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}
    >
      <GavelIcon sx={{ fontSize: 32 }} />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '0.05em',
          fontWeight: 600,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Legal Contract Analyser
      </Typography>
    </Box>
  );
};

export default Header; 