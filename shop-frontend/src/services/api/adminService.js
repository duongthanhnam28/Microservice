// src/services/api/adminService.js
import authService from './authService';

class AdminService {
  constructor() {
    this.API_URL = 'http://localhost:9002';
  }

  // Lấy tất cả user
  async getAllUsers() {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${this.API_URL}/users/admin/allUser`
      );
      
      if (!response) return { success: false };
      
      const data = await response.json();
      return {
        success: data.code === 1000,
        data: data.result,
        message: data.message
      };
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, message: 'Không thể tải danh sách user' };
    }
  }

  // Lấy thông tin một user
  async getUser(userId) {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${this.API_URL}/users/admin/${userId}`
      );
      
      if (!response) return { success: false };
      
      const data = await response.json();
      return {
        success: data.code === 1000,
        data: data.result,
        message: data.message
      };
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: 'Không thể tải thông tin user' };
    }
  }

  // Tạo user với role
  async createUserWithRoles(userData) {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${this.API_URL}/users/admin/create-user-with-roles`,
        {
          method: 'POST',
          body: JSON.stringify(userData)
        }
      );
      
      if (!response) return { success: false };
      
      const data = await response.json();
      return {
        success: data.code === 1000,
        data: data.result,
        message: data.message
      };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, message: 'Không thể tạo user' };
    }
  }

  // Cấp role cho user
  async addRoleToUser(userId, roleName) {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${this.API_URL}/users/admin/addRoleToUser`,
        {
          method: 'POST',
          body: JSON.stringify({ userId, roleName })
        }
      );
      
      if (!response) return { success: false };
      
      const data = await response.json();
      return {
        success: data.code === 1000,
        data: data.result,
        message: data.message
      };
    } catch (error) {
      console.error('Add role error:', error);
      return { success: false, message: 'Không thể cấp role' };
    }
  }

  // Xóa role khỏi user
  async removeRoleFromUser(userId, roleName) {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${this.API_URL}/users/admin/removeRole`,
        {
          method: 'DELETE',
          body: JSON.stringify({ userId, roleName })
        }
      );
      
      if (!response) return { success: false };
      
      const data = await response.json();
      return {
        success: data.code === 1000,
        data: data.result,
        message: data.message
      };
    } catch (error) {
      console.error('Remove role error:', error);
      return { success: false, message: 'Không thể xóa role' };
    }
  }
}

export default new AdminService();