require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Blog = require('./models/Blog');

// ── WXR parser (no extra deps, uses built-in fs + regex) ─────────────────────

function extractCDATA(str) {
  const m = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : str.replace(/<[^>]+>/g, '').trim();
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(re);
  return m ? extractCDATA(m[1]) : '';
}

function extractTagRaw(block, tag) {
  const re = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function extractAllTagAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]+${attr}="([^"]*)"[^>]*>([^<]*)<\\/${tag}>`, 'gi');
  const results = [];
  let m;
  while ((m = re.exec(block)) !== null) {
    results.push({ attrVal: m[1], text: m[2].trim() });
  }
  return results;
}

function htmlToMarkdown(html) {
  if (!html) return '';
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '_$1_')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '_$1_')
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
      inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n'))
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
      let i = 1;
      return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => `${i++}. $1\n`);
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]+src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseWordPressXML(xmlContent) {
  // Split into <item> blocks
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  const posts = [];
  let match;

  while ((match = itemRe.exec(xmlContent)) !== null) {
    const block = match[1];

    const postType = extractTag(block, 'wp:post_type');
    if (postType !== 'post') continue;

    const status = extractTag(block, 'wp:status');
    if (status !== 'publish') continue; // skip drafts/private

    const title = extractTag(block, 'title');
    if (!title) continue;

    const contentHtml = extractTagRaw(block, 'content:encoded').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
    const excerptHtml = extractTagRaw(block, 'excerpt:encoded').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();

    const postName = extractTag(block, 'wp:post_name');
    const pubDate = extractTag(block, 'wp:post_date');

    // Categories and tags
    const catMatches = extractAllTagAttr(block, 'category', 'domain');
    const categories = catMatches.filter(c => c.attrVal === 'category').map(c => c.text);
    const tags = catMatches.filter(c => c.attrVal === 'post_tag').map(c => c.text);

    // Featured image from postmeta (look for _thumbnail_url if present, else blank)
    const featuredUrl = (() => {
      // Some WXR exports include wp:attachment_url directly on thumbnail posts
      const metaBlocks = block.match(/<wp:postmeta>([\s\S]*?)<\/wp:postmeta>/g) || [];
      for (const mb of metaBlocks) {
        const key = extractTag(mb, 'wp:meta_key');
        if (key === '_thumbnail_url') {
          return extractTag(mb, 'wp:meta_value');
        }
      }
      return '';
    })();

    const fullDescription = htmlToMarkdown(contentHtml);
    const shortDescription = excerptHtml
      ? htmlToMarkdown(excerptHtml).replace(/\n/g, ' ').trim()
      : fullDescription.replace(/\n/g, ' ').substring(0, 250).trim() + (fullDescription.length > 250 ? '...' : '');

    posts.push({
      title,
      slug: postName || '',
      shortDescription,
      fullDescription,
      featuredImage: { url: featuredUrl, publicId: '' },
      category: categories[0] || 'General',
      tags,
      author: 'EngiTech Expo',
      publishDate: pubDate ? new Date(pubDate) : new Date(),
      seoTitle: title,
      seoDescription: shortDescription.substring(0, 160),
      status: 'published'
    });
  }

  return posts;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function seedWordPress() {
  const xmlArg = process.argv[2];
  if (!xmlArg) {
    console.error('Usage: node seedWordPress.js <path-to-wordpress-export.xml>');
    console.error('Example: node seedWordPress.js ./wordpress-export.xml');
    process.exit(1);
  }

  const xmlPath = path.resolve(xmlArg);
  if (!fs.existsSync(xmlPath)) {
    console.error(`File not found: ${xmlPath}`);
    process.exit(1);
  }

  console.log(`Reading WordPress export: ${xmlPath}`);
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  const posts = parseWordPressXML(xmlContent);
  console.log(`Found ${posts.length} published blog posts`);

  if (posts.length === 0) {
    console.warn('No published posts found. Check the XML file and ensure posts have status "publish".');
    process.exit(0);
  }

  console.log('\nParsed posts:');
  posts.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));

  console.log('\nConnecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  // Clear existing blogs
  const deleted = await Blog.deleteMany({});
  console.log(`Cleared ${deleted.deletedCount} existing blogs`);

  // Insert new blogs (use save() to trigger slug auto-generation hook)
  let seeded = 0;
  for (const postData of posts) {
    try {
      const blog = new Blog(postData);
      await blog.save();
      console.log(`  ✓ ${blog.title} → /blog/${blog.slug}`);
      seeded++;
    } catch (err) {
      console.error(`  ✗ Failed: ${postData.title} — ${err.message}`);
    }
  }

  console.log(`\nSeeded ${seeded}/${posts.length} blog posts`);
  await mongoose.disconnect();
}

seedWordPress().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
