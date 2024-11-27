import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import logger from '../utils/logger';

const FileUpload = ({ onFileSelect }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    logger.log('File selected', { fileName: file?.name, fileType: file?.type });
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      logger.error('Invalid file type selected', { fileType: file?.type });
      alert('Please upload a PDF file');
    }
  };

  return (
    <Box sx={{ textAlign: 'center', my: 3 }}>
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload Contract PDF
        </Button>
      </label>
      <Typography variant="body2" color="textSecondary">
        Upload your PDF of your contract for analysis
      </Typography>
    </Box>
  );
};

export default FileUpload; 