// OPTIMIZED AuthService.js - Simplified and Clean
class AuthService {
  constructor() {
    this.API_URL = 'http://localhost:9002';
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.listeners = [];
    this.initFromStorage();
  }

  // === VALIDATION HELPERS ===
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim());
  }

  isValidUsername(username) {
    const clean = username?.trim();
    return clean && clean.length >= 3 && clean.length <= 50 && /^[a-zA-Z0-9_]+$/.test(clean);
  }

  isValidPhone(phone) {
    return !phone || /^(\+84|0)[0-9]{9,10}$/.test(phone.replace(/\s/g, ''));
  }

  detectLoginType(input) {
    return this.isValidEmail(input) ? 'email' : 'username';
  }

  // === AUTH OPERATIONS ===
  async login(identifier, password) {
    try {
      const cleanId = identifier?.trim();
      if (!cleanId || !password) {
        return { success: false, message: 'Vui lòng nhập đầy đủ thông tin' };
      }

      const loginType = this.detectLoginType(cleanId);
      
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usernameOrEmail: cleanId.toLowerCase(), 
          password 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          message: this.getErrorMessage(data.message, loginType) 
        };
      }

      if (data.code === 1000) {
        this.setTokens(data.result.accessToken, data.result.refreshToken);
        const userInfo = await this.fetchUserInfo();
        
        if (userInfo) {
          this.currentUser = userInfo;
          this.saveToStorage();
          this.notifyListeners();
          
          return {
            success: true,
            user: userInfo,
            message: `Đăng nhập thành công với ${loginType === 'email' ? 'email' : 'tên đăng nhập'}`
          };
        }
      }
      
      return { success: false, message: 'Đăng nhập thất bại' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Lỗi kết nối server' };
    }
  }

  async register(userData) {
    try {
      const validation = this.validateRegisterData(userData);
      if (!validation.isValid) {
        return { success: false, message: validation.errors[0] };
      }

      const payload = {
        username: userData.username.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        firstName: userData.firstName?.trim() || '',
        lastName: userData.lastName?.trim() || '',
        phoneNumber: userData.phoneNumber?.trim() || ''
      };

      console.log('=== REGISTER REQUEST ===');
      console.log('Payload:', payload);

      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return { success: false, message: 'Server trả về dữ liệu không hợp lệ' };
      }
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          // Bad request - usually validation error
          let errorMessage = data.message || 'Dữ liệu không hợp lệ';
          
          // Extract more specific error from response
          if (typeof data.result === 'string') {
            errorMessage = data.result;
          } else if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors[0];
          }
          
          return { success: false, message: errorMessage };
        }
        
        return { 
          success: false, 
          message: data.message || `Lỗi server (${response.status})` 
        };
      }
      
      return {
        success: data.code === 1000,
        message: data.message || 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Lỗi kết nối server' };
    }
  }

  async logout() {
    try {
      if (this.accessToken && this.refreshToken) {
        await this.makeAuthRequest(`${this.API_URL}/auth/logout`, {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken })
        });
      }
    } catch (error) {
      console.warn('Logout API failed:', error);
    } finally {
      this.clearAuth();
      this.notifyListeners();
      return { success: true, message: 'Đăng xuất thành công' };
    }
  }

  // === USER INFO ===
  async fetchUserInfo() {
    try {
      const response = await this.makeAuthRequest(`${this.API_URL}/users/myInfo`);
      if (!response?.ok) return null;

      const data = await response.json();
      if (data.code !== 1000) return null;

      const user = data.result;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        ten: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        sdt: user.phoneNumber || '',
        roles: user.roles || [],
        isAdmin: user.roles?.some(r => r.name === 'ADMIN') || false,
        permissions: this.extractPermissions(user.roles)
      };
    } catch (error) {
      console.error('Fetch user info error:', error);
      return null;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await this.makeAuthRequest(`${this.API_URL}/users/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          firstName: userData.firstName || userData.ten?.split(' ')[0] || '',
          lastName: userData.lastName || userData.ten?.split(' ').slice(1).join(' ') || '',
          phoneNumber: userData.sdt || userData.phoneNumber || ''
        })
      });

      if (response?.ok) {
        const updatedUser = await this.fetchUserInfo();
        if (updatedUser) {
          this.currentUser = updatedUser;
          this.saveToStorage();
          this.notifyListeners();
        }
        return { success: true, message: 'Cập nhật thành công' };
      }
      
      return { success: false, message: 'Cập nhật thất bại' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Lỗi cập nhật thông tin' };
    }
  }

  // === TOKEN MANAGEMENT ===
  async makeAuthRequest(url, options = {}) {
    if (!this.accessToken) return null;

    let response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Auto refresh on 401
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
      }
    }

    return response;
  }

  async refreshAccessToken() {
    if (!this.refreshToken) return false;
    
    try {
      const response = await fetch(`${this.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          this.setTokens(data.result.accessToken, data.result.refreshToken);
          this.saveToStorage();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // === VALIDATION ===
  validateRegisterData(data) {
    const errors = [];

    // Username validation - theo backend requirement
    if (!data.username?.trim()) {
      errors.push('Vui lòng nhập tên đăng nhập');
    } else {
      const username = data.username.trim();
      if (username.length < 3) {
        errors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
      } else if (username.length > 50) {
        errors.push('Tên đăng nhập không được quá 50 ký tự');
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
      }
    }

    // Email validation
    if (!data.email?.trim()) {
      errors.push('Vui lòng nhập email');
    } else {
      const email = data.email.trim();
      if (email.length > 100) {
        errors.push('Email không được quá 100 ký tự');
      } else if (!this.isValidEmail(email)) {
        errors.push('Email không đúng định dạng');
      }
    }

    // Password validation - theo backend @ValidPassword
    if (!data.password) {
      errors.push('Vui lòng nhập mật khẩu');
    } else {
      const password = data.password;
      if (password.length < 8) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
      } else {
        // Check backend password requirements
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);
        
        if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
          errors.push('Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&)');
        }
      }
    }

    // Confirm password
    if (data.password !== data.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    // Optional fields validation
    if (data.firstName && data.firstName.trim().length > 50) {
      errors.push('Họ không được quá 50 ký tự');
    }

    if (data.lastName && data.lastName.trim().length > 50) {
      errors.push('Tên không được quá 50 ký tự');
    }

    // Phone validation - theo backend pattern
    if (data.phoneNumber && data.phoneNumber.trim()) {
      const phone = data.phoneNumber.trim();
      if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
        errors.push('Số điện thoại không đúng định dạng (10-15 số)');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // === UTILITIES ===
  getErrorMessage(message, loginType) {
    if (message?.includes('not found') || message?.includes('not existed')) {
      return loginType === 'email' ? 'Email không tồn tại' : 'Tên đăng nhập không tồn tại';
    }
    if (message?.includes('password') || message?.includes('credentials')) {
      return 'Mật khẩu không chính xác';
    }
    return message || 'Đăng nhập thất bại';
  }

  extractPermissions(roles) {
    return roles?.flatMap(role => role.permissions?.map(p => p.name) || []) || [];
  }

  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  clearAuth() {
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.clearStorage();
  }

  // === STORAGE ===
  initFromStorage() {
    try {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Init from storage error:', error);
      this.clearAuth();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('accessToken', this.accessToken || '');
      localStorage.setItem('refreshToken', this.refreshToken || '');
    } catch (error) {
      console.error('Save to storage error:', error);
    }
  }

  clearStorage() {
    ['currentUser', 'accessToken', 'refreshToken'].forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // === STATE MANAGEMENT ===
  addAuthStateListener(listener) {
    this.listeners.push(listener);
    return () => this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners() {
    const authState = {
      isAuthenticated: this.isUserAuthenticated(),
      user: this.currentUser
    };
    this.listeners.forEach(listener => {
      try { listener(authState); } catch (e) { console.error('Listener error:', e); }
    });
  }

  // === PUBLIC API ===
  isUserAuthenticated() {
    return !!(this.accessToken && this.currentUser);
  }

  getCurrentUser() { return this.currentUser; }
  isAdmin() { return this.currentUser?.isAdmin === true; }
  hasRole(role) { return this.currentUser?.roles?.some(r => r.name === role) || false; }
  hasPermission(perm) { return this.currentUser?.permissions?.includes(perm) || false; }
  
  getAuthHeaders() {
    return this.accessToken ? {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    } : { 'Content-Type': 'application/json' };
  }
}

export default new AuthService();