const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Allow requests from your frontend
app.use(cors({ origin: 'https://gym-hut-2026.vercel.app/' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API route for forgot password (example)
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  console.log(`Password reset requested for email: ${email}`);
  res.status(200).json({ message: 'Password reset link sent' });
});

// Catch-all handler to serve React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
