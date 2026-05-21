const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VisitorForm = require('../models/VisitorForm');
const StallBookingForm = require('../models/StallBookingForm');
const ContactForm = require('../models/ContactForm');
const { createObjectCsvStringifier } = require('csv-writer');

// Model map
const modelMap = {
  visitor_registration: VisitorForm,
  stall_booking: StallBookingForm,
  contact: ContactForm
};

// ─────────────────────────────────────────────────────────
// PUBLIC FORM SUBMISSION ENDPOINTS
// ─────────────────────────────────────────────────────────

// POST /api/forms/visitor
router.post('/visitor', async (req, res) => {
  try {
    const { name, email, contactNumber, companyName, message } = req.body;
    if (!name || !email || !contactNumber || !companyName) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }
    const submission = new VisitorForm({ name, email, contactNumber, companyName, message });
    await submission.save();
    res.status(201).json({ success: true, message: 'Registration submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error('Visitor form error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// POST /api/forms/stall-booking
router.post('/stall-booking', async (req, res) => {
  try {
    const { fullName, businessCategory, interestedIn, preferredStallSize, city, companyName, email, contactNumber } = req.body;
    if (!fullName || !businessCategory || !city || !companyName || !email || !contactNumber) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }
    const submission = new StallBookingForm({ fullName, businessCategory, interestedIn, preferredStallSize, city, companyName, email, contactNumber });
    await submission.save();
    res.status(201).json({ success: true, message: 'Stall booking inquiry submitted! Our team will reach out to you shortly.' });
  } catch (err) {
    console.error('Stall booking form error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// POST /api/forms/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, contactNumber, companyName, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    const submission = new ContactForm({ name, email, contactNumber, companyName, message });
    await submission.save();
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN FORM MANAGEMENT (protected)
// ─────────────────────────────────────────────────────────

// GET /api/admin/forms — all submissions with filter
router.get('/admin/list', auth, async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let results = [];
    let total = 0;

    const buildFilter = (formType) => {
      const filter = {};
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ];
      }
      return filter;
    };

    if (type && modelMap[type]) {
      const Model = modelMap[type];
      const filter = buildFilter(type);
      [results, total] = await Promise.all([
        Model.find(filter).sort({ submittedAt: -1 }).skip(skip).limit(parseInt(limit)),
        Model.countDocuments(filter)
      ]);
    } else {
      // Get all types merged
      const [visitors, stalls, contacts] = await Promise.all([
        VisitorForm.find(buildFilter('visitor')).sort({ submittedAt: -1 }).lean(),
        StallBookingForm.find(buildFilter('stall')).sort({ submittedAt: -1 }).lean(),
        ContactForm.find(buildFilter('contact')).sort({ submittedAt: -1 }).lean()
      ]);
      const all = [...visitors, ...stalls, ...contacts].sort((a, b) =>
        new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      total = all.length;
      results = all.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      submissions: results,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    console.error('Admin forms error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/forms/dashboard-stats
router.get('/admin/stats', auth, async (req, res) => {
  try {
    const [visitorTotal, stallTotal, contactTotal,
           visitorNew, stallNew, contactNew] = await Promise.all([
      VisitorForm.countDocuments(),
      StallBookingForm.countDocuments(),
      ContactForm.countDocuments(),
      VisitorForm.countDocuments({ status: 'new' }),
      StallBookingForm.countDocuments({ status: 'new' }),
      ContactForm.countDocuments({ status: 'new' })
    ]);

    const recent = await Promise.all([
      VisitorForm.find().sort({ submittedAt: -1 }).limit(3).lean(),
      StallBookingForm.find().sort({ submittedAt: -1 }).limit(3).lean(),
      ContactForm.find().sort({ submittedAt: -1 }).limit(3).lean()
    ]);
    const latestInquiries = recent.flat().sort((a, b) =>
      new Date(b.submittedAt) - new Date(a.submittedAt)
    ).slice(0, 5);

    res.json({
      success: true,
      stats: {
        total: visitorTotal + stallTotal + contactTotal,
        newCount: visitorNew + stallNew + contactNew,
        visitor: { total: visitorTotal, new: visitorNew },
        stallBooking: { total: stallTotal, new: stallNew },
        contact: { total: contactTotal, new: contactNew }
      },
      latestInquiries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/forms/:type/:id/status — update status
router.put('/admin/status/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;
    const Model = modelMap[type];
    if (!Model) return res.status(400).json({ success: false, message: 'Invalid form type' });

    const submission = await Model.findByIdAndUpdate(id, { status }, { new: true });
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.json({ success: true, submission, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/forms/export — CSV export
router.get('/admin/export', auth, async (req, res) => {
  try {
    const { type } = req.query;
    let data = [];
    let headers = [];

    if (type === 'visitor_registration') {
      data = await VisitorForm.find().lean();
      headers = ['submittedAt', 'name', 'email', 'contactNumber', 'companyName', 'message', 'status'];
    } else if (type === 'stall_booking') {
      data = await StallBookingForm.find().lean();
      headers = ['submittedAt', 'fullName', 'businessCategory', 'interestedIn', 'preferredStallSize', 'city', 'companyName', 'email', 'contactNumber', 'status'];
    } else if (type === 'contact') {
      data = await ContactForm.find().lean();
      headers = ['submittedAt', 'name', 'email', 'contactNumber', 'companyName', 'message', 'status'];
    } else {
      // All
      const [v, s, c] = await Promise.all([
        VisitorForm.find().lean(),
        StallBookingForm.find().lean(),
        ContactForm.find().lean()
      ]);
      data = [...v, ...s, ...c].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      headers = ['submittedAt', 'formType', 'name', 'fullName', 'email', 'contactNumber', 'companyName', 'status'];
    }

    const csvStringifier = createObjectCsvStringifier({ header: headers.map(h => ({ id: h, title: h })) });
    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="forms-export-${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

module.exports = router;
