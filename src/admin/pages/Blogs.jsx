import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAll({ search, status: statusFilter, page, limit: 10 });
      setBlogs(res.data.blogs);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async () => {
    try {
      await blogAPI.delete(deleteModal.id);
      toast.success('Blog deleted');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchBlogs();
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

  return (
    <div className="adm-page">
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Blog Management</h1>
          <p className="adm-page__desc">Create and manage all blog posts</p>
        </div>
        <Link to="/admin/blogs/add" className="adm-btn adm-btn--primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="adm-filters">
        <div className="adm-search-wrap">
          <svg className="adm-search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="adm-input adm-input--search"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="adm-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="adm-card adm-card--table">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Publish Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j}><div className="adm-skeleton adm-skeleton--text"></div></td>
                    ))}
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="adm-table__empty">
                    <div className="adm-empty-state">
                      <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <p>No blogs found. <Link to="/admin/blogs/add">Create your first blog →</Link></p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <div className="adm-table__title-cell">
                        {blog.featuredImage?.url && (
                          <img src={blog.featuredImage.url} alt={blog.title} className="adm-table__thumb" />
                        )}
                        <div>
                          <div className="adm-table__main-text">{blog.title}</div>
                          <div className="adm-table__sub-text">/{blog.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-badge adm-badge--blue">{blog.category || 'General'}</span></td>
                    <td>{blog.author || '-'}</td>
                    <td>
                      <span className={`adm-badge ${blog.status === 'published' ? 'adm-badge--green' : 'adm-badge--gray'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td>{formatDate(blog.publishDate)}</td>
                    <td>
                      <div className="adm-table__actions">
                        <Link to={`/admin/blogs/edit/${blog._id}`} className="adm-icon-btn adm-icon-btn--edit" title="Edit">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </Link>
                        {blog.status === 'published' && (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="adm-icon-btn adm-icon-btn--view"
                            title="View"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </a>
                        )}
                        <button
                          className="adm-icon-btn adm-icon-btn--delete"
                          title="Delete"
                          onClick={() => setDeleteModal({ open: true, id: blog._id, title: blog.title })}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="adm-pagination">
            <span className="adm-pagination__info">
              Showing {blogs.length} of {pagination.total} blogs
            </span>
            <div className="adm-pagination__controls">
              <button
                className="adm-btn adm-btn--ghost adm-btn--sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >← Prev</button>
              <span className="adm-pagination__page">Page {page} / {pagination.pages}</span>
              <button
                className="adm-btn adm-btn--ghost adm-btn--sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage(p => p + 1)}
              >Next →</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
