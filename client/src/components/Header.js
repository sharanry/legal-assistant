import React from 'react';
import { Box, Typography } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

const Header = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#2c3e50',
        color: 'white',
        p: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backdropFilter: 'blur(8px)',
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        transition: 'all 0.3s ease'
      }}
    >
      <GavelIcon sx={{ fontSize: 32 }} />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: "'Libre Baskerville', serif", // More formal, traditional legal font
          letterSpacing: '0.03em',
          fontWeight: 600,
          textAlign: 'left',
          background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'capitalize', // Adds formality
          fontStyle: 'normal',
          fontFeatureSettings: '"kern" 1, "liga" 1', // Improves typography
        }}
      >
        Legal Contract Assistant
      </Typography>
    </Box>
  );
};

export default Header; 