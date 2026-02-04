const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { category, tag, limit = 10, page = 1 } = req.query;
    const query = { published: true };

    if (category) {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog posts',
      message: error.message,
    });
  }
});

// Get single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog post',
      message: error.message,
    });
  }
});

// Create new blog post
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags, imageUrl } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ 
        error: 'Please provide title, excerpt, and content' 
      });
    }

    const newBlog = new Blog({
      title,
      excerpt,
      content,
      author,
      category,
      tags,
      imageUrl,
    });

    await newBlog.save();

    res.status(201).json({ 
      message: 'Blog post created successfully',
      blog: newBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      error: 'Failed to create blog post',
      message: error.message,
    });
  }
});

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ 
      message: 'Blog post updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ 
      error: 'Failed to update blog post',
      message: error.message,
    });
  }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ 
      error: 'Failed to delete blog post',
      message: error.message,
    });
  }
});

module.exports = router;
