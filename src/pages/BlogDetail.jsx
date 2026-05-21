import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../admin/services/api';
import Layout from '../components/Layout';
import MDEditor from '@uiw/react-md-editor';

const PAGE_CSS = [{ id: 'page-css-blog', href: '/css/page-blog.css' }];
const BODY_CLASS = 'single-post wp-custom-logo elementor-default elementor-kit-23';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    blogAPI.getBySlug(slug)
      .then(res => setBlog(res.data.blog))
      .catch(() => setError('Blog post not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '';

  const breadcrumbHtml = `
<div data-elementor-type="wp-post" data-elementor-id="10514" class="elementor elementor-10514">
  <div class="default no-position show_shadow rs-sticky-default elementor-element e-flex e-con-boxed e-con e-parent e-lazyloaded" data-element_type="container">
    <div class="e-con-inner">
      <div class="default no-position show_shadow rs-sticky-default elementor-element e-flex e-con-boxed e-con e-child" data-element_type="container">
        <div class="e-con-inner">
          <div class="default no-position show_shadow rs-sticky-default elementor-element e-con-full e-flex e-con e-child" data-element_type="container">
            <div class="elementor-element elementor-widget elementor-widget-page-title" data-element_type="widget" data-widget_type="page-title.default">
              <div class="elementor-widget-container">
                <div class="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                  <h1 class="elementor-heading-title elementor-size">${blog?.title || 'Blog'}</h1>
                </div>
              </div>
            </div>
            <div class="elementor-element elementor-widget elementor-widget-rs-breadcrumb" data-element_type="widget" data-widget_type="rs-breadcrumb.default">
              <div class="elementor-widget-container">
                <div class="breadcrumb-area style3">
                  <div class="breadcrumbs-inner">
                    <span><a href="/" class="home">Engitech Expo</a></span> &gt; <span><a href="/blog">Blog</a></span> &gt; <span class="current-item">${blog?.title || 'Post'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  if (loading) {
    return (
      <Layout pageCss={PAGE_CSS} bodyClass={BODY_CLASS}>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout pageCss={PAGE_CSS} bodyClass={BODY_CLASS}>
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <h2>Blog post not found</h2>
          <Link to="/blog" className="rs-btn" style={{ display: 'inline-block', padding: '10px 24px' }}>← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageCss={PAGE_CSS} bodyClass={BODY_CLASS}>
      <div className="header-breadcamb-fixer" dangerouslySetInnerHTML={{ __html: breadcrumbHtml }} />

      <div className="elementor elementor-blog-detail" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Featured Image */}
        {blog.featuredImage?.url && (
          <div style={{ marginBottom: '30px', borderRadius: '8px', overflow: 'hidden' }}>
            <img
              src={blog.featuredImage.url}
              alt={blog.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          {blog.category && (
            <span className="adm-badge adm-badge--blue" style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '20px', background: '#EA5501', color: '#fff' }}>
              {blog.category}
            </span>
          )}
          <span style={{ color: '#888', fontSize: '14px' }}>{formatDate(blog.publishDate)}</span>
          {blog.author && <span style={{ color: '#888', fontSize: '14px' }}>By {blog.author}</span>}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.3 }}>{blog.title}</h1>

        {/* Short Description */}
        {blog.shortDescription && (
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px', lineHeight: 1.7, borderLeft: '4px solid #EA5501', paddingLeft: '16px' }}>
            {blog.shortDescription}
          </p>
        )}

        {/* Full Content */}
        {blog.fullDescription && (
          <div data-color-mode="light" style={{ marginBottom: '40px' }}>
            <MDEditor.Markdown source={blog.fullDescription} style={{ backgroundColor: 'transparent', fontSize: '16px', lineHeight: 1.8 }} />
          </div>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <span style={{ fontWeight: 600, marginRight: '8px' }}>Tags:</span>
            {blog.tags.map(tag => (
              <span key={tag} style={{ display: 'inline-block', background: '#f5f5f5', padding: '4px 10px', borderRadius: '4px', marginRight: '6px', marginBottom: '6px', fontSize: '13px', color: '#555' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: '40px' }}>
          <Link to="/blog" style={{ color: '#EA5501', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    </Layout>
  );
}
