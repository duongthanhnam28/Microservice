// OPTIMIZED LoginRegisterModal.js - Clean and Simple
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import authService from '../../../services/api/authService';
import { notificationManager } from '../../layout/Notification/Notification';
import './LoginRegisterModal.css';

const LoginRegisterModal = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Reset khi modal mở/đóng
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({});
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Handle input changes
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { identifier, password } = formData;
    if (!identifier?.trim() || !password) {
      setErrors({ general: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        notificationManager.success(result.message);
        onLoginSuccess?.(result.user);
        onClose();
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Đăng nhập thất bại' });
    } finally {
      setLoading(false);
    }
  };

  // Register handler  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Client-side validation trước
    const validation = validateRegisterForm();
    if (!validation.isValid) {
      setErrors({ general: validation.errors[0] });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        notificationManager.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setMode('login');
        setFormData({ identifier: formData.email, password: '' });
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Đăng ký thất bại' });
    } finally {
      setLoading(false);
    }
  };

  // Validation cho register form - sync với backend
  const validateRegisterForm = () => {
    const errors = [];

    // Username validation
    if (!formData.username?.trim()) {
      errors.push('Vui lòng nhập tên đăng nhập');
    } else {
      const username = formData.username.trim();
      if (username.length < 3) {
        errors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
      } else if (username.length > 50) {
        errors.push('Tên đăng nhập không được quá 50 ký tự');
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
      }
    }

    // Email validation
    if (!formData.email?.trim()) {
      errors.push('Vui lòng nhập email');
    } else if (!authService.isValidEmail(formData.email)) {
      errors.push('Email không đúng định dạng');
    }

    // Password validation - theo backend requirements
    if (!formData.password) {
      errors.push('Vui lòng nhập mật khẩu');
    } else {
      const password = formData.password;
      if (password.length < 8) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
      } else {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);
        
        if (!hasLower) errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
        else if (!hasUpper) errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
        else if (!hasNumber) errors.push('Mật khẩu phải có ít nhất 1 số');
        else if (!hasSpecial) errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (@$!%*?&)');
      }
    }

    // Confirm password
    if (!formData.confirmPassword) {
      errors.push('Vui lòng xác nhận mật khẩu');
    } else if (formData.password !== formData.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    // Phone validation (optional)
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phone = formData.phoneNumber.trim();
      if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
        errors.push('Số điện thoại không đúng định dạng (10-15 số)');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  // Detect login type for UI hints
  const getLoginHint = () => {
    const { identifier } = formData;
    if (!identifier) return 'Email hoặc tên đăng nhập';
    
    const type = authService.detectLoginType(identifier);
    return type === 'email' ? '📧 Đang nhập email' : '👤 Đang nhập tên đăng nhập';
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose} disabled={loading}>✕</button>
        
        <div className="auth-header">
          <h2>
            {mode === 'login' && '🔐 Đăng nhập'}
            {mode === 'register' && '📝 Đăng ký'}
            {mode === 'forgot' && '🔑 Quên mật khẩu'}
          </h2>
        </div>

        <div className="auth-content">
          {/* Error Display */}
          {errors.general && (
            <div className="error-message">
              <span className="error-text">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email / Tên đăng nhập</label>
                <input
                  type="text"
                  value={formData.identifier || ''}
                  onChange={(e) => updateField('identifier', e.target.value)}
                  placeholder="Nhập email hoặc tên đăng nhập"
                  disabled={loading}
                  autoComplete="username"
                />
                {formData.identifier && (
                  <div className="input-hint">
                    {getLoginHint()}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="password-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Nhập mật khẩu"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : '🚀 Đăng nhập'}
              </button>

              <div className="auth-links">
                <button type="button" className="auth-link" onClick={() => setMode('forgot')}>
                  Quên mật khẩu?
                </button>
                <button type="button" className="auth-link" onClick={() => setMode('register')}>
                  Chưa có tài khoản? Đăng ký
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên đăng nhập *</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => updateField('username', e.target.value)}
                    placeholder="username123"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="email@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Họ</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Nguyễn"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Tên</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Văn A"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  placeholder="0987654321 (không bắt buộc)"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <div className="password-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password || ''}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu *</label>
                  <div className="password-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword || ''}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : '✨ Đăng ký'}
              </button>

              <div className="auth-links">
                <button type="button" className="auth-link" onClick={() => setMode('login')}>
                  Đã có tài khoản? Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <p style={{ margin: 0, color: '#0369a1', fontSize: '0.9rem' }}>
                  💌 Tính năng đặt lại mật khẩu sẽ được cập nhật sớm
                </p>
              </div>

              <div className="auth-links">
                <button type="button" className="auth-link" onClick={() => setMode('login')}>
                  ← Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default LoginRegisterModal;