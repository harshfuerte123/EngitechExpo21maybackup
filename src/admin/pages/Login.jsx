import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login">
      <div className="adm-login__bg">
        <div className="adm-login__particle adm-login__particle--1"></div>
        <div className="adm-login__particle adm-login__particle--2"></div>
        <div className="adm-login__particle adm-login__particle--3"></div>
      </div>

      <div className="adm-login__card">
        {/* Header */}
        <div className="adm-login__header">
          <div className="adm-login__logo">
            <svg width="40" height="40" viewBox="0 0 54 54" fill="none">
              <path d="M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27V54H48V27C48 15.402 38.598 6 27 6C15.402 6 6 15.402 6 27V54H0V27Z" fill="#f59e0b"/>
              <path d="M27 12C18.3015 12 11.25 19.0515 11.25 27.75V54H42.75V27.75C42.75 19.0515 35.6985 12 27 12Z" fill="#f59e0b"/>
            </svg>
          </div>
          <h1 className="adm-login__title">EngiTech Admin</h1>
          <p className="adm-login__subtitle">Sign in to manage your content</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="adm-login__form">
          <div className="adm-form-group">
            <label className="adm-label" htmlFor="login-email">Email Address</label>
            <div className="adm-input-wrapper">
              <svg className="adm-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="login-email"
                type="email"
                className="adm-input adm-input--icon"
                placeholder="admin@engitechexpo.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-label" htmlFor="login-password">Password</label>
            <div className="adm-input-wrapper">
              <svg className="adm-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="adm-input adm-input--icon adm-input--with-toggle"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
              <button type="button" className="adm-input-toggle" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn--primary adm-btn--full adm-btn--lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="adm-spinner-sm"></span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="adm-login__hint">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Default: admin@engitechexpo.com / Admin@123456
        </div>
      </div>
    </div>
  );
}
