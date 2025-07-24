// Complete LoginRegisterModal.js - Full Featured
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
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    ten: '',
    email: '',
    sdt: '',
    diaChi: '',
    matKhau: '',
    confirmPassword: '',
    ngaySinh: ''
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLoginData({ email: '', password: '' });
      setRegisterData({
        ten: '', email: '', sdt: '', diaChi: '', 
        matKhau: '', confirmPassword: '', ngaySinh: ''
      });
      setForgotEmail('');
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

  

  // Handle input changes
  const handleLoginChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegisterChange = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate login form
  const validateLogin = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!authService.isValidEmail(loginData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!loginData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate register form
  const validateRegister = () => {
    const newErrors = {};

    if (!registerData.ten.trim()) {
      newErrors.ten = 'Vui lòng nhập họ tên';
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!authService.isValidEmail(registerData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!registerData.sdt.trim()) {
      newErrors.sdt = 'Vui lòng nhập số điện thoại';
    } else if (!authService.isValidPhone(registerData.sdt)) {
      newErrors.sdt = 'Số điện thoại không đúng định dạng';
    }

    if (!registerData.matKhau) {
      newErrors.matKhau = 'Vui lòng nhập mật khẩu';
    } else if (registerData.matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (registerData.matKhau !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!registerData.diaChi.trim()) {
      newErrors.diaChi = 'Vui lòng nhập địa chỉ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLogin()) return;

    setLoading(true);
    try {
      console.log('Attempting login with:', loginData.email);
      const result = await authService.login(loginData.email, loginData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        notificationManager.success(result.message);
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        onClose();
      } else {
        notificationManager.error(result.message);
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      notificationManager.error('Đăng nhập thất bại');
      setErrors({ general: 'Đăng nhập thất bại' });
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegister()) return;

    setLoading(true);
    try {
      const result = await authService.register(registerData);
      
      if (result.success) {
        notificationManager.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setMode('login');
        setLoginData({ email: registerData.email, password: '' });
      } else {
        notificationManager.error(result.message);
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Register error:', error);
      notificationManager.error('Đăng ký thất bại');
      setErrors({ general: 'Đăng ký thất bại' });
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail.trim()) {
      setErrors({ email: 'Vui lòng nhập email' });
      return;
    }

    if (!authService.isValidEmail(forgotEmail)) {
      setErrors({ email: 'Email không đúng định dạng' });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.resetPassword(forgotEmail);
      
      if (result.success) {
        notificationManager.success(result.message);
        setMode('login');
      } else {
        notificationManager.error(result.message);
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      notificationManager.error('Không thể đặt lại mật khẩu');
      setErrors({ general: 'Không thể đặt lại mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const modalContent = (
    <div className="auth-modal-overlay" onClick={handleBackdropClick}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <h2>
            {mode === 'login' && '🔐 Đăng nhập'}
            {mode === 'register' && '📝 Đăng ký'}
            {mode === 'forgot' && '🔑 Quên mật khẩu'}
          </h2>
        </div>

        <div className="auth-content">
          {/* General error message */}
          {errors.general && (
            <div className="error-message">
              <span className="error-text">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => handleLoginChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="password-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => handleLoginChange('password', e.target.value)}
                    className={errors.password ? 'error' : ''}
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
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button 
                type="submit" 
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : '🚀 Đăng nhập'}
              </button>

              <div className="auth-links">
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => setMode('forgot')}
                >
                  Quên mật khẩu?
                </button>
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => setMode('register')}
                >
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
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    value={registerData.ten}
                    onChange={(e) => handleRegisterChange('ten', e.target.value)}
                    className={errors.ten ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                    disabled={loading}
                    autoComplete="name"
                  />
                  {errors.ten && <span className="error-text">{errors.ten}</span>}
                </div>

                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    value={registerData.ngaySinh}
                    onChange={(e) => handleRegisterChange('ngaySinh', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => handleRegisterChange('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                    placeholder="example@email.com"
                    disabled={loading}
                    autoComplete="email"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    value={registerData.sdt}
                    onChange={(e) => handleRegisterChange('sdt', e.target.value)}
                    className={errors.sdt ? 'error' : ''}
                    placeholder="0987654321"
                    disabled={loading}
                    autoComplete="tel"
                  />
                  {errors.sdt && <span className="error-text">{errors.sdt}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <textarea
                  value={registerData.diaChi}
                  onChange={(e) => handleRegisterChange('diaChi', e.target.value)}
                  className={errors.diaChi ? 'error' : ''}
                  placeholder="Nhập địa chỉ của bạn"
                  disabled={loading}
                  rows="2"
                />
                {errors.diaChi && <span className="error-text">{errors.diaChi}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <div className="password-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.matKhau}
                      onChange={(e) => handleRegisterChange('matKhau', e.target.value)}
                      className={errors.matKhau ? 'error' : ''}
                      placeholder="Ít nhất 6 ký tự"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.matKhau && <span className="error-text">{errors.matKhau}</span>}
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu *</label>
                  <div className="password-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'error' : ''}
                      placeholder="Nhập lại mật khẩu"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
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
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => setMode('login')}
                >
                  Đã có tài khoản? Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <form className="auth-form" onSubmit={handleForgotPassword}>
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <p style={{
                  margin: 0,
                  color: '#0369a1',
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                }}>
                  💌 Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
                </p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <button 
                type="submit" 
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : '📧 Gửi link đặt lại'}
              </button>

              <div className="auth-links">
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => setMode('login')}
                >
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