import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress
} from '@mui/material';

export const PromptModal = ({ open, prompt, setPrompt, loading, onClose, onGenerate }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>AI ✨ Draft Generator</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          variant="contained"
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};