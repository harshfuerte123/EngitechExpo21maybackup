const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  shortDescription: { type: String, trim: true },
  fullDescription: { type: String },
  featuredImage: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  category: { type: String, trim: true, default: 'General' },
  tags: [{ type: String, trim: true }],
  author: { type: String, trim: true, default: 'EngiTech Expo' },
  publishDate: { type: Date, default: Date.now },
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

// Auto-generate slug before save
blogSchema.pre('save', async function () {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title);
    let slug = baseSlug;
    let count = 1;
    while (await mongoose.model('Blog').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
});

module.exports = mongoose.model('Blog', blogSchema);
