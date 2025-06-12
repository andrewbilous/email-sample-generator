import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export const SnackbarFeedback = ({ open, message, severity = 'info', onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity={severity} sx={{ width: '100%' }} onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);