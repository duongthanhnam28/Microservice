// shop-frontend/src/services/api/apiService.js
import authService from './authService';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Lấy auth headers từ authService
    const authHeaders = authService.getAuthHeaders();
    
    const config = {
      method: 'GET',
      headers: {
        ...authHeaders, // Thêm Bearer token nếu có
        'Accept': 'application/json',
        'APIKEY': 'thanhnam',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include',
      ...options,
    };

    console.log(`Making request to: ${url}`);

    try {
      const response = await fetch(url, config);
      
      // Xử lý 401 Unauthorized - thử refresh token
      if (response.status === 401) {
        console.log('Unauthorized - attempting to refresh token');
        
        const refreshed = await authService.refreshAccessToken();
        if (refreshed) {
          // Retry request với token mới
          config.headers = {
            ...authService.getAuthHeaders(),
            'Accept': 'application/json',
            'APIKEY': 'thanhnam',
            ...options.headers,
          };
          
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP_ERROR_${retryResponse.status}: ${endpoint}`);
          }
          
          return await this.handleResponse(retryResponse);
        } else {
          // Refresh failed - user cần login lại
          authService.clearTokens();
          authService.notifyListeners();
          throw new Error('UNAUTHORIZED');
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP_ERROR_${response.status}: ${endpoint}`);
      }
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  }

  // Products API - KHÔNG CẦN CHECK QUYỀN
  async getProducts() {
    const data = await this.request('/v1/products');
    return Array.isArray(data) ? data : [];
  }

  async getProductById(maSP) {
    return await this.request(`/v1/products/${maSP}`);
  }

  async addProduct(productData) {
    return await this.request('/v1/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(maSP, productData) {
    return await this.request(`/v1/products/${maSP}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(maSP) {
    return await this.request(`/v1/products/${maSP}`, {
      method: 'DELETE',
    });
  }

  // Brands API
  async getBrands() {
    const data = await this.request('/v1/brands');
    return Array.isArray(data) ? data : [];
  }

  async addBrand(brandData) {
    return await this.request('/v1/brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
  }

  async updateBrand(id, brandData) {
    return await this.request(`/v1/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
  }

  async deleteBrand(id) {
    return await this.request(`/v1/brands/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories() {
    const data = await this.request('/v1/categories');
    return Array.isArray(data) ? data : [];
  }

  async addCategory(categoryData) {
    return await this.request('/v1/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return await this.request(`/v1/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return await this.request(`/v1/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // File handling
  getFileUrl(filename) {
    if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `http://localhost:9010/api/files/${filename}`;
  }
}

const apiService = new ApiService();
export default apiService;