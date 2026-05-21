require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Blog = require('./models/Blog');

const imgDir = path.resolve(__dirname, '..', 'public', 'blogimg');

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function score(title, filename) {
  const t = normalize(title);
  const f = normalize(filename.replace(/\.\w+$/, '').replace(/-\d+x\d+$/, ''));
  const tWords = t.split(' ').filter(w => w.length > 3);
  const fWords = f.split(' ');
  let matches = 0;
  for (const w of tWords) {
    if (fWords.includes(w)) matches++;
  }
  return matches;
}

// Manual overrides for titles that don't match well automatically
const MANUAL = {
  'engitech-expo-ahmedabad-a-leading-engineering-and-industrial-exhibition-in-india': 'Engitech-Blog-01-1280x853.png',
  'role-of-industrial-exhibitions-in-indias-manufacturing-sector': 'Engitech-Blog-02-1280x853.png',
  'local-vs-international-exhibitions-whats-best-for-indian-businesses': '2-1-1280x853.png',
  'cost-of-exhibiting-at-industrial-trade-shows-in-india-2026': 'Engitech-1-1280x853.png',
  'top-benefits-of-attending-engineering-expos-in-india-2026-guide': 'Engitech-Blog-01-1280x853.png',
  'ultimate-industrial-exhibition-checklist-for-exhibitors-2026': 'Engitech-Blog-02-1280x853.png',
  'top-industrial-amp-engineering-trade-shows-in-gujarat-2026': 'Engitech-Blog-01-1280x853.png',
  'industrial-exhibition-in-ahmedabad-complete-guide-for-2026': 'Engitech-Blog-02-1280x853.png',
  'how-to-choose-the-right-machinery-at-industrial-exhibitions-2026-guide': 'Industrial-Buyers-Evaluating-CNC-Machinery-at-Engitech-Expo-2026-India-1-1280x853.webp',
  'why-ahmedabad-is-becoming-a-hub-for-industrial-trade-shows': 'Ahmedabad-Engineering-Hub-Growth-Industrial-Power-1280x853.webp',
  'how-industrial-buyers-in-india-choose-machinery-in-2026-a-complete-buying-guide-from-engitech-expo': 'Industrial-Buyers-Evaluating-CNC-Machinery-at-Engitech-Expo-2026-India-1-1280x853.webp',
};

async function run() {
  const images = fs.readdirSync(imgDir).filter(f => /\.(png|webp|jpg|jpeg)$/i.test(f));
  console.log(`Found ${images.length} images\n`);

  await mongoose.connect(process.env.MONGO_URI);
  const blogs = await Blog.find({});
  console.log(`Found ${blogs.length} blogs\n`);

  let updated = 0;
  for (const blog of blogs) {
    let imgFile = MANUAL[blog.slug] || null;

    if (!imgFile) {
      let best = null, bestScore = 0;
      for (const img of images) {
        const s = score(blog.title, img);
        if (s > bestScore) { bestScore = s; best = img; }
      }
      if (bestScore >= 2) imgFile = best;
    }

    if (imgFile) {
      blog.featuredImage = { url: `/blogimg/${imgFile}`, publicId: '' };
      await blog.save();
      console.log(`✓ [${blog.slug.substring(0, 50)}]\n  → ${imgFile}\n`);
      updated++;
    } else {
      console.log(`✗ No match: ${blog.title}\n`);
    }
  }

  console.log(`\nUpdated ${updated}/${blogs.length} blogs`);
  await mongoose.disconnect();
}

run().catch(console.error);
