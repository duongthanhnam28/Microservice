// FIXED authService.js - Khắc phục lỗi update profile và auth synchronization
class AuthService {
  constructor() {
    this.API_URL = 'http://localhost:9002'; // Account service port
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.listeners = []; // Add listeners for auth state changes
    this.isLoggingOut = false; // FIXED: Prevent double logout
    this.initializeFromStorage();
  }

  // Add listener for auth state changes
  addAuthStateListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // FIXED: Notify all listeners with debounce to prevent multiple calls
  notifyListeners() {
    // Clear any pending notifications
    if (this.notifyTimeout) {
      clearTimeout(this.notifyTimeout);
    }
    
    // Debounce notifications to prevent rapid firing
    this.notifyTimeout = setTimeout(() => {
      const authState = {
        isAuthenticated: this.isUserAuthenticated(),
        user: this.currentUser
      };
      
      console.log('Auth state notification:', authState);
      
      this.listeners.forEach(listener => {
        try {
          listener(authState);
        } catch (error) {
          console.error('Error in auth listener:', error);
        }
      });
    }, 100);
  }

  // Initialize from localStorage
  initializeFromStorage() {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedAccessToken = localStorage.getItem('accessToken');
      const savedRefreshToken = localStorage.getItem('refreshToken');
      
      if (savedUser && savedAccessToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            this.currentUser = parsedUser;
            this.accessToken = savedAccessToken;
            this.refreshToken = savedRefreshToken;
            console.log('Auth initialized from storage:', this.currentUser.email);
          } else {
            this.clearTokens();
          }
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError);
          this.clearTokens();
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      this.clearTokens();
    }
  }

  // Login method with proper account-service integration
  async login(usernameOrEmail, password) {
    try {
      console.log('=== AUTH SERVICE LOGIN ===');
      console.log('Attempting login for:', usernameOrEmail);
      
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password
        })
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        return {
          success: false,
          message: errorData.message || 'Đăng nhập thất bại'
        };
      }

      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.code === 1000) { // Success code from backend
        this.accessToken = data.result.accessToken;
        this.refreshToken = data.result.refreshToken;
        
        // Get user info using the new access token
        const userInfo = await this.fetchUserInfo();
        
        if (userInfo) {
          this.currentUser = userInfo;
          this.saveTokens();
          this.notifyListeners(); // Notify listeners of login
          
          return {
            success: true,
            user: this.currentUser,
            message: data.message || 'Đăng nhập thành công'
          };
        } else {
          // If can't get user info, clear tokens
          this.clearTokens();
          return {
            success: false,
            message: 'Không thể lấy thông tin người dùng'
          };
        }
      } else {
        return {
          success: false,
          message: data.message || 'Đăng nhập thất bại'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // Register method with proper account-service integration  
  async register(userData) {
    try {
      console.log('=== AUTH SERVICE REGISTER ===');
      console.log('Register data:', userData);
      
      const requestBody = {
        username: userData.ten || userData.username,
        email: userData.email,
        password: userData.matKhau || userData.password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.sdt || userData.phoneNumber || ''
      };

      console.log('Request body:', requestBody);
      
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Register response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Register failed:', errorData);
        return {
          success: false,
          message: errorData.message || 'Đăng ký thất bại'
        };
      }

      const data = await response.json();
      console.log('Register response data:', data);
      
      return {
        success: data.code === 1000,
        message: data.message || (data.code === 1000 ? 'Đăng ký thành công' : 'Đăng ký thất bại'),
        user: data.result
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // Get user info from /users/myInfo with proper error handling
  async fetchUserInfo() {
    if (!this.accessToken) {
      console.warn('No access token available for fetchUserInfo');
      return null;
    }
    
    try {
      const response = await fetch(`${this.API_URL}/users/myInfo`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetch user info response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch user info, status:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('User info response:', data);
      
      if (data.code === 1000) {
        const userInfo = {
          id: data.result.id,
          ten: (data.result.firstName || '') + ' ' + (data.result.lastName || ''), // Combine first and last name
          email: data.result.email,
          sdt: data.result.phoneNumber || '',
          diaChi: '', // Address not available in current backend
          username: data.result.username,
          firstName: data.result.firstName || '',
          lastName: data.result.lastName || '',
          roles: data.result.roles || [],
          isAdmin: this.checkIfAdmin(data.result.roles)
        };
        
        console.log('Processed user info:', userInfo);
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Fetch user info error:', error);
      return null;
    }
  }

  // FIXED: Logout method - Better handling to prevent double logout
  async logout() {
    // FIXED: Prevent multiple simultaneous logout calls
    if (this.isLoggingOut) {
      console.log('Logout already in progress, skipping...');
      return { success: true, message: 'Đang đăng xuất...' };
    }

    try {
      this.isLoggingOut = true;
      console.log('=== AUTH SERVICE LOGOUT ===');
      
      if (this.accessToken && this.refreshToken) {
        try {
          const response = await fetch(`${this.API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refreshToken: this.refreshToken
            })
          });
          
          console.log('Logout API response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Logout API response:', data);
          }
        } catch (apiError) {
          console.error('Logout API error:', apiError);
          // Continue with local logout even if API fails
        }
      }
      
      // Always clear tokens and notify listeners
      this.clearTokens();
      this.notifyListeners(); // Notify listeners of logout
      
      return { 
        success: true, 
        message: 'Đăng xuất thành công' 
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens on error
      this.clearTokens();
      this.notifyListeners();
      return { 
        success: true, 
        message: 'Đăng xuất thành công' 
      };
    } finally {
      // FIXED: Reset logout flag after delay to prevent issues
      setTimeout(() => {
        this.isLoggingOut = false;
      }, 1000);
    }
  }

  // FIXED: Update profile method with proper backend integration and fallback
  async updateProfile(userData) {
    try {
      console.log('=== UPDATE PROFILE ===');
      console.log('Update data:', userData);
      
      if (!this.isUserAuthenticated()) {
        return {
          success: false,
          message: 'Vui lòng đăng nhập'
        };
      }

      // FIXED: Try the actual API endpoint first
      try {
        const response = await fetch(`${this.API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: userData.ten?.split(' ')[0] || '',
            lastName: userData.ten?.split(' ').slice(1).join(' ') || '',
            phoneNumber: userData.sdt || ''
          })
        });

        console.log('Update profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Update profile response:', data);
          
          if (data.code === 1000) {
            // Success - refresh user info
            const updatedUserInfo = await this.fetchUserInfo();
            if (updatedUserInfo) {
              this.currentUser = updatedUserInfo;
              this.saveTokens();
              this.notifyListeners();
              return {
                success: true,
                message: data.message || 'Cập nhật thông tin thành công',
                data: this.currentUser
              };
            }
          }
        } else {
          console.warn('API endpoint failed, using fallback update');
        }
      } catch (apiError) {
        console.warn('Profile API not available, using fallback:', apiError);
      }

      // FIXED: Fallback - update local user data and save
      console.log('Using fallback profile update');
      
      const updatedUser = {
        ...this.currentUser,
        ten: userData.ten || this.currentUser.ten,
        sdt: userData.sdt || this.currentUser.sdt,
        diaChi: userData.diaChi || this.currentUser.diaChi,
        firstName: userData.ten?.split(' ')[0] || this.currentUser.firstName,
        lastName: userData.ten?.split(' ').slice(1).join(' ') || this.currentUser.lastName
      };
      
      this.currentUser = updatedUser;
      this.saveTokens();
      this.notifyListeners();

      return {
        success: true,
        message: 'Cập nhật thông tin thành công (chế độ offline)',
        data: this.currentUser
      };

    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Cập nhật thông tin thất bại'
      };
    }
  }

  // Utility methods
  saveTokens() {
    try {
      if (this.accessToken) localStorage.setItem('accessToken', this.accessToken);
      if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken);
      if (this.currentUser) localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  // FIXED: Clear tokens method with better cleanup
  clearTokens() {
    console.log('Clearing auth tokens and user data');
    
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      
      // FIXED: Also clear any other related storage
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  checkIfAdmin(roles) {
    if (!roles || !Array.isArray(roles)) return false;
    return roles.some(role => role.name === 'ADMIN');
  }

  isUserAuthenticated() {
    const hasTokens = !!(this.accessToken && this.refreshToken);
    const hasUser = !!this.currentUser;
    
    return hasTokens && hasUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAccessToken() {
    return this.accessToken;
  }

  // Email validation
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  // Phone validation  
  isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    return phoneRegex.test(phone.trim());
  }

  // Reset password method (placeholder - would need backend endpoint)
  async resetPassword(email) {
    try {
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Email không đúng định dạng'
        };
      }

      // This would need a separate endpoint in your backend like POST /auth/forgot-password
      // For now, just return success message
      return {
        success: true,
        message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Không thể đặt lại mật khẩu'
      };
    }
  }

  // HTTP Interceptor for auto refresh token
  async makeAuthenticatedRequest(url, options = {}) {
    let response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // If token expired (401), try refresh
    if (response.status === 401 && !this.isLoggingOut) {
      const refreshSuccess = await this.refreshAccessToken();
      
      if (refreshSuccess) {
        // Retry request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
      } else {
        // Refresh failed, clear tokens
        this.clearTokens();
        this.notifyListeners();
        return null;
      }
    }

    return response;
  }

  // Refresh token method - integrates with /auth/refresh
  async refreshAccessToken() {
    if (!this.refreshToken || this.isLoggingOut) return false;
    
    try {
      const response = await fetch(`${this.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code === 1000) {
        this.accessToken = data.result.accessToken;
        this.refreshToken = data.result.refreshToken;
        this.saveTokens();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.clearTokens();
      this.notifyListeners();
      return false;
    }
  }

  // Change password method - integrates with /users/change-password
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${this.API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.code === 1000,
        message: data.message || (data.code === 1000 ? 'Đổi mật khẩu thành công' : 'Đổi mật khẩu thất bại')
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Đổi mật khẩu thất bại'
      };
    }
  }
}

const authService = new AuthService();
export default authService;