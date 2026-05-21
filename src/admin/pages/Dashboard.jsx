import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI, formAPI } from '../services/api';

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className={`adm-stat-card adm-stat-card--${color}`}>
      <div className="adm-stat-card__icon">{icon}</div>
      <div className="adm-stat-card__body">
        <div className="adm-stat-card__value">{value ?? <span className="adm-skeleton-text">--</span>}</div>
        <div className="adm-stat-card__label">{label}</div>
        {sub && <div className="adm-stat-card__sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [blogStats, setBlogStats] = useState(null);
  const [formStats, setFormStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [latestInquiries, setLatestInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([blogAPI.getStats(), formAPI.getStats()])
      .then(([blogRes, formRes]) => {
        setBlogStats(blogRes.data.stats);
        setRecentBlogs(blogRes.data.recent || []);
        setFormStats(formRes.data.stats);
        setLatestInquiries(formRes.data.latestInquiries || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const getFormTypeBadge = (type) => {
    const map = { visitor_registration: 'Visitor', stall_booking: 'Stall', contact: 'Contact' };
    return map[type] || type;
  };

  return (
    <div className="adm-page">
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Dashboard</h1>
          <p className="adm-page__desc">Overview of your website content and submissions</p>
        </div>
        <Link to="/admin/blogs/add" className="adm-btn adm-btn--primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Blog
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="adm-stats-grid">
        <StatCard
          label="Total Blogs"
          value={blogStats?.total}
          color="blue"
          sub={`${blogStats?.published ?? 0} published`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          }
        />
        <StatCard
          label="Published Blogs"
          value={blogStats?.published}
          color="green"
          sub={`${blogStats?.draft ?? 0} drafts`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          }
        />
        <StatCard
          label="Total Submissions"
          value={formStats?.total}
          color="amber"
          sub={`${formStats?.newCount ?? 0} new`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          }
        />
        <StatCard
          label="Stall Inquiries"
          value={formStats?.stallBooking?.total}
          color="purple"
          sub={`${formStats?.stallBooking?.new ?? 0} new`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          }
        />
      </div>

      {/* Two-column section */}
      <div className="adm-dashboard-grid">
        {/* Recent Blogs */}
        <div className="adm-card">
          <div className="adm-card__header">
            <h2 className="adm-card__title">Recent Blogs</h2>
            <Link to="/admin/blogs" className="adm-card__link">View all →</Link>
          </div>
          <div className="adm-card__body">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="adm-skeleton-row">
                  <div className="adm-skeleton adm-skeleton--text"></div>
                  <div className="adm-skeleton adm-skeleton--badge"></div>
                </div>
              ))
            ) : recentBlogs.length === 0 ? (
              <div className="adm-empty-state">
                <p>No blogs yet. <Link to="/admin/blogs/add">Create one →</Link></p>
              </div>
            ) : (
              <div className="adm-list">
                {recentBlogs.map(blog => (
                  <div key={blog._id} className="adm-list__item">
                    <div className="adm-list__item-main">
                      <Link to={`/admin/blogs/edit/${blog._id}`} className="adm-list__item-title">
                        {blog.title}
                      </Link>
                      <span className="adm-list__item-meta">{formatDate(blog.createdAt)}</span>
                    </div>
                    <span className={`adm-badge adm-badge--${blog.status === 'published' ? 'green' : 'gray'}`}>
                      {blog.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest Inquiries */}
        <div className="adm-card">
          <div className="adm-card__header">
            <h2 className="adm-card__title">Latest Inquiries</h2>
            <Link to="/admin/forms" className="adm-card__link">View all →</Link>
          </div>
          <div className="adm-card__body">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="adm-skeleton-row">
                  <div className="adm-skeleton adm-skeleton--text"></div>
                  <div className="adm-skeleton adm-skeleton--badge"></div>
                </div>
              ))
            ) : latestInquiries.length === 0 ? (
              <div className="adm-empty-state">
                <p>No form submissions yet.</p>
              </div>
            ) : (
              <div className="adm-list">
                {latestInquiries.map(item => (
                  <div key={item._id} className="adm-list__item">
                    <div className="adm-list__item-main">
                      <span className="adm-list__item-title">
                        {item.name || item.fullName || item.email}
                      </span>
                      <span className="adm-list__item-meta">
                        {item.email} · {formatDate(item.submittedAt)}
                      </span>
                    </div>
                    <span className={`adm-badge adm-badge--${item.formType === 'stall_booking' ? 'purple' : item.formType === 'visitor_registration' ? 'blue' : 'gray'}`}>
                      {getFormTypeBadge(item.formType)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
