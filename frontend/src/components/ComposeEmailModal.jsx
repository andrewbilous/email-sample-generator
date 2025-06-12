import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import AIIcon from "@mui/icons-material/Lightbulb";
import { validateForm } from "../utils/validateForm";
import { EmailFields } from "./EmailFields";
import { PromptModal } from "./PromptModal";
import { SnackbarFeedback } from "./SnackbarFeedback";

import { useEmailForm } from "../hooks/useEmailForm";

export const ComposeEmailModal = ({ open, onClose, onSave }) => {
  const { form, errors, updateField, setErrors, resetForm } = useEmailForm();
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleGenerateEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await res.json();
      updateField("subject", data.subject);
      updateField("body", data.body);
      setEmailType(data.type);
    } catch (err) {
      console.error("AI generation failed:", err);
      setSnackbar({
        open: true,
        message: "AI generation failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setAiPromptOpen(false);
    }
  };

  const handleSave = () => {
    const { isValid, errors } = validateForm(form);
    if (!isValid) {
      setErrors(errors);
      setSnackbar({
        open: true,
        message: "Please fill in required fields.",
        severity: "warning",
      });
      return;
    }

    onSave(form);
    resetForm();
    setEmailType("");
    setSnackbar({
      open: true,
      message: "Email saved successfully!",
      severity: "success",
    });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Compose Email with AI help
          <IconButton onClick={() => setAiPromptOpen(true)} sx={{ ml: 1 }}>
            <AIIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EmailFields
            form={form}
            errors={errors}
            updateField={updateField}
            emailType={emailType}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <PromptModal
        open={aiPromptOpen}
        prompt={aiPrompt}
        setPrompt={setAiPrompt}
        loading={loading}
        onClose={() => setAiPromptOpen(false)}
        onGenerate={handleGenerateEmail}
      />

      <SnackbarFeedback
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};
