// FIXED authService.js - Complete Auth & Authorization handling
class AuthService {
  constructor() {
    this.API_URL = 'http://localhost:9002';
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.listeners = [];
    this.isLoggingOut = false;
    this.initializeFromStorage();
  }

  // ĐẢM BẢO: Method makeAuthenticatedRequest tồn tại và đúng logic
  async makeAuthenticatedRequest(url, options = {}) {
    if (!this.accessToken) {
      console.warn('No access token available');
      return null;
    }

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
      console.log('Token expired, attempting refresh...');
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

  // FIXED: Login with proper role detection
  async login(usernameOrEmail, password) {
    try {
      console.log('=== LOGGING IN ===', usernameOrEmail);
      
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Đăng nhập thất bại' };
      }

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.code === 1000) {
        this.accessToken = data.result.accessToken;
        this.refreshToken = data.result.refreshToken;
        
        // FIXED: Get complete user info with roles
        const userInfo = await this.fetchUserInfo();
        
        if (userInfo) {
          this.currentUser = userInfo;
          this.saveTokens();
          this.notifyListeners();
          
          console.log('✅ Login successful:', {
            user: userInfo.username,
            roles: userInfo.roles?.map(r => r.name),
            isAdmin: userInfo.isAdmin
          });
          
          return {
            success: true,
            user: this.currentUser,
            message: 'Đăng nhập thành công'
          };
        }
      }
      
      return { success: false, message: data.message || 'Đăng nhập thất bại' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Lỗi kết nối' };
    }
  }

  // FIXED: Fetch user info with proper role checking
  async fetchUserInfo() {
    if (!this.accessToken) {
      console.warn('No access token available for fetchUserInfo');
      return null;
    }
    
    try {
      const response = await fetch(`${this.API_URL}/users/myInfo`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        console.error('Failed to fetch user info, status:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.code === 1000 && data.result) {
        const userInfo = {
          id: data.result.id,
          ten: `${data.result.firstName || ''} ${data.result.lastName || ''}`.trim(),
          email: data.result.email,
          sdt: data.result.phoneNumber || '',
          diaChi: '',
          username: data.result.username,
          firstName: data.result.firstName || '',
          lastName: data.result.lastName || '',
          roles: data.result.roles || [],
          permissions: this.extractPermissions(data.result.roles),
          isAdmin: this.checkIfAdmin(data.result.roles)
        };
        
        console.log('Processed user info with permissions:', userInfo);
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Fetch user info error:', error);
      return null;
    }
  }

  // FIXED: Check admin permissions properly
  checkIfAdmin(roles) {
    if (!roles || !Array.isArray(roles)) return false;
    return roles.some(role => 
      role && (role.name === 'ADMIN' || role.name === 'admin')
    );
  }

  // THÊM: Method để lấy headers với token
  getAuthHeaders() {
    if (!this.accessToken) {
      return {
        'Content-Type': 'application/json'
      };
    }
    
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // THÊM: Kiểm tra có phải admin không (đơn giản)
  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin === true;
  }

  // GIỮ NGUYÊN: checkIfAdmin đã có
  checkIfAdmin(roles) {
    if (!roles || !Array.isArray(roles)) return false;
    return roles.some(role => role.name === 'ADMIN');
  }

  // THÊM: Method kiểm tra quyền
  hasPermission(permission) {
    if (!this.currentUser || !this.currentUser.roles) return false;
    
    return this.currentUser.roles.some(role => 
      role.permissions && role.permissions.some(p => p.name === permission)
    );
  }

  // THÊM: Method kiểm tra role
  hasRole(roleName) {
    if (!this.currentUser || !this.currentUser.roles) return false;
    return this.currentUser.roles.some(role => role.name === roleName);
  }

  // FIXED: Check if user has any of the specified roles
  hasRole(roleName) {
    if (!this.currentUser || !this.currentUser.roles) return false;
    return this.currentUser.roles.some(role => role.name === roleName);
  }

  // FIXED: Check if user can access admin features
  canAccessAdmin() {
    return this.isUserAuthenticated() && this.currentUser?.isAdmin === true;
  }

  // FIXED: Update profile using authenticated request
  async updateProfile(userData) {
    try {
      if (!this.isUserAuthenticated()) {
        return { success: false, message: 'Vui lòng đăng nhập' };
      }

      const updateData = {
        firstName: userData.ten?.split(' ')[0] || userData.firstName || '',
        lastName: userData.ten?.split(' ').slice(1).join(' ') || userData.lastName || '',
        phoneNumber: userData.sdt || userData.phoneNumber || ''
      };

      const response = await this.makeAuthenticatedRequest(`${this.API_URL}/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (response && response.ok) { // Check if response is not null
        const data = await response.json();
        if (data.code === 1000) {
          // Refresh user info
          const updatedUserInfo = await this.fetchUserInfo();
          if (updatedUserInfo) {
            this.currentUser = updatedUserInfo;
            this.saveTokens();
            this.notifyListeners();
          }
          return { success: true, message: 'Cập nhật thành công', data: this.currentUser };
        }
      }

      // Fallback to local update
      console.warn('API update failed, using local fallback');
      this.currentUser = { ...this.currentUser, ...userData };
      this.saveTokens();
      this.notifyListeners();
      return { success: true, message: 'Cập nhật thành công (local)', data: this.currentUser };

    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Cập nhật thất bại' };
    }
  }

  // FIXED: Admin operations with proper auth
  async getAllUsers() {
    try {
      if (!this.canAccessAdmin()) {
        throw new Error('Không có quyền truy cập');
      }

      const response = await this.makeAuthenticatedRequest(`${this.API_URL}/users/admin/allUser`);
      
      if (response && response.ok) { // Check if response is not null
        const data = await response.json();
        return { success: data.code === 1000, data: data.result, message: data.message };
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, message: error.message };
    }
  }

  async getUser(userId) {
    try {
      if (!this.canAccessAdmin()) {
        throw new Error('Không có quyền truy cập');
      }

      const response = await this.makeAuthenticatedRequest(`${this.API_URL}/users/admin/${userId}`);
      
      if (response && response.ok) { // Check if response is not null
        const data = await response.json();
        return { success: data.code === 1000, data: data.result, message: data.message };
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: error.message };
    }
  }

  async addRoleToUser(userId, roleName) {
    try {
      if (!this.canAccessAdmin()) {
        throw new Error('Không có quyền truy cập');
      }

      const response = await this.makeAuthenticatedRequest(`${this.API_URL}/users/admin/addRoleToUser`, {
        method: 'POST',
        body: JSON.stringify({ userId, roleName })
      });
      
      if (response && response.ok) { // Check if response is not null
        const data = await response.json();
        return { success: data.code === 1000, data: data.result, message: data.message };
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error('Add role error:', error);
      return { success: false, message: error.message };
    }
  }

  // FIXED: Token refresh with proper error handling
  async refreshAccessToken() {
    if (!this.refreshToken || this.isLoggingOut) return false;
    
    try {
      const response = await fetch(`${this.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          this.accessToken = data.result.accessToken;
          this.refreshToken = data.result.refreshToken;
          this.saveTokens();
          console.log('✅ Token refreshed successfully');
          return true;
        }
      }
      
      console.error('❌ Token refresh failed');
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  }

  // FIXED: Logout with proper cleanup
  async logout() {
    if (this.isLoggingOut) return { success: true };

    try {
      this.isLoggingOut = true;
      
      if (this.accessToken && this.refreshToken) {
        try {
          await this.makeAuthenticatedRequest(`${this.API_URL}/auth/logout`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken: this.refreshToken })
          });
        } catch (error) {
          console.warn('Logout API failed, continuing with local logout');
        }
      }
      
      this.clearTokens();
      this.notifyListeners();
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
      this.clearTokens();
      this.notifyListeners();
      return { success: true, message: 'Đăng xuất thành công' };
    } finally {
      setTimeout(() => { this.isLoggingOut = false; }, 1000);
    }
  }

  // Utility methods
  addAuthStateListener(listener) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  notifyListeners() {
    if (this.notifyTimeout) clearTimeout(this.notifyTimeout);
    this.notifyTimeout = setTimeout(() => {
      const authState = {
        isAuthenticated: this.isUserAuthenticated(),
        user: this.currentUser
      };
      this.listeners.forEach(listener => {
        try { listener(authState); } catch (error) { console.error('Listener error:', error); }
      });
    }, 100);
  }

  initializeFromStorage() {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedAccessToken = localStorage.getItem('accessToken');
      const savedRefreshToken = localStorage.getItem('refreshToken');
      
      if (savedUser && savedAccessToken) {
        this.currentUser = JSON.parse(savedUser);
        this.accessToken = savedAccessToken;
        this.refreshToken = savedRefreshToken;
        console.log('✅ Auth restored from storage:', this.currentUser?.username);
      }
    } catch (error) {
      console.error('Storage restore error:', error);
      this.clearTokens();
    }
  }

  saveTokens() {
    try {
      if (this.accessToken) localStorage.setItem('accessToken', this.accessToken);
      if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken);
      if (this.currentUser) localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } catch (error) {
      console.error('Save tokens error:', error);
    }
  }

  clearTokens() {
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Clear tokens error:', error);
    }
  }

  isUserAuthenticated() {
    return !!(this.accessToken && this.refreshToken && this.currentUser);
  }

  getCurrentUser() { return this.currentUser; }
  getAccessToken() { return this.accessToken; }
  
  // Validation methods
  isValidEmail(email) {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  isValidPhone(phone) {
    return phone && /^(\+84|0)[0-9]{9,10}$/.test(phone.trim());
  }

  // Register method
  async register(userData) {
    try {
      const requestBody = {
        username: userData.ten || userData.username,
        email: userData.email,
        password: userData.matKhau || userData.password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.sdt || userData.phoneNumber || ''
      };

      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: data.code === 1000,
          message: data.message || (data.code === 1000 ? 'Đăng ký thành công' : 'Đăng ký thất bại'),
          user: data.result
        };
      }

      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Đăng ký thất bại' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Lỗi kết nối' };
    }
  }

  // THÊM: Extract all permissions from roles
  extractPermissions(roles) {
    if (!roles || !Array.isArray(roles)) return [];
    
    const permissions = new Set();
    roles.forEach(role => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach(permission => {
          permissions.add(permission.name);
        });
      }
    });
    
    return Array.from(permissions);
  }
}

const authService = new AuthService();
export default authService;