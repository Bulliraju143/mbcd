const express = require('express');
const router = express.Router();
const WebinarRegistration = require('../models/WebinarRegistration');

// POST /api/webinar - Save webinar registration to MongoDB
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      currentStatus,
      collegeName,
      priorKnowledge,
      interestedInSummer,
      attendLive,
      agreeToReceive
    } = req.body;

    // Check if email already registered
    const existing = await WebinarRegistration.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered for the webinar.'
      });
    }

    const registration = new WebinarRegistration({
      fullName,
      email,
      mobile,
      currentStatus,
      collegeName,
      priorKnowledge,
      interestedInSummer,
      attendLive,
      agreeToReceive
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Registration saved successfully!',
      data: registration
    });

  } catch (error) {
    console.error('Webinar registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message
    });
  }
});

// GET /api/webinar - Get all registrations (admin use)
router.get('/', async (req, res) => {
  try {
    const registrations = await WebinarRegistration.find().sort({ registeredAt: -1 });
    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;