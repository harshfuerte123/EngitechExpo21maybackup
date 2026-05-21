import React, { useEffect, useState, useCallback } from 'react';
import { formAPI } from '../services/api';
import { toast } from 'react-toastify';

const FORM_TYPES = [
  { value: '', label: 'All Forms' },
  { value: 'visitor_registration', label: 'Visitor Registration' },
  { value: 'stall_booking', label: 'Stall Booking' },
  { value: 'contact', label: 'Contact' }
];
const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' }
];

function getFormTypeLabel(type) {
  const map = { visitor_registration: 'Visitor', stall_booking: 'Stall', contact: 'Contact' };
  return map[type] || type;
}

function getFormTypeBadgeColor(type) {
  const map = { visitor_registration: 'blue', stall_booking: 'purple', contact: 'gray' };
  return map[type] || 'gray';
}

function SubmissionDetailModal({ submission, onClose, onStatusChange }) {
  if (!submission) return null;

  const fields = Object.entries(submission).filter(([k]) =>
    !['_id', '__v', 'createdAt', 'updatedAt', 'formType'].includes(k)
  );

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
        <div className="adm-modal__header">
          <h3 className="adm-modal__title">
            {getFormTypeLabel(submission.formType)} Submission
          </h3>
          <button className="adm-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="adm-modal__body">
          <div className="adm-detail-grid">
            {fields.map(([key, value]) => (
              <div key={key} className="adm-detail-field">
                <span className="adm-detail-field__label">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="adm-detail-field__value">
                  {value?.toString() || '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="adm-modal__footer">
          <div className="adm-modal__status-change">
            <label className="adm-label">Update Status:</label>
            <select
              className="adm-select"
              value={submission.status}
              onChange={(e) => onStatusChange(submission, e.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button className="adm-btn adm-btn--ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Forms() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await formAPI.getAll({ type: typeFilter, status: statusFilter, search, page, limit: 15 });
      setSubmissions(res.data.submissions);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search, page]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleStatusChange = async (submission, newStatus) => {
    try {
      await formAPI.updateStatus(submission.formType, submission._id, newStatus);
      toast.success('Status updated');
      fetchSubmissions();
      if (selectedSubmission?._id === submission._id) {
        setSelectedSubmission(s => ({ ...s, status: newStatus }));
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem('adminToken');
    const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/forms/admin/export${typeFilter ? `?type=${typeFilter}` : ''}`;
    // Use anchor with auth header workaround
    const a = document.createElement('a');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        a.href = URL.createObjectURL(blob);
        a.download = `forms-export-${Date.now()}.csv`;
        a.click();
        toast.success('CSV exported!');
      })
      .catch(() => toast.error('Export failed'));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div className="adm-page">
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Form Submissions</h1>
          <p className="adm-page__desc">All website form submissions — {pagination.total ?? 0} total</p>
        </div>
        <button className="adm-btn adm-btn--outline" onClick={handleExport}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="adm-form-type-cards">
        {FORM_TYPES.slice(1).map(ft => (
          <button
            key={ft.value}
            className={`adm-form-type-card ${typeFilter === ft.value ? 'active' : ''}`}
            onClick={() => { setTypeFilter(ft.value); setPage(1); }}
          >
            {ft.label}
          </button>
        ))}
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
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="adm-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="adm-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          {FORM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="adm-card adm-card--table">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Form Type</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j}><div className="adm-skeleton adm-skeleton--text"></div></td>
                    ))}
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table__empty">
                    <div className="adm-empty-state">
                      <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <p>No form submissions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map(sub => (
                  <tr key={sub._id} className={sub.status === 'new' ? 'adm-table__row--highlight' : ''}>
                    <td>
                      <div className="adm-table__person">
                        <div className="adm-table__avatar">
                          {(sub.name || sub.fullName || sub.email)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="adm-table__main-text">{sub.name || sub.fullName || '-'}</div>
                          <div className="adm-table__sub-text">{sub.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`adm-badge adm-badge--${getFormTypeBadgeColor(sub.formType)}`}>
                        {getFormTypeLabel(sub.formType)}
                      </span>
                    </td>
                    <td>{sub.contactNumber || '-'}</td>
                    <td>{sub.companyName || '-'}</td>
                    <td>{formatDate(sub.submittedAt)}</td>
                    <td>
                      <select
                        className={`adm-status-select adm-status-select--${sub.status}`}
                        value={sub.status}
                        onChange={(e) => handleStatusChange(sub, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="adm-icon-btn adm-icon-btn--view"
                        title="View details"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
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
              Showing {submissions.length} of {pagination.total} submissions
            </span>
            <div className="adm-pagination__controls">
              <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span className="adm-pagination__page">Page {page} / {pagination.pages}</span>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
