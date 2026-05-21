import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';

const CATEGORIES = ['General', 'Engineering', 'Manufacturing', 'Technology', 'Expo News', 'Industry Insights', 'Events'];
const DEFAULT_FORM = {
  title: '', slug: '', shortDescription: '', fullDescription: '',
  category: 'General', tags: '', author: 'EngiTech Expo',
  publishDate: new Date().toISOString().split('T')[0],
  seoTitle: '', seoDescription: '', status: 'draft',
  featuredImage: { url: '', publicId: '' }
};

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const fileInputRef = useRef();

  useEffect(() => {
    if (isEdit) {
      blogAPI.getById(id)
        .then(res => {
          const b = res.data.blog;
          setForm({
            ...b,
            tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags || '',
            publishDate: b.publishDate ? new Date(b.publishDate).toISOString().split('T')[0] : DEFAULT_FORM.publishDate
          });
          if (b.featuredImage?.url) setImagePreview(b.featuredImage.url);
        })
        .catch(() => { toast.error('Failed to load blog'); navigate('/admin/blogs'); })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (field, value) => {
    setForm(f => {
      const updated = { ...f, [field]: value };
      if (field === 'title' && !isEdit) {
        updated.slug = slugify(value);
        if (!updated.seoTitle) updated.seoTitle = value;
      }
      return updated;
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await blogAPI.upload(formData);
      return { url: res.data.url, publicId: res.data.publicId };
    } catch {
      toast.error('Image upload failed');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }

    setLoading(true);
    try {
      let featuredImage = form.featuredImage;
      if (imageFile) {
        const uploaded = await handleImageUpload();
        if (uploaded) featuredImage = uploaded;
      }

      const payload = {
        ...form,
        featuredImage,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (isEdit) {
        await blogAPI.update(id, payload);
        toast.success('Blog updated successfully!');
      } else {
        await blogAPI.create(payload);
        toast.success('Blog created successfully!');
      }
      navigate('/admin/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="adm-page">
        <div className="adm-skeleton-page">
          <div className="adm-skeleton adm-skeleton--title"></div>
          <div className="adm-skeleton adm-skeleton--block"></div>
          <div className="adm-skeleton adm-skeleton--block"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">{isEdit ? 'Edit Blog' : 'Add New Blog'}</h1>
          <p className="adm-page__desc">{isEdit ? `Editing: ${form.title}` : 'Create a new blog post'}</p>
        </div>
        <div className="adm-page__header-actions">
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => navigate('/admin/blogs')}>
            Cancel
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--outline"
            onClick={() => { handleChange('status', 'draft'); handleSubmit({ preventDefault: () => {} }); }}
            disabled={loading}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--primary"
            onClick={(e) => { handleChange('status', 'published'); handleSubmit(e); }}
            disabled={loading || uploadingImage}
          >
            {loading ? <><span className="adm-spinner-sm"></span>Saving...</> : 'Publish'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="adm-tabs">
          {['content', 'media', 'seo'].map(tab => (
            <button
              key={tab}
              type="button"
              className={`adm-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="adm-blog-form-layout">
          {/* Main Content */}
          <div className="adm-blog-form-main">
            {activeTab === 'content' && (
              <div className="adm-card">
                <div className="adm-card__body">
                  <div className="adm-form-group">
                    <label className="adm-label">Title *</label>
                    <input
                      type="text"
                      className="adm-input adm-input--lg"
                      placeholder="Enter blog title..."
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">
                      Slug
                      <span className="adm-label__hint">(auto-generated from title)</span>
                    </label>
                    <div className="adm-input-prefix">
                      <span className="adm-input-prefix__text">/blog/</span>
                      <input
                        type="text"
                        className="adm-input adm-input--prefixed"
                        value={form.slug}
                        onChange={(e) => handleChange('slug', slugify(e.target.value))}
                        placeholder="my-blog-slug"
                      />
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Short Description</label>
                    <textarea
                      className="adm-textarea"
                      rows={3}
                      placeholder="Brief summary of the blog..."
                      value={form.shortDescription}
                      onChange={(e) => handleChange('shortDescription', e.target.value)}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Full Description</label>
                    <MDEditor
                      value={form.fullDescription}
                      onChange={(val) => handleChange('fullDescription', val || '')}
                      height={400}
                      preview="edit"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="adm-card">
                <div className="adm-card__body">
                  <div className="adm-form-group">
                    <label className="adm-label">Featured Image</label>
                    <div
                      className="adm-image-drop"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {imagePreview ? (
                        <div className="adm-image-drop__preview">
                          <img src={imagePreview} alt="Preview" />
                          <button
                            type="button"
                            className="adm-image-drop__remove"
                            onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); handleChange('featuredImage', { url: '', publicId: '' }); }}
                          >×</button>
                        </div>
                      ) : (
                        <div className="adm-image-drop__placeholder">
                          <svg width="40" height="40" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <p>Click to upload featured image</p>
                          <span>JPG, PNG, WebP (max 5MB) · Optimal: 1200×630px</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="adm-hidden"
                      onChange={handleImageSelect}
                    />
                    {imageFile && (
                      <p className="adm-form-hint">
                        Selected: {imageFile.name} · Image will be uploaded to Cloudinary on save.
                      </p>
                    )}
                  </div>

                  {/* Or paste URL */}
                  <div className="adm-form-group">
                    <label className="adm-label">Or paste image URL</label>
                    <input
                      type="url"
                      className="adm-input"
                      placeholder="https://..."
                      value={form.featuredImage?.url || ''}
                      onChange={(e) => {
                        handleChange('featuredImage', { url: e.target.value, publicId: '' });
                        if (e.target.value) setImagePreview(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="adm-card">
                <div className="adm-card__body">
                  <div className="adm-form-group">
                    <label className="adm-label">SEO Title</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="SEO optimized title..."
                      value={form.seoTitle}
                      onChange={(e) => handleChange('seoTitle', e.target.value)}
                      maxLength={60}
                    />
                    <div className="adm-form-hint">{form.seoTitle.length}/60 characters</div>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-label">SEO Description</label>
                    <textarea
                      className="adm-textarea"
                      rows={3}
                      placeholder="Meta description for search engines..."
                      value={form.seoDescription}
                      onChange={(e) => handleChange('seoDescription', e.target.value)}
                      maxLength={160}
                    />
                    <div className="adm-form-hint">{form.seoDescription.length}/160 characters</div>
                  </div>

                  {/* SEO Preview */}
                  {(form.seoTitle || form.title) && (
                    <div className="adm-seo-preview">
                      <div className="adm-seo-preview__label">Google Preview</div>
                      <div className="adm-seo-preview__title">{form.seoTitle || form.title}</div>
                      <div className="adm-seo-preview__url">engitechexpo.com/blog/{form.slug}</div>
                      <div className="adm-seo-preview__desc">{form.seoDescription || form.shortDescription || 'No description.'}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Settings */}
          <div className="adm-blog-form-sidebar">
            <div className="adm-card">
              <div className="adm-card__header">
                <h3 className="adm-card__title">Settings</h3>
              </div>
              <div className="adm-card__body">
                <div className="adm-form-group">
                  <label className="adm-label">Status</label>
                  <select
                    className="adm-select adm-select--full"
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Category</label>
                  <select
                    className="adm-select adm-select--full"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Author</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={form.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Publish Date</label>
                  <input
                    type="date"
                    className="adm-input"
                    value={form.publishDate}
                    onChange={(e) => handleChange('publishDate', e.target.value)}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">
                    Tags
                    <span className="adm-label__hint">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    className="adm-input"
                    value={form.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="expo, engineering, 2026"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="adm-card">
              <div className="adm-card__body">
                <button
                  type="button"
                  className="adm-btn adm-btn--primary adm-btn--full"
                  onClick={handleSubmit}
                  disabled={loading || uploadingImage}
                >
                  {loading ? <><span className="adm-spinner-sm"></span>Saving...</> : (isEdit ? 'Update Blog' : 'Create Blog')}
                </button>
                {form.status === 'published' && form.slug && (
                  <a
                    href={`/blog/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn adm-btn--ghost adm-btn--full"
                    style={{ marginTop: '8px' }}
                  >
                    Preview →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
