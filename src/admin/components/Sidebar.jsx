import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    label: 'Blogs',
    path: '/admin/blogs',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    children: [
      { label: 'All Blogs', path: '/admin/blogs' },
      { label: 'Add Blog', path: '/admin/blogs/add' }
    ]
  },
  {
    label: 'Form Submissions',
    path: '/admin/forms',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )
  }
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [expandedItem, setExpandedItem] = useState('Blogs');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className={`adm-sidebar ${collapsed ? 'adm-sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="adm-sidebar__logo">
        <div className="adm-sidebar__logo-icon">
          <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
            <path d="M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27V54H48V27C48 15.402 38.598 6 27 6C15.402 6 6 15.402 6 27V54H0V27Z" fill="#f59e0b"/>
            <path d="M27 12C18.3015 12 11.25 19.0515 11.25 27.75V54H42.75V27.75C42.75 19.0515 35.6985 12 27 12Z" fill="#f59e0b"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="adm-sidebar__logo-text">
            <span className="adm-sidebar__brand">EngiTech</span>
            <span className="adm-sidebar__brand-sub">Admin Panel</span>
          </div>
        )}
        <button className="adm-sidebar__toggle" onClick={onToggle}>
          {collapsed ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="adm-sidebar__nav">
        {navItems.map((item) => (
          <div key={item.label} className="adm-sidebar__nav-group">
            {item.children ? (
              <>
                <button
                  className={`adm-sidebar__nav-item adm-sidebar__nav-item--parent ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                  title={collapsed ? item.label : ''}
                >
                  <span className="adm-sidebar__nav-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="adm-sidebar__nav-label">{item.label}</span>
                      <svg
                        className={`adm-sidebar__chevron ${expandedItem === item.label ? 'open' : ''}`}
                        width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </>
                  )}
                </button>
                {!collapsed && expandedItem === item.label && (
                  <div className="adm-sidebar__sub-menu">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`adm-sidebar__sub-item ${location.pathname === child.path ? 'active' : ''}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`adm-sidebar__nav-item ${isActive(item.path) ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="adm-sidebar__nav-icon">{item.icon}</span>
                {!collapsed && <span className="adm-sidebar__nav-label">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="adm-sidebar__footer">
        {!collapsed && (
          <div className="adm-sidebar__user">
            <div className="adm-sidebar__user-avatar">
              {admin?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="adm-sidebar__user-info">
              <span className="adm-sidebar__user-name">Admin</span>
              <span className="adm-sidebar__user-email">{admin?.email}</span>
            </div>
          </div>
        )}
        <button className="adm-sidebar__logout" onClick={handleLogout} title="Logout">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
