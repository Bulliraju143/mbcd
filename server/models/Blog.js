const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'Martian Blue Team',
  },
  category: {
    type: String,
    enum: ['Cybersecurity', 'Phishing', 'Security Tips', 'News', 'Case Studies'],
    default: 'Cybersecurity',
  },
  tags: [{
    type: String,
  }],
  imageUrl: {
    type: String,
  },
  published: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
