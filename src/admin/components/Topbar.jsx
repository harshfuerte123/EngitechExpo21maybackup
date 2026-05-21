import React from 'react';
import { useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/blogs': 'Blog Management',
  '/admin/blogs/add': 'Add New Blog',
  '/admin/forms': 'Form Submissions',
};

function getBreadcrumb(pathname) {
  if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
  if (pathname.startsWith('/admin/blogs/edit/')) return 'Edit Blog';
  return 'Admin';
}

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const pageTitle = getBreadcrumb(location.pathname);

  return (
    <header className="adm-topbar">
      <div className="adm-topbar__left">
        <button className="adm-topbar__menu-btn" onClick={onMenuToggle}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="adm-topbar__breadcrumb">
          <span className="adm-topbar__breadcrumb-root">Admin</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span className="adm-topbar__breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="adm-topbar__right">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-topbar__view-site"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View Site
        </a>
        <div className="adm-topbar__divider" />
        <div className="adm-topbar__live-dot">
          <span className="adm-topbar__live-pulse"></span>
          Live
        </div>
      </div>
    </header>
  );
}
