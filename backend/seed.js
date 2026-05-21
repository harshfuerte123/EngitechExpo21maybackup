require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const slugify = require('./utils/slugify');

// Directory containing the legacy blog HTML files
const blogsFolder = path.resolve(__dirname, '..', 'Industrial Blogs & Manufacturing Updates _ EngiTech Expo_files');

// Helper to extract blog data from an HTML file
function parseBlogFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  const title = $('h1').first().text().trim() || path.basename(filePath, path.extname(filePath));
  const shortDescription = $('meta[name="description"]').attr('content')
    || $('p').first().text().trim().slice(0, 200) + '...';
  const fullDescription = $.html();
  const slug = slugify(title);
  // Attempt to find a featured image in the HTML (first <img>)
  const imgTag = $('img').first();
  let featuredImage = { url: '', publicId: '' };
  if (imgTag.length) {
    const src = imgTag.attr('src');
    // If src is a relative path, convert to public URL
    const url = src && !src.startsWith('http') ? `/images/${path.basename(src)}` : src || '';
    featuredImage = { url, publicId: '' };
  }
  return {
    title,
    shortDescription,
    fullDescription,
    featuredImage,
    category: 'General',
    tags: [],
    author: 'EngiTech Expo Team',
    seoTitle: title,
    seoDescription: shortDescription,
    status: 'published',
    slug,
    publishDate: new Date()
  };
}

// Build blogsData by reading all .html files in the folder
const blogsData = [];
if (fs.existsSync(blogsFolder)) {
  const files = fs.readdirSync(blogsFolder).filter(f => f.toLowerCase().endsWith('.html'));
  for (const file of files) {
    const fullPath = path.join(blogsFolder, file);
    try {
      const blogObj = parseBlogFile(fullPath);
      blogsData.push(blogObj);
    } catch (e) {
      console.error(`Failed to parse blog file ${file}:`, e);
    }
  }
} else {
  console.warn('Blog folder not found:', blogsFolder);
}

async function seedDatabase() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing blogs
    console.log('Clearing existing blogs...');
    const deleteResult = await Blog.deleteMany({});
    console.log(`🧹 Deleted ${deleteResult.deletedCount} existing blogs`);

    // Insert new blogs
    console.log('Inserting seed blogs...');
    const insertedBlogs = [];
    for (const blogData of blogsData) {
      const blog = new Blog(blogData);
      const savedBlog = await blog.save();
      insertedBlogs.push(savedBlog);
      console.log(`- Created blog: ${savedBlog.title} (Slug: ${savedBlog.slug})`);
    }
    console.log(`🎉 Successfully seeded ${insertedBlogs.length} blogs!`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

seedDatabase();
