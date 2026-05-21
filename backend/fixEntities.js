require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const blogs = await Blog.find({});
  let count = 0;
  for (const b of blogs) {
    const clean = (s) => s ? s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'") : s;
    const newTitle = clean(b.title);
    const newShort = clean(b.shortDescription);
    const newSeo = clean(b.seoTitle);
    if (newTitle !== b.title || newShort !== b.shortDescription || newSeo !== b.seoTitle) {
      b.title = newTitle;
      b.shortDescription = newShort;
      b.seoTitle = newSeo || newTitle;
      await b.save();
      console.log('Fixed:', b.title);
      count++;
    }
  }
  console.log(`Fixed ${count} blogs`);
  await mongoose.disconnect();
}

fix().catch(console.error);
