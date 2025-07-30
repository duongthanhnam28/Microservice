// ENHANCED LoginRegisterModal.js - Support Email/Username Login
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
    identifier: '', // Changed from email to identifier
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLoginData({ identifier: '', password: '' });
      setRegisterData({
        username: '', email: '', firstName: '', lastName: '',
        phoneNumber: '', password: '', confirmPassword: ''
      });
      setForgotEmail('');
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

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

  // ENHANCED: Detect identifier type and validate accordingly
  const detectIdentifierType = (identifier) => {
    if (!identifier || !identifier.trim()) return 'unknown';
    
    const trimmed = identifier.trim();
    
    // Check if it's an email (contains @ and basic email format)
    if (trimmed.includes('@') && authService.isValidEmail(trimmed)) {
      return 'email';
    }
    
    // Otherwise treat as username
    return 'username';
  };

  // ENHANCED: Validate login form with smart identifier detection
  const validateLogin = () => {
    const newErrors = {};

    if (!loginData.identifier.trim()) {
      newErrors.identifier = 'Vui lòng nhập email hoặc tên đăng nhập';
    } else {
      const identifier = loginData.identifier.trim();
      const type = detectIdentifierType(identifier);
      
      if (type === 'email') {
        if (!authService.isValidEmail(identifier)) {
          newErrors.identifier = 'Email không đúng định dạng';
        }
      } else if (type === 'username') {
        if (identifier.length < 3) {
          newErrors.identifier = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        } else if (identifier.length > 50) {
          newErrors.identifier = 'Tên đăng nhập không được quá 50 ký tự';
        } else if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
          newErrors.identifier = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
        }
      }
    }

    if (!loginData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced register validation
  const validateRegister = () => {
    const newErrors = {};

    // Username validation
    if (!registerData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (registerData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (registerData.username.length > 50) {
      newErrors.username = 'Tên đăng nhập không được quá 50 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(registerData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    // Email validation
    if (!registerData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!authService.isValidEmail(registerData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    // Phone validation (optional)
    if (registerData.phoneNumber && !authService.isValidPhone(registerData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không đúng định dạng (VD: 0987654321)';
    }

    // Password validation
    if (!registerData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Confirm password validation
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ENHANCED: Handle login with identifier detection
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const identifier = loginData.identifier.trim();
      const type = detectIdentifierType(identifier);
      
      console.log(`Attempting login with ${type}:`, identifier);
      
      // Use the identifier directly - backend will handle detection
      const result = await authService.login(identifier, loginData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        notificationManager.success(`${result.message} - Đăng nhập bằng ${type === 'email' ? 'email' : 'tên đăng nhập'}`);
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

  // Handle register (unchanged)
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegister()) return;

    setLoading(true);
    try {
      const result = await authService.register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phoneNumber: registerData.phoneNumber
      });
      
      if (result.success) {
        notificationManager.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setMode('login');
        setLoginData({ identifier: registerData.email, password: '' });
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
      // Mock implementation - you should implement this in authService
      notificationManager.info('Tính năng đặt lại mật khẩu sẽ được cập nhật sớm');
      setMode('login');
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

  // Get placeholder text based on current input
  const getIdentifierPlaceholder = () => {
    if (!loginData.identifier) {
      return 'Nhập email hoặc tên đăng nhập';
    }
    
    const type = detectIdentifierType(loginData.identifier);
    if (type === 'email') {
      return 'example@email.com';
    } else {
      return 'Tên đăng nhập (chỉ chữ, số, _)';
    }
  };

  // Get identifier label with smart detection and count
  const getIdentifierLabel = () => {
    if (!loginData.identifier) {
      return 'Email / Tên đăng nhập';
    }
    
    const type = detectIdentifierType(loginData.identifier);
    const charCount = loginData.identifier.length;
    
    if (type === 'email') {
      return `Email ${charCount > 0 ? `(${charCount} ký tự)` : ''}`;
    } else {
      return `Tên đăng nhập ${charCount > 0 ? `(${charCount} ký tự)` : ''}`;
    }
  };

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
          {/* Enhanced error message with smart feedback */}
          {errors.general && (
            <div className="error-message">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {(() => {
                    const error = errors.general.toLowerCase();
                    if (error.includes('email')) return '📧';
                    if (error.includes('username') || error.includes('tên đăng nhập')) return '👤';
                    if (error.includes('password') || error.includes('mật khẩu')) return '🔒';
                    if (error.includes('network') || error.includes('kết nối')) return '🌐';
                    return '⚠️';
                  })()}
                </span>
                <span className="error-text">{errors.general}</span>
              </div>
              {/* Helpful suggestions based on error type */}
              {(() => {
                const error = errors.general.toLowerCase();
                if (error.includes('email') && error.includes('không tồn tại')) {
                  return (
                    <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      💡 Thử đăng nhập bằng tên đăng nhập thay vì email
                    </div>
                  );
                } else if (error.includes('username') && error.includes('không tồn tại')) {
                  return (
                    <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      💡 Thử đăng nhập bằng email thay vì tên đăng nhập
                    </div>
                  );
                } else if (error.includes('mật khẩu') && error.includes('không chính xác')) {
                  return (
                    <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      💡 Kiểm tra lại mật khẩu hoặc sử dụng tính năng quên mật khẩu
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* ENHANCED Login Form */}
          {mode === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>{getIdentifierLabel()}</label>
                <input
                  type="text"
                  value={loginData.identifier}
                  onChange={(e) => handleLoginChange('identifier', e.target.value)}
                  className={`${errors.identifier ? 'error' : ''} ${
                    loginData.identifier ? 
                      (detectIdentifierType(loginData.identifier) === 'email' ? 'email-input' : 'username-input') 
                      : ''
                  }`}
                  placeholder={getIdentifierPlaceholder()}
                  disabled={loading}
                  autoComplete="username"
                />
                {errors.identifier && <span className="error-text">{errors.identifier}</span>}
                
                {/* Enhanced smart hint with validation feedback */}
                {loginData.identifier && (
                  <div className={`input-hint ${
                    detectIdentifierType(loginData.identifier) === 'email' ? 'email-hint' : 'username-hint'
                  }`}>
                    <span>
                      {detectIdentifierType(loginData.identifier) === 'email' ? '📧' : '👤'}
                    </span>
                    <span>
                      {detectIdentifierType(loginData.identifier) === 'email' 
                        ? 'Đang nhập email' 
                        : 'Đang nhập tên đăng nhập'
                      }
                      {/* Show validation status */}
                      {(() => {
                        const type = detectIdentifierType(loginData.identifier);
                        const isValid = type === 'email' 
                          ? authService.isValidEmail(loginData.identifier)
                          : authService.isValidUsername ? authService.isValidUsername(loginData.identifier) : true;
                        
                        if (loginData.identifier.length > 2) {
                          return isValid ? ' - ✅ Hợp lệ' : ' - ❌ Không hợp lệ';
                        }
                        return '';
                      })()}
                    </span>
                  </div>
                )}
                
                {/* Login method explanation for better UX */}
                {loginData.identifier && loginData.identifier.length > 3 && (
                  <div className="login-method-indicator">
                    <div className={`method-icon ${detectIdentifierType(loginData.identifier)}`}>
                      {detectIdentifierType(loginData.identifier) === 'email' ? '📧' : '👤'}
                    </div>
                    <div className="method-description">
                      {detectIdentifierType(loginData.identifier) === 'email' 
                        ? 'Hệ thống sẽ tìm tài khoản theo địa chỉ email này'
                        : 'Hệ thống sẽ tìm tài khoản theo tên đăng nhập này'
                      }
                    </div>
                  </div>
                )}
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
                  <label>Tên đăng nhập *</label>
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) => handleRegisterChange('username', e.target.value)}
                    className={errors.username ? 'error' : ''}
                    placeholder="Tên đăng nhập (chữ, số, _)"
                    disabled={loading}
                    autoComplete="username"
                  />
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Họ</label>
                  <input
                    type="text"
                    value={registerData.firstName}
                    onChange={(e) => handleRegisterChange('firstName', e.target.value)}
                    placeholder="Họ của bạn"
                    disabled={loading}
                    autoComplete="given-name"
                  />
                </div>

                <div className="form-group">
                  <label>Tên</label>
                  <input
                    type="text"
                    value={registerData.lastName}
                    onChange={(e) => handleRegisterChange('lastName', e.target.value)}
                    placeholder="Tên của bạn"
                    disabled={loading}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={registerData.phoneNumber}
                  onChange={(e) => handleRegisterChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'error' : ''}
                  placeholder="0987654321 (không bắt buộc)"
                  disabled={loading}
                  autoComplete="tel"
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <div className="password-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => handleRegisterChange('password', e.target.value)}
                      className={errors.password ? 'error' : ''}
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
                  {errors.password && <span className="error-text">{errors.password}</span>}
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