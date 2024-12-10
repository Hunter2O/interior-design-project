const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Regular expression for email validation
    trim: true
  },
  modifications: { 
    type: String, 
    required: true 
  },
  design: { 
    type: String, 
    required: true 
  },
  imagePath: { 
    type: String, 
    default: null 
  },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;

