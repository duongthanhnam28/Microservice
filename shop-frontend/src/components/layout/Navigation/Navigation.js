// 1. FIXED Navigation.js - Thêm đăng nhập và sắp xếp lại header
import React, { useState, useEffect } from 'react';
import authService from '../../../services/api/authService';
import LoginRegisterModal from '../../auth/LoginRegisterModal/LoginRegisterModal';
import UserProfileMenu from '../../auth/UserProfileMenu/UserProfileMenu';
import { notificationManager } from '../Notification/Notification';
import './Navigation.css';

const Navigation = ({ currentMode, onModeChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (authService.isUserAuthenticated()) {
      setUser(authService.getCurrentUser());
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    notificationManager.success(`Chào mừng ${userData.ten}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsMenuOpen(false);
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
              <UserProfileMenu 
                user={user} 
                onLogout={handleLogout}
                onModeChange={onModeChange}
              />
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

            {isAuthenticated && user?.isAdmin && (
              <button 
                className="mode-switch-btn"
                onClick={() => onModeChange?.('admin')}
              >
                <span className="btn-icon">🛠️</span>
                <span>Quản trị</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
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
                
                {user?.isAdmin && (
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

      {/* Auth Modal */}
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