// FINAL App.js - Complete fix for admin interface and CORS
import React, { useEffect, useState } from 'react';
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import CustomerShop from './components/shop/CustomerShop';
import Navigation from './components/layout/Navigation/Navigation';
import authService from './services/api/authService';
import { NotificationContainer, notificationManager } from './components/layout/Notification/Notification';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState('customer');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // FIXED: Add central auth state management
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });

  // FIXED: Central auth state listener
  useEffect(() => {
    const initializeApp = () => {
      // Check initial auth state
      const isAuth = authService.isUserAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: isAuth,
        user: currentUser
      });
      
      // FIXED: Check URL to determine initial mode
      const urlPath = window.location.pathname;
      const initialMode = urlPath.includes('/admin') ? 'admin' : 'customer';
      
      // FIXED: Verify admin access
      if (initialMode === 'admin') {
        if (!isAuth || !currentUser?.isAdmin) {
          // Redirect to customer if no admin access
          setCurrentMode('customer');
          updateAppState('customer');
          window.history.replaceState({}, '', '/shop');
        } else {
          setCurrentMode('admin');
          updateAppState('admin');
        }
      } else {
        setCurrentMode('customer');
        updateAppState('customer');
        if (window.location.pathname !== '/shop') {
          window.history.replaceState({}, '', '/shop');
        }
      }
      
      setIsLoading(false);
    };

    // FIXED: Subscribe to auth changes BEFORE initializing
    const unsubscribe = authService.addAuthStateListener((newAuthState) => {
      console.log('App: Auth state changed:', newAuthState);
      
      setAuthState({
        isAuthenticated: newAuthState.isAuthenticated,
        user: newAuthState.user
      });
      
      // FIXED: If user logged out and in admin mode, redirect to customer
      if (!newAuthState.isAuthenticated && currentMode === 'admin') {
        console.log('App: User logged out while in admin mode, switching to customer');
        setCurrentMode('customer');
        updateAppState('customer');
        window.history.replaceState({}, '', '/shop');
      }
    });

    // Short delay for smooth loading
    setTimeout(initializeApp, 300);

    return () => {
      unsubscribe();
    };
  }, [currentMode]);

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlPath = window.location.pathname;
      const newMode = urlPath.includes('/admin') ? 'admin' : 'customer';
      
      if (newMode !== currentMode) {
        // FIXED: Check auth before allowing admin mode
        if (newMode === 'admin' && !authState.isAuthenticated) {
          // Redirect to customer if trying to access admin without auth
          window.history.replaceState({}, '', '/shop');
          return;
        }
        
        if (newMode === 'admin' && authState.user && !authState.user.isAdmin) {
          // Redirect to customer if not admin
          window.history.replaceState({}, '', '/shop');
          return;
        }
        
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
  }, [currentMode, authState]);

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

  // CẬP NHẬT: handleModeChange chỉ kiểm tra admin đơn giản
  const handleModeChange = (newMode) => {
    if (newMode === currentMode) return;
    
    console.log(`Attempting to change mode from ${currentMode} to ${newMode}`);
    
    // Chỉ kiểm tra admin đơn giản
    if (newMode === 'admin') {
      if (!authState.isAuthenticated) {
        notificationManager.error('Vui lòng đăng nhập để truy cập trang quản trị');
        return;
      }
      
      if (!authService.isAdmin()) {
        notificationManager.error('Bạn không có quyền truy cập trang quản trị');
        return;
      }
    }
    
    setIsTransitioning(true);
    
    const newPath = newMode === 'admin' ? '/admin' : '/shop';
    window.history.pushState({}, '', newPath);
    
    setTimeout(() => {
      setCurrentMode(newMode);
      updateAppState(newMode);
      setIsTransitioning(false);
      console.log(`Successfully changed to ${newMode} mode`);
    }, 200);
  };

  // FIXED: Handle login success with proper state update
  const handleLoginSuccess = (userData) => {
    console.log('App: Login successful, user data:', userData);
    
    // Auth state will be updated by the listener, so no need to manually set here
    
    // If user is admin, automatically redirect to admin panel
    if (userData.isAdmin) {
      setTimeout(() => {
        handleModeChange('admin');
      }, 1000);
    }
  };

  // FIXED: Handle logout properly with state sync
  const handleLogout = async () => {
    console.log('App: Logout initiated');
    
    try {
      // AuthService will handle the logout and notify listeners
      const result = await authService.logout();
      
      // Force switch to customer mode after logout
      if (currentMode === 'admin') {
        setCurrentMode('customer');
        updateAppState('customer');
        window.history.replaceState({}, '', '/shop');
      }
      
      console.log('App: Logout completed, switched to customer mode');
      
    } catch (error) {
      console.error('App: Logout error:', error);
      // Still force mode switch on error
      if (currentMode === 'admin') {
        setCurrentMode('customer');
        updateAppState('customer');
        window.history.replaceState({}, '', '/shop');
      }
    }
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
      {/* FIXED: Only show Navigation in customer mode */}
      {currentMode === 'customer' && (
        <Navigation 
          currentMode={currentMode}
          onModeChange={handleModeChange}
          authState={authState}
          onLogout={handleLogout}
        />
      )}
      
      {/* Main Content */}
      <main className={`main-content ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="content-wrapper">
          {currentMode === 'admin' ? (
            <AdminLayout 
              key="admin" 
              onModeChange={handleModeChange}
              authState={authState}
              onLogout={handleLogout}
            />
          ) : (
            <CustomerShop 
              key="customer" 
              onModeChange={handleModeChange}
              onLoginSuccess={handleLoginSuccess}
              authState={authState}
            />
          )}
        </div>
      </main>
      
      {/* FIXED: Show Footer only in customer mode */}
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
                {authState.isAuthenticated && authState.user?.isAdmin && (
                  <button 
                    className="footer-mode-btn"
                    onClick={() => handleModeChange('admin')}
                  >
                    🛠️ Quản trị viên
                  </button>
                )}
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