const mongoose = require('mongoose');

const visitorFormSchema = new mongoose.Schema({
  formType: { type: String, default: 'visitor_registration' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  contactNumber: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  message: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('VisitorForm', visitorFormSchema);
