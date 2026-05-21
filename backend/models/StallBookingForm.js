const mongoose = require('mongoose');

const stallBookingFormSchema = new mongoose.Schema({
  formType: { type: String, default: 'stall_booking' },
  fullName: { type: String, required: true, trim: true },
  businessCategory: { type: String, required: true, trim: true },
  interestedIn: { type: String, trim: true, default: '' },
  preferredStallSize: { type: String, trim: true, default: '' },
  city: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  contactNumber: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StallBookingForm', stallBookingFormSchema);
