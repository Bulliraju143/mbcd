const mongoose = require('mongoose');

const webinarRegistrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  currentStatus: {
    type: String,
    required: true,
    enum: ['Student', 'Working Professional', 'Job Seeker', 'Other']
  },
  collegeName: {
    type: String,
    required: true,
    trim: true
  },
  priorKnowledge: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  interestedInSummer: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Maybe']
  },
  attendLive: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Maybe']
  },
  agreeToReceive: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Maybe']
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WebinarRegistration', webinarRegistrationSchema);