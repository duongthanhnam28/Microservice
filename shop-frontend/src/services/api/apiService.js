// FIXED apiService.js - Loại bỏ hoàn toàn dữ liệu demo
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'APIKEY': 'thanhnam',
        'Access-Control-Request-Method': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
        ...options.headers,
      },
      credentials: 'include',
      mode: 'cors',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error(`Resource not found: ${endpoint}`);
          case 500:
            throw new Error(`Server error: ${endpoint}`);
          case 403:
            throw new Error(`Access forbidden: ${endpoint}`);
          default:
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // FIXED: Products API - Không có fallback data
  async getProducts() {
    try {
      const data = await this.request('/v1/products');
      
      // Chỉ trả về data thật từ API, không có fallback
      if (!Array.isArray(data)) {
        console.warn('Invalid products data format from API');
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Products API error:', error);
      // FIXED: Không trả về demo data, trả về array rỗng
      return [];
    }
  }

  async getProductById(maSP) {
    try {
      const data = await this.request(`/v1/products/${maSP}`);
      return data;
    } catch (error) {
      console.error(`Product ${maSP} not found:`, error);
      // FIXED: Không trả về demo data
      return null;
    }
  }

  async addProduct(productData) {
    try {
      return await this.request('/v1/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error adding product:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  async updateProduct(maSP, productData) {
    try {
      return await this.request(`/v1/products/${maSP}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  async deleteProduct(maSP) {
    try {
      return await this.request(`/v1/products/${maSP}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  // FIXED: Brands API - Không có fallback data
  async getBrands() {
    try {
      const data = await this.request('/v1/brands');
      
      if (!Array.isArray(data)) {
        console.warn('Invalid brands data format from API');
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Brands API error:', error);
      // FIXED: Không trả về demo data
      return [];
    }
  }

  async addBrand(brandData) {
    try {
      return await this.request('/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          tenHang: brandData.tenHang
        }),
      });
    } catch (error) {
      console.error('Error adding brand:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  async updateBrand(id, brandData) {
    try {
      return await this.request(`/v1/brands/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          maHang: id,
          tenHang: brandData.tenHang
        }),
      });
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  async deleteBrand(id) {
    try {
      return await this.request(`/v1/brands/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  // FIXED: Categories API - Không có fallback data
  async getCategories() {
    try {
      const data = await this.request('/v1/categories');
      
      if (!Array.isArray(data)) {
        console.warn('Invalid categories data format from API');
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Categories API error:', error);
      // FIXED: Không trả về demo data
      return [];
    }
  }

  async addCategory(categoryData) {
    try {
      return await this.request('/v1/categories', {
        method: 'POST',
        body: JSON.stringify({
          tenDanhMuc: categoryData.tenDanhMuc
        }),
      });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  async updateCategory(id, categoryData) {
    try {
      return await this.request(`/v1/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          maDanhMuc: id,
          tenDanhMuc: categoryData.tenDanhMuc
        }),
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  async deleteCategory(id) {
    try {
      return await this.request(`/v1/categories/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error; // FIXED: Throw error thay vì simulate success
    }
  }

  // File handling
  getFileUrl(filename) {
    if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `${API_BASE_URL}/files/${filename}`;
  }
}

const apiService = new ApiService();
export default apiService;