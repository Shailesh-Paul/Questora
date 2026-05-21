const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { upload, isCloudinaryConfigured } = require('../config/cloudinary');

// @route   GET api/feedbacks
// @desc    Get all user feedbacks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("Fetch feedbacks error:", err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// @route   POST api/feedbacks
// @desc    Create new feedback / testimonial
// @access  Public
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, role, comment, rating } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({ error: 'Name, comment, and rating are required fields' });
    }

    let photoUrl = '';

    // Check if file is uploaded through multer/Cloudinary
    if (req.file) {
      // If Cloudinary is active, req.file.path or req.file.secure_url will have the Cloudinary link.
      // Otherwise, fallback to a local URL or mock link.
      photoUrl = req.file.path || req.file.secure_url;
    } else {
      // Set a generic travel avatar if no image is uploaded
      const genericAvatars = [
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150"
      ];
      const randomIndex = Math.floor(Math.random() * genericAvatars.length);
      photoUrl = genericAvatars[randomIndex];
    }

    const newFeedback = new Feedback({
      name,
      role: role || 'Traveler',
      comment,
      rating: Number(rating),
      photoUrl
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    console.error("Create feedback error:", err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;
