// FIXED Navigation.js - Use passed auth state instead of local state
import React, { useState, useEffect } from 'react';
import authService from '../../../services/api/authService';
import LoginRegisterModal from '../../auth/LoginRegisterModal/LoginRegisterModal';
import UserProfileMenu from '../../auth/UserProfileMenu/UserProfileMenu';
import { notificationManager } from '../Notification/Notification';
import './Navigation.css';

const Navigation = ({ currentMode, onModeChange, authState, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const isAuthenticated = authState?.isAuthenticated || false;
  const user = authState?.user || null;

  const handleLoginSuccess = (userData) => {
    console.log('Navigation: Login success:', userData);
    setShowAuthModal(false);
    
    // Hiển thị thông báo với role
    const userRole = userData.roles?.[0]?.name || 'USER';
    notificationManager.success(`Chào mừng ${userData.ten}! (${userRole})`);
    
    // Nếu là admin, tự động chuyển sang admin panel sau 1 giây
    if (userData.isAdmin) {
      setTimeout(() => {
        if (onModeChange) {
          onModeChange('admin');
        }
      }, 1000);
    }
  };

  const handleLogout = async () => {
    console.log('Navigation: Logout triggered');
    setIsMenuOpen(false);
    if (onLogout) {
      await onLogout();
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { id: 'home', title: 'Trang chủ', icon: '🏠', path: '/' },
    { id: 'products', title: 'Sản phẩm', icon: '📦', path: '/products' },
    { id: 'about', title: 'Giới thiệu', icon: 'ℹ️', path: '/about' },
    { id: 'contact', title: 'Liên hệ', icon: '📞', path: '/contact' }
  ];

  return (
    <>
      <nav className="main-navigation">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">OnlineShop</span>
          </div>

          {/* Desktop Menu */}
          <div className="nav-menu">
            {menuItems.map(item => (
              <a key={item.id} href={item.path} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                <span>{item.title}</span>
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <UserProfileMenu 
                  user={user} 
                  onLogout={handleLogout}
                  onModeChange={onModeChange}
                />
                {/* Hiển thị các quyền đặc biệt */}
                {authService.hasPermission('VIEW_REPORTS') && (
                  <button className="nav-action-btn">
                    <span className="btn-icon">📊</span>
                    <span>Báo cáo</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button 
                  className="nav-action-btn"
                  onClick={() => openAuthModal('login')}
                >
                  <span className="btn-icon">🔑</span>
                  <span>Đăng nhập</span>
                </button>
                <button 
                  className="nav-action-btn"
                  onClick={() => openAuthModal('register')}
                >
                  <span className="btn-icon">📝</span>
                  <span>Đăng ký</span>
                </button>
              </>
            )}

            {/* Chỉ hiển thị nút admin nếu có quyền */}
            {isAuthenticated && authService.hasRole('ADMIN') && (
              <button 
                className="mode-switch-btn"
                onClick={() => onModeChange?.('admin')}
              >
                <span className="btn-icon">🛠️</span>
                <span>Quản trị</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle giữ nguyên */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu giữ nguyên */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <span className="logo-icon">🛍️</span>
              <span>OnlineShop</span>
            </div>
            <button 
              className="mobile-menu-close"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mobile-menu-content">
            {menuItems.map(item => (
              <a 
                key={item.id} 
                href={item.path} 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.title}</span>
              </a>
            ))}

            <div className="mobile-menu-divider"></div>

            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <strong>{user?.ten}</strong>
                  <span>{user?.email}</span>
                </div>
                {/* Nút admin chỉ hiển thị nếu có role ADMIN */}
                {authService.hasRole('ADMIN') && (
                  <button 
                    className="mobile-mode-switch-btn"
                    onClick={() => {
                      onModeChange?.('admin');
                      setIsMenuOpen(false);
                    }}
                  >
                    <span>🛠️</span>
                    <span>Quản trị hệ thống</span>
                  </button>
                )}
                <button 
                  className="mobile-nav-link"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  className="mobile-nav-link"
                  onClick={() => openAuthModal('login')}
                >
                  <span>🔑</span>
                  <span>Đăng nhập</span>
                </button>
                <button 
                  className="mobile-nav-link"
                  onClick={() => openAuthModal('register')}
                >
                  <span>📝</span>
                  <span>Đăng ký</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal giữ nguyên */}
      {showAuthModal && (
        <LoginRegisterModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={authModalMode}
        />
      )}
    </>
  );
};

export default Navigation;