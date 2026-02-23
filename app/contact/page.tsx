"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real implementation, you would send this to your backend or email service
    // For now, we'll just show a success message
    console.log({ name, email, message });

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Button
          component={Link}
          href="/app/settings"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Back to Settings
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Contact Support
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Have a question or need help? Send us a message and we&apos;ll get back to you as soon as possible.
          </Typography>

          {submitted && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Thank you for your message! We&apos;ll get back to you soon.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
              helperText="We&apos;ll reply to this email address"
            />

            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              fullWidth
              multiline
              rows={6}
              margin="normal"
              helperText="Please provide as much detail as possible"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<SendIcon />}
              sx={{ mt: 3 }}
            >
              Send Message
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              You can also reach us at:{" "}
              <Typography component="span" fontWeight="600">
                support@routinehero.app
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
