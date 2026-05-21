import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { blogAPI } from '../admin/services/api';

const breadcrumbHtml = `
\t<div class="header-breadcamb-fixer">\t\t<div data-elementor-type="wp-post" data-elementor-id="10514" class="elementor elementor-10514">
\t\t\t\t\t
\t\t<div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-41335a8 e-flex e-con-boxed e-con e-parent e-lazyloaded" data-id="41335a8" data-element_type="container" data-e-type="container" data-settings="{\&quot;background_background\&quot;:\&quot;classic\&quot;}">
\t\t\t\t\t<div class="e-con-inner">
\t\t
\t\t<div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-5e42932 e-flex e-con-boxed e-con e-child" data-id="5e42932" data-element_type="container" data-e-type="container">
\t\t\t\t\t<div class="e-con-inner">
\t\t
\t\t<div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-5052d52 e-con-full e-flex e-con e-child" data-id="5052d52" data-element_type="container" data-e-type="container">
\t\t
\t\t\t\t<div class="elementor-element elementor-element-76b8911 elementor-widget elementor-widget-page-title" data-id="76b8911" data-element_type="widget" data-e-type="widget" data-widget_type="page-title.default">
\t\t\t\t<div class="elementor-widget-container">
\t\t\t\t\t\t
\t\t<div class="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
\t\t\t
\t\t\t<h1 class="elementor-heading-title elementor-size">
\t\t\t\t\tBlog\t\t\t
\t\t\t</h1>

\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t
\t\t\t\t<div class="elementor-element elementor-element-9425f56 elementor-widget elementor-widget-rs-breadcrumb" data-id="9425f56" data-element_type="widget" data-e-type="widget" data-widget_type="rs-breadcrumb.default">
\t\t\t\t<div class="elementor-widget-container">
\t\t\t\t\t                    <div class="breadcrumb-area style3">
                <div class="breadcrumbs-inner">
                    <span property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" title="Go to Engitech Expo Ahmedabad." href="/" class="home"><span property="name">Engitech Expo Ahmedabad</span></a><meta property="position" content="1"></span> &gt; <span property="itemListElement" typeof="ListItem"><span property="name" class="post post-page current-item">Blog</span><meta property="url" content="/blog"><meta property="position" content="2"></span>                </div>
            </div>

\t\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t</div>
\t\t</div>\t
`;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    blogAPI.getPublished({ status: 'published' })
      .then(res => {
        const data = res.data;
        setBlogs(data.blogs || []);
      })
      .catch(err => {
        console.error('Failed to fetch blogs:', err);
        setError('Failed to load blogs.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout
      pageCss={[{ id: 'page-css-blog', href: '/css/page-blog.css' }]}
      bodyClass="blog wp-custom-logo elementor-default elementor-kit-23"
    >
      <div dangerouslySetInnerHTML={{ __html: breadcrumbHtml }} />

      <div className="container">
        <div id="content" className="site-content">
          <div className="row padding-">
            <div className="col-lg-12">
              <article className="page hentry">
                <div className="entry-content">
                  <div className="elementor elementor-38">
                    <div className="default no-position show_shadow rs-sticky-default elementor-element e-flex e-con-boxed e-con e-parent e-lazyloaded">
                      <div className="e-con-inner">
                        <div className="elementor-widget-container">
                          <div className="prelements-blog-grid">
                            <div className="row blog_style_defaultlayout">

                              {loading && (
                                <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                                  <p>Loading blogs...</p>
                                </div>
                              )}

                              {!loading && error && (
                                <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                                  <p>{error}</p>
                                </div>
                              )}

                              {!loading && !error && blogs.length === 0 && (
                                <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                                  <p>No blogs published yet.</p>
                                </div>
                              )}

                              {!loading && !error && blogs.map(blog => (
                                <div key={blog._id} className="pre-blog-item col-lg-4 col-md-6 col-sm-12" style={{ marginBottom: '30px' }}>
                                  <div className="blog-item">
                                    <div className="image-part">
                                      <a href={`/blog/${blog.slug}`}>
                                        {blog.featuredImage && blog.featuredImage.url ? (
                                          <img
                                            src={blog.featuredImage.url}
                                            alt={blog.title}
                                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                          />
                                        ) : (
                                          <img
                                            src="/images/engitech-2-1-768x274-1.png"
                                            alt={blog.title}
                                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                          />
                                        )}
                                      </a>
                                    </div>
                                    <div className="blog-content">
                                      {blog.category && (
                                        <div className="blog-meta" style={{ marginBottom: '8px' }}>
                                          <span className="blog-category" style={{ color: '#F7C600', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>
                                            {blog.category}
                                          </span>
                                        </div>
                                      )}
                                      <h3 className="blog-title" style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '700', lineHeight: '1.4' }}>
                                        <a href={`/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                          {blog.title}
                                        </a>
                                      </h3>
                                      {blog.shortDescription && (
                                        <p className="blog-desc" style={{ marginBottom: '15px', fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
                                          {blog.shortDescription.length > 120
                                            ? blog.shortDescription.substring(0, 120) + '...'
                                            : blog.shortDescription}
                                        </p>
                                      )}
                                      <div className="blog-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                        {blog.publishDate && (
                                          <span className="blog-date" style={{ fontSize: '13px', color: '#999' }}>
                                            {formatDate(blog.publishDate)}
                                          </span>
                                        )}
                                        <a href={`/blog/${blog.slug}`} className="rs-btn rs-btn-sm" style={{ fontSize: '13px', fontWeight: '600', color: '#F7C600', textDecoration: 'none' }}>
                                          Read More &rarr;
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
