import React, { useEffect, useState } from "react";
import { ComposeEmailModal } from "../components/ComposeEmailModal";
import {
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://localhost:3001/emails");
      const data = await res.json();
      setEmails(data);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

 const handleSave = async (email) => {
  try {
    const res = await fetch("http://localhost:3001/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    });
    const saved = await res.json();

    console.log('Saved email:', saved);
    setEmails(prev => [saved, ...prev]);
  } catch (error) {
    console.error("Error saving email:", error);
  }
  setOpen(false);
};


  console.log('Fetched emails:', emails);
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" anchor="left" sx={{ width: 300 }}>
        <Box sx={{ width: 300, mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2 }}>
            Emails
          </Typography>
          <Divider />
          <List>
            {Array.isArray(emails) && emails.map((email) => (
              <ListItem
                button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                selected={selectedEmail?.id === email.id}
              >
                <ListItemText
                  primary={email.subject || "(No Subject)"}
                  secondary={email.to}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 4, marginLeft: "300px" }}>
        {selectedEmail ? (
          <>
            <Typography variant="h5">{selectedEmail.subject}</Typography>
            <Typography variant="subtitle1" gutterBottom>
              To: {selectedEmail.to}
            </Typography>
            <Typography variant="body1">{selectedEmail.body}</Typography>
          </>
        ) : (
          <Typography variant="h6" color="text.secondary">
            Select an email from the sidebar
          </Typography>
        )}
      </Box>

      <ComposeEmailModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />

      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}