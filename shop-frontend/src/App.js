// src/App.js - Final version với routing đơn giản
import React, { useEffect, useState } from 'react';
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import CustomerShop from './components/shop/CustomerShop';
import Navigation from './components/layout/Navigation/Navigation';
import { NotificationContainer } from './components/layout/Notification/Notification';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState('customer');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize app mode
  useEffect(() => {
    const initializeApp = () => {
      const urlPath = window.location.pathname;
      const savedMode = localStorage.getItem('appMode');
      
      let initialMode = 'customer';
      
      if (urlPath.includes('/admin')) {
        initialMode = 'admin';
      } else if (urlPath.includes('/shop') || urlPath === '/') {
        initialMode = 'customer';
      } else if (savedMode && ['admin', 'customer'].includes(savedMode)) {
        initialMode = savedMode;
      }
      
      setCurrentMode(initialMode);
      updateAppState(initialMode);
      
      const expectedPath = initialMode === 'admin' ? '/admin' : '/shop';
      if (window.location.pathname !== expectedPath) {
        window.history.replaceState({}, '', expectedPath);
      }
      
      setIsLoading(false);
    };

    setTimeout(initializeApp, 300);
  }, []);

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlPath = window.location.pathname;
      const newMode = urlPath.includes('/admin') ? 'admin' : 'customer';
      
      if (newMode !== currentMode) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMode(newMode);
          updateAppState(newMode);
          setIsTransitioning(false);
        }, 200);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentMode]);

  // Listen for custom mode change events
  useEffect(() => {
    const handleModeChanged = (event) => {
      const { mode } = event.detail;
      if (mode !== currentMode) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMode(mode);
          updateAppState(mode);
          setIsTransitioning(false);
        }, 200);
      }
    };

    window.addEventListener('modeChanged', handleModeChanged);
    return () => window.removeEventListener('modeChanged', handleModeChanged);
  }, [currentMode]);

  const updateAppState = (mode) => {
    document.title = mode === 'admin' 
      ? 'Admin Panel - Quản lý cửa hàng' 
      : 'OnlineShop - Mua sắm trực tuyến';
      
    document.body.className = `app-${mode}`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = mode === 'admin'
        ? 'Hệ thống quản lý bán hàng trực tuyến - Trang quản trị'
        : 'Mua sắm trực tuyến với giá tốt nhất - Điện máy gia dụng';
    }
    
    localStorage.setItem('appMode', mode);
  };

  const handleModeChange = (newMode) => {
    if (newMode === currentMode) return;
    
    setIsTransitioning(true);
    
    // Update URL
    const newPath = newMode === 'admin' ? '/admin' : '/shop';
    window.history.pushState({}, '', newPath);
    
    setTimeout(() => {
      setCurrentMode(newMode);
      updateAppState(newMode);
      setIsTransitioning(false);
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🛍️ OnlineShop</h2>
          <p>Đang khởi tạo ứng dụng...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Show Navigation only in customer mode */}
      {currentMode === 'customer' && (
        <Navigation 
          currentMode={currentMode} 
          onModeChange={handleModeChange}
        />
      )}
      
      {/* Main Content */}
      <main className={`main-content ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="content-wrapper">
          {currentMode === 'admin' ? (
            <AdminLayout key="admin" onModeChange={handleModeChange} />
          ) : (
            <CustomerShop key="customer" />
          )}
        </div>
      </main>
      
      {/* Show Footer only in customer mode */}
      {currentMode === 'customer' && (
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>🛍️ OnlineShop</h4>
              <p>Mua sắm điện máy gia dụng với giá tốt nhất</p>
            </div>
            
            <div className="footer-section">
              <h4>Liên hệ</h4>
              <div className="contact-info">
                <p>📧 support@onlineshop.com</p>
                <p>📞 1900 123 456</p>
                <p>🏢 123 Đường ABC, Quận XYZ, TP.HCM</p>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Hỗ trợ</h4>
              <div className="footer-links">
                <a href="#privacy">Chính sách bảo mật</a>
                <a href="#terms">Điều khoản sử dụng</a>
                <a href="#help">Trợ giúp</a>
                <button 
                  className="footer-mode-btn"
                  onClick={() => handleModeChange('admin')}
                >
                  🛠️ Quản trị viên
                </button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 OnlineShop. Tất cả quyền được bảo lưu.</p>
              <p>Phiên bản: v2.1.0</p>
            </div>
          </div>
        </footer>
      )}
      
      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="transition-overlay">
          <div className="transition-content">
            <div className="transition-spinner"></div>
            <p>Đang chuyển đổi...</p>
          </div>
        </div>
      )}
      
      {/* Notification Container */}
      <NotificationContainer />
      
      {/* Quick mode switch button in admin */}
      {currentMode === 'admin' && (
        <button 
          className="quick-switch-btn"
          onClick={() => handleModeChange('customer')}
          title="Chuyển sang chế độ khách hàng"
        >
          🛍️
        </button>
      )}
    </div>
  );
}

export default App;