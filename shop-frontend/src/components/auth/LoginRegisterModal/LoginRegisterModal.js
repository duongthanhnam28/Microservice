// src/components/auth/LoginRegisterModal.js - Complete Auth Modal
import React, { useState, useEffect } from 'react';
import authService from '../../../services/api/authService';
import { notificationManager } from '../../layout/Notification/Notification';
import './LoginRegisterModal.css';

const LoginRegisterModal = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [loading, setLoading] = useState(false);
  
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

  // Demo accounts info
  const [showDemoInfo, setShowDemoInfo] = useState(false);

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
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

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
      const result = await authService.login(loginData.email, loginData.password);
      
      if (result.success) {
        notificationManager.success(result.message);
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        onClose();
      } else {
        notificationManager.error(result.message);
      }
    } catch (error) {
      notificationManager.error('Đăng nhập thất bại');
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
      }
    } catch (error) {
      notificationManager.error('Đăng ký thất bại');
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
      }
    } catch (error) {
      notificationManager.error('Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Demo login accounts
  const demoAccounts = [
    { email: 'admin@shop.com', password: 'admin', role: 'Quản trị viên' },
    { email: 'hq@gmail.com', password: 'admin', role: 'Quản trị viên' },
    { email: 'customer@shop.com', password: 'customer', role: 'Khách hàng' },
    { email: 'demo@customer.com', password: 'demo', role: 'Khách hàng' }
  ];

  const quickLogin = (account) => {
    setLoginData({ email: account.email, password: account.password });
    setShowDemoInfo(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <h2>
            {mode === 'login' && '🔐 Đăng nhập'}
            {mode === 'register' && '📝 Đăng ký'}
            {mode === 'forgot' && '🔑 Quên mật khẩu'}
          </h2>
          
          {mode === 'login' && (
            <div className="demo-toggle">
              <button 
                className="demo-info-btn"
                onClick={() => setShowDemoInfo(!showDemoInfo)}
              >
                💡 Tài khoản demo
              </button>
            </div>
          )}
        </div>

        {/* Demo accounts info */}
        {showDemoInfo && (
          <div className="demo-accounts">
            <h4>🎯 Tài khoản demo:</h4>
            {demoAccounts.map((account, index) => (
              <div key={index} className="demo-account" onClick={() => quickLogin(account)}>
                <div className="demo-info">
                  <strong>{account.email}</strong>
                  <span className="demo-role">{account.role}</span>
                </div>
                <button className="demo-login-btn">Đăng nhập</button>
              </div>
            ))}
            <p className="demo-note">💡 Click vào tài khoản để đăng nhập nhanh</p>
          </div>
        )}

        <div className="auth-content">
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
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => handleLoginChange('password', e.target.value)}
                  className={errors.password ? 'error' : ''}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? '🔄 Đang đăng nhập...' : '🚀 Đăng nhập'}
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
                  />
                  {errors.sdt && <span className="error-text">{errors.sdt}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  value={registerData.diaChi}
                  onChange={(e) => handleRegisterChange('diaChi', e.target.value)}
                  className={errors.diaChi ? 'error' : ''}
                  placeholder="Nhập địa chỉ của bạn"
                  disabled={loading}
                />
                {errors.diaChi && <span className="error-text">{errors.diaChi}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    value={registerData.matKhau}
                    onChange={(e) => handleRegisterChange('matKhau', e.target.value)}
                    className={errors.matKhau ? 'error' : ''}
                    placeholder="Ít nhất 6 ký tự"
                    disabled={loading}
                  />
                  {errors.matKhau && <span className="error-text">{errors.matKhau}</span>}
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Nhập lại mật khẩu"
                    disabled={loading}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? '🔄 Đang đăng ký...' : '✨ Đăng ký'}
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
              <div className="forgot-info">
                <p>💌 Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
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
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? '🔄 Đang gửi...' : '📧 Gửi link đặt lại'}
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
};

export default LoginRegisterModal;