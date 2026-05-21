const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
  formType: { type: String, default: 'contact' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  contactNumber: { type: String, trim: true, default: '' },
  companyName: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ContactForm', contactFormSchema);
