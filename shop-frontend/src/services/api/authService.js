// ENHANCED AuthService.js - Support Email/Username Login
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

  // ENHANCED: Login with smart identifier detection
  async login(identifier, password) {
    try {
      // Clean and validate identifier
      const cleanIdentifier = this.cleanIdentifier(identifier);
      if (!cleanIdentifier) {
        return { success: false, message: 'Vui lòng nhập email hoặc tên đăng nhập' };
      }

      // Detect identifier type for better user feedback
      const identifierType = this.detectIdentifierType(cleanIdentifier);
      console.log(`=== LOGGING IN ===`);
      console.log(`Identifier: ${cleanIdentifier}`);
      console.log(`Type detected: ${identifierType}`);
      
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usernameOrEmail: cleanIdentifier, // Backend expects this field name
          password 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || 'Đăng nhập thất bại';
        
        // Enhance error message based on identifier type
        if (errorMessage.includes('not found') || errorMessage.includes('not existed')) {
          errorMessage = identifierType === 'email' 
            ? 'Email không tồn tại trong hệ thống' 
            : 'Tên đăng nhập không tồn tại';
        } else if (errorMessage.includes('credentials') || errorMessage.includes('password')) {
          errorMessage = 'Mật khẩu không chính xác';
        }
        
        return { success: false, message: errorMessage };
      }

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.code === 1000) {
        this.accessToken = data.result.accessToken;
        this.refreshToken = data.result.refreshToken;
        
        // Get complete user info with roles
        const userInfo = await this.fetchUserInfo();
        
        if (userInfo) {
          this.currentUser = userInfo;
          this.saveTokens();
          this.notifyListeners();
          
          console.log('✅ Login successful:', {
            user: userInfo.username,
            name: userInfo.ten,
            loginMethod: identifierType,
            roles: userInfo.roles?.map(r => r.name),
            isAdmin: userInfo.isAdmin
          });
          
          return {
            success: true,
            user: this.currentUser,
            message: `Đăng nhập thành công với ${identifierType === 'email' ? 'email' : 'tên đăng nhập'}`
          };
        }
      }
      
      return { success: false, message: data.message || 'Đăng nhập thất bại' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
  }

  // ENHANCED: Clean and normalize identifier
  cleanIdentifier(identifier) {
    if (!identifier || typeof identifier !== 'string') {
      return '';
    }
    
    // Remove whitespace and convert to lowercase for emails
    let cleaned = identifier.trim();
    
    // If it's an email, convert to lowercase for consistency
    if (this.detectIdentifierType(cleaned) === 'email') {
      cleaned = cleaned.toLowerCase();
    }
    
    return cleaned;
  }

  // ENHANCED: Detect identifier type (email vs username)
  detectIdentifierType(identifier) {
    if (!identifier || typeof identifier !== 'string') {
      return 'unknown';
    }

    const trimmed = identifier.trim();
    
    // Check if it's an email
    if (trimmed.includes('@') && this.isValidEmail(trimmed)) {
      return 'email';
    }
    
    // Check if it might be a username
    if (this.isValidUsername(trimmed)) {
      return 'username';
    }
    
    return 'unknown';
  }

  // ENHANCED: Validate email format
  isValidEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    const trimmed = email.trim();
    if (trimmed.length === 0 || trimmed.length > 100) {
      return false;
    }
    
    // Comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    return emailRegex.test(trimmed);
  }

  // ENHANCED: Validate username format (export để dùng trong component)
  isValidUsername(username) {
    if (!username || typeof username !== 'string') {
      return false;
    }
    
    const trimmed = username.trim();
    
    // Username requirements: 3-50 characters, letters, numbers, underscores only
    if (trimmed.length < 3 || trimmed.length > 50) {
      return false;
    }
    
    // Only allow letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(trimmed);
  }

  // ENHANCED: Phone validation (kept for registration)
  isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return false;
    }
    
    const trimmed = phone.trim();
    if (trimmed.length === 0) return true; // Optional field
    
    // Vietnamese phone number patterns
    const phoneRegex = /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/;
    return phoneRegex.test(trimmed.replace(/\s/g, ''));
  }

  // ENHANCED: Validate login credentials
  validateLoginCredentials(identifier, password) {
    const errors = {};

    // Validate identifier
    if (!identifier || !identifier.trim()) {
      errors.identifier = 'Vui lòng nhập email hoặc tên đăng nhập';
    } else {
      const cleanId = this.cleanIdentifier(identifier);
      const type = this.detectIdentifierType(cleanId);
      
      if (type === 'email') {
        if (!this.isValidEmail(cleanId)) {
          errors.identifier = 'Email không đúng định dạng';
        }
      } else if (type === 'username') {
        if (!this.isValidUsername(cleanId)) {
          errors.identifier = 'Tên đăng nhập không hợp lệ (3-50 ký tự, chỉ chữ cái, số và _)';
        }
      } else {
        errors.identifier = 'Vui lòng nhập email hoặc tên đăng nhập hợp lệ';
      }
    }

    // Validate password
    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ENHANCED: Get user-friendly identifier description
  getIdentifierDescription(identifier) {
    if (!identifier) return '';
    
    const type = this.detectIdentifierType(identifier);
    switch (type) {
      case 'email':
        return 'email';
      case 'username':
        return 'tên đăng nhập';
      default:
        return 'thông tin đăng nhập';
    }
  }

  // ENHANCED: Mask sensitive identifier for logging
  maskIdentifier(identifier) {
    if (!identifier || typeof identifier !== 'string') {
      return '***';
    }

    const type = this.detectIdentifierType(identifier);
    
    if (type === 'email') {
      const atIndex = identifier.indexOf('@');
      if (atIndex > 3) {
        return identifier.substring(0, 3) + '***' + identifier.substring(atIndex);
      }
      return '***@' + identifier.substring(atIndex + 1);
    } else if (type === 'username') {
      if (identifier.length > 5) {
        return identifier.substring(0, 3) + '***';
      }
      return identifier.substring(0, 1) + '***';
    }
    
    return '***';
  }

  // ENHANCED: Register with proper validation
  async register(userData) {
    try {
      // Validate required fields
      const validation = this.validateRegisterData(userData);
      if (!validation.isValid) {
        return { 
          success: false, 
          message: Object.values(validation.errors)[0] 
        };
      }

      const requestBody = {
        username: userData.username.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        firstName: userData.firstName ? userData.firstName.trim() : '',
        lastName: userData.lastName ? userData.lastName.trim() : '',
        phoneNumber: userData.phoneNumber ? userData.phoneNumber.trim() : ''
      };

      console.log('Registering user:', {
        username: requestBody.username,
        email: requestBody.email,
        hasPhone: !!requestBody.phoneNumber
      });

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
      let errorMessage = errorData.message || 'Đăng ký thất bại';
      
      // Enhance error messages
      if (errorMessage.includes('already exists') || errorMessage.includes('đã tồn tại')) {
        if (errorMessage.includes('username')) {
          errorMessage = 'Tên đăng nhập đã được sử dụng';
        } else if (errorMessage.includes('email')) {
          errorMessage = 'Email đã được đăng ký';
        }
      }
      
      return { success: false, message: errorMessage };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
  }

  // ENHANCED: Validate registration data
  validateRegisterData(userData) {
    const errors = {};

    // Username validation
    if (!userData.username || !userData.username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (!this.isValidUsername(userData.username.trim())) {
      errors.username = 'Tên đăng nhập không hợp lệ (3-50 ký tự, chỉ chữ cái, số và _)';
    }

    // Email validation
    if (!userData.email || !userData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!this.isValidEmail(userData.email.trim())) {
      errors.email = 'Email không đúng định dạng';
    }

    // Password validation
    if (!userData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (userData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Confirm password validation
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Optional phone validation
    if (userData.phoneNumber && !this.isValidPhone(userData.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không đúng định dạng';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Rest of the existing methods remain unchanged...
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
        
        console.log('Processed user info:', userInfo);
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Fetch user info error:', error);
      return null;
    }
  }

  checkIfAdmin(roles) {
    if (!roles || !Array.isArray(roles)) return false;
    return roles.some(role => 
      role && (role.name === 'ADMIN' || role.name === 'admin')
    );
  }

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

  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin === true;
  }

  hasPermission(permission) {
    if (!this.currentUser || !this.currentUser.roles) return false;
    
    return this.currentUser.roles.some(role => 
      role.permissions && role.permissions.some(p => p.name === permission)
    );
  }

  hasRole(roleName) {
    if (!this.currentUser || !this.currentUser.roles) return false;
    return this.currentUser.roles.some(role => role.name === roleName);
  }

  canAccessAdmin() {
    return this.isUserAuthenticated() && this.currentUser?.isAdmin === true;
  }

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

      if (response && response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          const updatedUserInfo = await this.fetchUserInfo();
          if (updatedUserInfo) {
            this.currentUser = updatedUserInfo;
            this.saveTokens();
            this.notifyListeners();
          }
          return { success: true, message: 'Cập nhật thành công', data: this.currentUser };
        }
      }

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