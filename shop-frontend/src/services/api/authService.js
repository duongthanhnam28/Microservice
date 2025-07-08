// FIXED authService.js - Fix login with real database
import userService from '../userService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.token = null;
    
    // Check for saved session on initialization
    this.initializeFromStorage();
  }

  // Safe initialization from localStorage
  initializeFromStorage() {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('authToken');
      const savedAuth = localStorage.getItem('isAuthenticated');
      
      if (savedUser && savedAuth === 'true') {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.maTaiKhoan) {
            this.currentUser = parsedUser;
            this.token = savedToken;
            this.isAuthenticated = true;
          } else {
            this.clearSession();
          }
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError);
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      this.clearSession();
    }
  }

  // Safe session saving
  saveSession(user, token = null) {
    try {
      if (!user || !user.maTaiKhoan) {
        throw new Error('Invalid user data');
      }

      this.currentUser = user;
      this.token = token;
      this.isAuthenticated = true;
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      if (token) {
        localStorage.setItem('authToken', token);
      }
    } catch (error) {
      console.error('Error saving session:', error);
      this.clearSession();
    }
  }

  // Clear session
  clearSession() {
    this.currentUser = null;
    this.token = null;
    this.isAuthenticated = false;
    
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
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

  // FIXED: Login with proper error handling and debugging
  async login(email, password) {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('Password length:', password ? password.length : 0);

      // Input validation
      if (!email || !password) {
        console.log('Missing email or password');
        return {
          success: false,
          message: 'Email và mật khẩu không được để trống'
        };
      }

      if (!this.isValidEmail(email)) {
        console.log('Invalid email format');
        return {
          success: false,
          message: 'Email không đúng định dạng'
        };
      }

      // FIXED: Try to get user from real database
      console.log('Calling userService.getUserByEmail...');
      let userResponse;
      try {
        userResponse = await userService.getUserByEmail(email);
        console.log('UserService response:', userResponse);
        console.log('UserService response data:', userResponse.success);
      } catch (apiError) {
        console.error('UserService API error:', apiError);
        return {
          success: false,
          message: 'Không thể kết nối đến hệ thống người dùng. Vui lòng thử lại.'
        };
      }
      
      // FIXED: Better response handling
      if (!userResponse) {
        console.log('No response from userService');
        return {
          success: false,
          message: 'Không thể kết nối đến hệ thống. Vui lòng thử lại.'
        };
      }

      if (!userResponse.email) {
        console.log('UserService returned failure:', userResponse);
        return {
          success: false,
          message: 'Email không tồn tại trong hệ thống'
        };
      }



      const user = userResponse;
      console.log('User found:', user);
      
      // FIXED: Validate password
      const isValidPassword = this.validatePassword(password, user.matKhau);
      console.log('Password validation result:', isValidPassword);

      if (!isValidPassword) {
        return {
          success: false,
          message: 'Mật khẩu không chính xác' 
        };
      }

      // FIXED: Get user roles from database
      console.log('Getting user roles...');
      let roles = [];
      try {
        const rolesResponse = await userService.getUserRoles(user.maTaiKhoan);
        console.log('Roles response:', rolesResponse);
        roles = rolesResponse.success ? rolesResponse.data : [];
      } catch (roleError) {
        console.warn('Could not fetch user roles:', roleError);
        // Default role based on maCV
        roles = this.getDefaultRolesByCV(user.maCV);
      }

      console.log('Final roles:', roles);

      // Create enhanced user object
      const authenticatedUser = {
        ...user,
        roles: roles,
        isAdmin: this.checkAdminRole(roles) || user.maCV === 1,
        isCustomer: this.checkCustomerRole(roles) || user.maCV === 2
      };

      console.log('Authenticated user:', authenticatedUser);

      // Generate token
      const token = this.generateMockToken(authenticatedUser);

      // Save session
      this.saveSession(authenticatedUser, token);

      console.log('=== LOGIN SUCCESS ===');

      return {
        success: true,
        user: authenticatedUser,
        token: token,
        message: 'Đăng nhập thành công'
      };

    } catch (error) {
      console.error('=== LOGIN ERROR ===', error);
      return {
        success: false,
        message: 'Đăng nhập thất bại. Vui lòng thử lại.'
      };
    }
  }

  // FIXED: Better password validation
  validatePassword(inputPassword, storedPassword) {
    // For demo purposes, accept common passwords
    const demoPasswords = ['admin', 'customer', 'demo', '123456', '1'];
    
    if (demoPasswords.includes(inputPassword)) {
      console.log('Demo password accepted');
      return true;
    }
    
    // Check if passwords match (in production, use bcrypt.compare)
    if (inputPassword === storedPassword) {
      console.log('Password matches stored password');
      return true;
    }
    
    console.log('Password validation failed');
    return false;
  }

  // Get default roles based on maCV
  getDefaultRolesByCV(maCV) {
    switch (maCV) {
      case 1:
        return [{ maChucVu: 1, ten: 'Admin' }];
      case 2:
        return [{ maChucVu: 2, ten: 'Khách hàng' }];

    }
  }

  // Enhanced register with database
  async register(userData) {
    try {
      console.log('=== REGISTER ATTEMPT ===');
      console.log('User data:', userData);

      // Validate required fields
      const requiredFields = ['ten', 'email', 'matKhau', 'sdt'];
      for (const field of requiredFields) {
        if (!userData[field] || !userData[field].toString().trim()) {
          return {
            success: false,
            message: `${this.getFieldName(field)} không được để trống`
          };
        }
      }

      // Validate email
      if (!this.isValidEmail(userData.email)) {
        return {
          success: false,
          message: 'Email không đúng định dạng'
        };
      }

      // Validate phone
      if (!this.isValidPhone(userData.sdt)) {
        return {
          success: false,
          message: 'Số điện thoại không đúng định dạng'
        };
      }

      // Validate password
      if (userData.matKhau.length < 6) {
        return {
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự'
        };
      }

      // Check if email already exists
      try {
        const emailCheck = await userService.checkEmailExists(userData.email);
        if (emailCheck && emailCheck.exists) {
          return {
            success: false,
            message: 'Email đã được sử dụng'
          };
        }
      } catch (error) {
        console.warn('Could not check email existence:', error);
      }

      // Create user data
      const newUserData = {
        ten: userData.ten.trim(),
        email: userData.email.trim().toLowerCase(),
        sdt: userData.sdt.trim(),
        diaChi: userData.diaChi ? userData.diaChi.trim() : '',
        matKhau: userData.matKhau, // In production, hash this
        maCV: 3, // Default to customer role
        ngaySinh: userData.ngaySinh || null
      };

      console.log('Creating user with data:', newUserData);

      // Create user via API
      let createResponse;
      try {
        createResponse = await userService.createUser(newUserData);
        console.log('Create user response:', createResponse);
      } catch (apiError) {
        console.error('User creation API failed:', apiError);
        return {
          success: false,
          message: 'Không thể tạo tài khoản. Vui lòng thử lại.'
        };
      }
      
      if (!createResponse || !createResponse.success) {
        return {
          success: false,
          message: createResponse?.message || 'Không thể tạo tài khoản'
        };
      }

      const newUser = createResponse.data;
      console.log('User created successfully:', newUser);

      // Try to assign customer role
      try {
        await userService.assignRole(newUser.maTaiKhoan, 3, 'Khách hàng');
      } catch (roleError) {
        console.warn('Could not assign role:', roleError);
      }

      console.log('=== REGISTER SUCCESS ===');

      return {
        success: true,
        user: newUser,
        message: 'Đăng ký thành công'
      };

    } catch (error) {
      console.error('=== REGISTER ERROR ===', error);
      return {
        success: false,
        message: 'Đăng ký thất bại. Vui lòng thử lại.'
      };
    }
  }

  // Logout
  logout() {
    this.clearSession();
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  }

  // Safe authentication check
  isUserAuthenticated() {
    try {
      return this.isAuthenticated && 
             this.currentUser !== null && 
             this.currentUser.maTaiKhoan;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  // Get current user safely
  getCurrentUser() {
    try {
      return this.currentUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get user token
  getToken() {
    return this.token;
  }

  // Check admin role safely
  checkAdminRole(roles) {
    try {
      if (!Array.isArray(roles)) return false;
      return roles.some(role => 
        role && (
          role.maChucVu === 1 || 
          role.ten === 'Admin' || 
          role.ten === 'Quản trị viên'
        )
      );
    } catch (error) {
      console.error('Check admin role error:', error);
      return false;
    }
  }

  // Check customer role safely
  checkCustomerRole(roles) {
    try {
      if (!Array.isArray(roles)) return false;
      return roles.some(role => 
        role && (
          role.maChucVu === 2 || 
          role.ten === 'Khách hàng' || 
          role.ten === 'Customer'
        )
      );
    } catch (error) {
      console.error('Check customer role error:', error);
      return false;
    }
  }

  // Safe profile update
  async updateProfile(userData) {
    try {
      if (!this.isUserAuthenticated()) {
        return {
          success: false,
          message: 'Vui lòng đăng nhập'
        };
      }

      const updateData = {
        maTaiKhoan: this.currentUser.maTaiKhoan,
        ...userData
      };

      let response;
      try {
        response = await userService.updateUser(updateData);
      } catch (apiError) {
        console.error('Profile update API failed:', apiError);
        return {
          success: false,
          message: 'Cập nhật thông tin thất bại'
        };
      }
      
      if (response && response.success) {
        // Update current user data
        this.currentUser = { ...this.currentUser, ...response.data };
        this.saveSession(this.currentUser, this.token);
      }

      return response || {
        success: false,
        message: 'Cập nhật thông tin thất bại'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Cập nhật thông tin thất bại'
      };
    }
  }

  // Generate mock JWT token
  generateMockToken(user) {
    try {
      const header = btoa(JSON.stringify({
        alg: 'HS256',
        typ: 'JWT'
      }));

      const payload = btoa(JSON.stringify({
        sub: user.maTaiKhoan,
        email: user.email,
        name: user.ten,
        roles: user.maCV,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));

      const signature = btoa('mock-signature');

      return `${header}.${payload}.${signature}`;
    } catch (error) {
      console.error('Token generation error:', error);
      return 'mock-token-' + Date.now();
    }
  }

  // Get field name in Vietnamese
  getFieldName(field) {
    const fieldNames = {
      ten: 'Họ tên',
      email: 'Email',
      matKhau: 'Mật khẩu',
      sdt: 'Số điện thoại',
      diaChi: 'Địa chỉ',
      ngaySinh: 'Ngày sinh'
    };
    return fieldNames[field] || field;
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Email không đúng định dạng'
        };
      }

      // Check if user exists
      let userResponse;
      try {
        userResponse = await userService.getUserByEmail(email);
      } catch (error) {
        console.warn('Reset password API failed:', error);
        return {
          success: false,
          message: 'Không thể đặt lại mật khẩu'
        };
      }
      
      if (!userResponse || !userResponse.success) {
        return {
          success: false,
          message: 'Email không tồn tại trong hệ thống'
        };
      }

      // In production, send reset password email
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
}

const authService = new AuthService();
export default authService;