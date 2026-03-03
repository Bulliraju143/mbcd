// server/routes/contact.js
const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, service, requirement } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required.',
      });
    }

    const contact = new Contact({ name, phone, email, service, requirement });
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Message received! We will get back to you soon.',
      data: contact,
    });
  } catch (error) {
    console.error('Contact route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message,
    });
  }
});

// GET /api/contact  (admin use)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;