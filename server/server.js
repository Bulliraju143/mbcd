// server.js  — drop this in your backend root folder
// Run with: node server.js  OR  npm start (if package.json has "start": "node server.js")

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// This is the #1 reason "Something went wrong" appears.
// It allows your React frontend (localhost:3000) to call this backend (localhost:5000).
app.use(cors({
  origin: [
    'http://localhost:3000',   // React dev server
    'http://localhost:3001',   // alternate React port
    'http://127.0.0.1:3000',
    // Add your production domain here when deployed, e.g.:
    // 'https://martianbluecyberdefense.in',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB connection ───────────────────────────────────────────────────────
// Set MONGODB_URI in your .env file:
//   MONGODB_URI=mongodb://localhost:27017/martianblue
//   OR for Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/martianblue
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/martianblue';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running or your Atlas URI is correct in .env');
  });

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/webinar', require('./routes/webinar'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/blog',    require('./routes/blog'));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});