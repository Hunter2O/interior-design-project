const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer'); // File upload middleware
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // For form data
app.use(bodyParser.json()); // For JSON data
app.use(cors());
app.use(express.static('public')); // Serve frontend files
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedExtensions.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, or GIF image files are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/interior-design', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Request model
const Request = require('./models/Request');

// Helper function to validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// API route to submit customer requests
app.post('/api/submit-request', upload.single('image'), async (req, res) => {
  console.log('Incoming request data:', req.body); // Log the request body

  const { email, modifications, design } = req.body;
  const imagePath = req.file ? req.file.path : null;

  // Validate required fields
  if (!email) {
    return res.status(400).json({ message: 'Email is required!' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format!' });
  }
  if (!design) {
    return res.status(400).json({ message: 'Design is required!' });
  }

  try {
    // Save the request to the database
    const newRequest = new Request({ email, modifications, design, imagePath });
    const savedRequest = await newRequest.save();

    res.status(200).json({
      message: 'Request submitted successfully!',
      request: savedRequest,
    });
  } catch (err) {
    console.error('Error saving request:', err);
    res.status(500).json({ message: 'An error occurred while saving the request. Please try again.' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


