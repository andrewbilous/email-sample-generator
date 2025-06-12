import React from 'react';
import { TextField } from '@mui/material';

export const EmailFields = ({ form, errors, updateField, emailType }) => {
  return (
    <>
      <TextField
        label="To"
        fullWidth
        margin="normal"
        value={form.to}
        error={errors.to}
        helperText={errors.to ? 'Required' : ''}
        onChange={(e) => updateField('to', e.target.value)}
      />
      <TextField
        label="CC"
        fullWidth
        margin="normal"
        value={form.cc}
        onChange={(e) => updateField('cc', e.target.value)}
      />
      <TextField
        label="BCC"
        fullWidth
        margin="normal"
        value={form.bcc}
        onChange={(e) => updateField('bcc', e.target.value)}
      />
      <TextField
        label={`Subject ${emailType ? `(${emailType})` : ''}`}
        fullWidth
        margin="normal"
        value={form.subject}
        error={errors.subject}
        helperText={errors.subject ? 'Required' : ''}
        onChange={(e) => updateField('subject', e.target.value)}
      />
      <TextField
        label="Body"
        fullWidth
        margin="normal"
        multiline
        rows={6}
        value={form.body}
        onChange={(e) => updateField('body', e.target.value)}
      />
    </>
  );
};