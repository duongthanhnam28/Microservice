// src/components/auth/UserProfileMenu.js - User Profile Dropdown
import React, { useState, useRef, useEffect } from 'react';
import authService from '../../../services/api/authService';
import { notificationManager } from '../../layout/Notification/Notification';
import './UserProfileMenu.css';

const UserProfileMenu = ({ user, onLogout, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    ten: user?.ten || '',
    email: user?.email || '',
    sdt: user?.sdt || '',
    diaChi: user?.diaChi || '',
    ngaySinh: user?.ngaySinh || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        ten: user.ten || '',
        email: user.email || '',
        sdt: user.sdt || '',
        diaChi: user.diaChi || '',
        ngaySinh: user.ngaySinh || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    const result = authService.logout();
    if (result.success) {
      notificationManager.success(result.message);
      setIsOpen(false);
      if (onLogout) onLogout();
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.ten.trim()) {
      newErrors.ten = 'Vui lòng nhập họ tên';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!authService.isValidEmail(profileData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!profileData.sdt.trim()) {
      newErrors.sdt = 'Vui lòng nhập số điện thoại';
    } else if (!authService.isValidPhone(profileData.sdt)) {
      newErrors.sdt = 'Số điện thoại không đúng định dạng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        notificationManager.success('Cập nhật thông tin thành công');
        setShowProfileModal(false);
        // Force refresh user data
        window.location.reload();
      } else {
        notificationManager.error(result.message);
      }
    } catch (error) {
      notificationManager.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = () => {
    if (!user?.roles || user.roles.length === 0) return 'Khách hàng';
    
    if (user.isAdmin) return 'Quản trị viên';
    return 'Khách hàng';
  };

  const getRoleColor = () => {
    if (user?.isAdmin) return '#ef4444';
    return '#10b981';
  };

  const getAvatarText = () => {
    if (!user?.ten) return 'U';
    return user.ten.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <>
      <div className="user-profile-menu" ref={menuRef}>
        <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
          <div className="user-avatar">
            <span>{getAvatarText()}</span>
          </div>
          <div className="user-info">
            <div className="user-name">{user.ten}</div>
            <div className="user-role" style={{ color: getRoleColor() }}>
              {getRoleDisplay()}
            </div>
          </div>
          <div className="dropdown-icon">
            {isOpen ? '🔼' : '🔽'}
          </div>
        </div>

        {isOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <div className="user-avatar large">
                <span>{getAvatarText()}</span>
              </div>
              <div className="user-details">
                <div className="user-name">{user.ten}</div>
                <div className="user-email">{user.email}</div>
                <div className="user-role-badge" style={{ backgroundColor: getRoleColor() }}>
                  {getRoleDisplay()}
                </div>
              </div>
            </div>

            <div className="dropdown-menu">
              <button 
                className="menu-item"
                onClick={() => {
                  setShowProfileModal(true);
                  setIsOpen(false);
                }}
              >
                <span className="menu-icon">👤</span>
                <span>Thông tin cá nhân</span>
              </button>

              <button className="menu-item">
                <span className="menu-icon">📋</span>
                <span>Đơn hàng của tôi</span>
              </button>

              <button className="menu-item">
                <span className="menu-icon">❤️</span>
                <span>Sản phẩm yêu thích</span>
              </button>

              {user.isAdmin && (
                <>
                  <div className="menu-divider"></div>
                  <button 
                    className="menu-item admin"
                    onClick={() => {
                      if (onModeChange) onModeChange('admin');
                      setIsOpen(false);
                    }}
                  >
                    <span className="menu-icon">🛠️</span>
                    <span>Quản trị hệ thống</span>
                  </button>
                </>
              )}

              <div className="menu-divider"></div>
              
              <button className="menu-item">
                <span className="menu-icon">⚙️</span>
                <span>Cài đặt</span>
              </button>

              <button className="menu-item">
                <span className="menu-icon">🔒</span>
                <span>Đổi mật khẩu</span>
              </button>

              <button className="menu-item logout" onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👤 Thông tin cá nhân</h3>
              <button 
                className="close-btn"
                onClick={() => setShowProfileModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  <span>{getAvatarText()}</span>
                </div>
                <div className="profile-role-info">
                  <div className="profile-name">{user.ten}</div>
                  <div className="profile-role" style={{ color: getRoleColor() }}>
                    {getRoleDisplay()}
                  </div>
                </div>
              </div>

              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      value={profileData.ten}
                      onChange={(e) => handleInputChange('ten', e.target.value)}
                      className={errors.ten ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.ten && <span className="error-text">{errors.ten}</span>}
                  </div>

                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      value={profileData.ngaySinh}
                      onChange={(e) => handleInputChange('ngaySinh', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      value={profileData.sdt}
                      onChange={(e) => handleInputChange('sdt', e.target.value)}
                      className={errors.sdt ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.sdt && <span className="error-text">{errors.sdt}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>
                  <textarea
                    value={profileData.diaChi}
                    onChange={(e) => handleInputChange('diaChi', e.target.value)}
                    rows="3"
                    disabled={loading}
                  />
                </div>
              </form>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowProfileModal(false)}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileMenu;