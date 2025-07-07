// src/services/userService.js - User Service API Client
const USER_API_BASE_URL = 'http://localhost:9002/api/v1/users';

class UserService {
  async request(endpoint = '', options = {}) {
    const url = `${USER_API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`User API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ============ QUERY OPERATIONS ============

  // Get all users with pagination
  async getAllUsers(page = 0, size = 10, sortBy = 'maTaiKhoan', sortDir = 'asc') {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    return await this.request(`/all?${queryParams}`);
  }

  // Get user by ID
  async getUserById(maTaiKhoan) {
    return await this.request(`/${maTaiKhoan}`);
  }

  // Get user by email
  async getUserByEmail(email) {
    return await this.request(`/email/${encodeURIComponent(email)}`);
  }

  // Get users by role
  async getUsersByRole(maChucVu) {
    return await this.request(`/role/${maChucVu}`);
  }

  // Search users
  async searchUsers(keyword) {
    const queryParams = new URLSearchParams({ keyword });
    return await this.request(`/search?${queryParams}`);
  }

  // Advanced search
  async searchUsersAdvanced(criteria) {
    const queryParams = new URLSearchParams();
    
    if (criteria.name) queryParams.append('name', criteria.name);
    if (criteria.email) queryParams.append('email', criteria.email);
    if (criteria.phone) queryParams.append('phone', criteria.phone);
    if (criteria.address) queryParams.append('address', criteria.address);
    if (criteria.roleId) queryParams.append('roleId', criteria.roleId);

    return await this.request(`/search/advanced?${queryParams}`);
  }

  // Get user roles
  async getUserRoles(maTaiKhoan) {
    return await this.request(`/${maTaiKhoan}/roles`);
  }

  // Check if email exists
  async checkEmailExists(email) {
    return await this.request(`/check-email/${encodeURIComponent(email)}`);
  }

  // Check if phone exists
  async checkPhoneExists(phone) {
    return await this.request(`/check-phone/${encodeURIComponent(phone)}`);
  }

  // Get all roles
  async getAllRoles() {
    return await this.request('/roles/all');
  }

  // Get role by ID
  async getRoleById(maCV) {
    return await this.request(`/roles/${maCV}`);
  }

  // Search roles
  async searchRoles(keyword) {
    const queryParams = new URLSearchParams({ keyword });
    return await this.request(`/roles/search?${queryParams}`);
  }

  // Get statistics
  async getStatistics() {
    return await this.request('/statistics');
  }

  // ============ COMMAND OPERATIONS ============

  // Create user
  async createUser(userData) {
    return await this.request('/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Update user
  async updateUser(userData) {
    return await this.request('/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Delete user
  async deleteUser(maTaiKhoan) {
    return await this.request(`/delete/${maTaiKhoan}`, {
      method: 'DELETE',
    });
  }

  // Assign role to user
  async assignRole(maTaiKhoan, maChucVu, ten = '') {
    return await this.request('/assign-role', {
      method: 'POST',
      body: JSON.stringify({
        maTaiKhoan,
        maChucVu,
        ten
      }),
    });
  }

  // Remove role from user
  async removeRole(maTaiKhoan, maChucVu) {
    return await this.request('/remove-role', {
      method: 'DELETE',
      body: JSON.stringify({
        maTaiKhoan,
        maChucVu
      }),
    });
  }

  // ============ UTILITY METHODS ============

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    return emailRegex.test(email);
  }

  // Validate Vietnamese phone number
  isValidPhone(phone) {
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    return phoneRegex.test(phone);
  }

  // Create guest user for checkout
  async createGuestUser(guestInfo) {
    const userData = {
      ten: guestInfo.ten,
      email: guestInfo.email,
      sdt: guestInfo.sdt,
      diaChi: guestInfo.diaChi,
      matKhau: 'guest_' + Date.now(), // Temporary password for guest
      maCV: 3, // Guest/Customer role
      ngaySinh: null
    };

    try {
      const response = await this.createUser(userData);
      return response;
    } catch (error) {
      if (error.message.includes('Email đã tồn tại')) {
        // If email exists, try to get existing user
        const existingUser = await this.getUserByEmail(guestInfo.email);
        if (existingUser.success) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  // Get or create customer for checkout
  async getOrCreateCustomer(customerInfo) {
    try {
      // First check if email exists
      const emailCheck = await this.checkEmailExists(customerInfo.email);
      
      if (emailCheck.exists) {
        // Get existing user
        const userResponse = await this.getUserByEmail(customerInfo.email);
        if (userResponse.success) {
          return userResponse.data;
        }
      }
      
      // Create new customer
      const newUserResponse = await this.createGuestUser(customerInfo);
      if (newUserResponse.success) {
        return newUserResponse.data;
      }
      
      throw new Error('Could not create or retrieve customer');
    } catch (error) {
      console.error('Error in getOrCreateCustomer:', error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;