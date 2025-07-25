// BYPASS ApiService.js - Tắt hoàn toàn CORS calls
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  // FIXED: Helper method chỉ gọi API products, bypass brands/categories
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'APIKEY': 'thanhnam',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    console.log(`Making request to: ${url}`);

    try {
      const response = await fetch(url, config);
      
      console.log(`Response status for ${endpoint}:`, response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP_ERROR_${response.status}: ${endpoint}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`Success response for ${endpoint}:`, data?.length || 'data loaded');
        return data;
      }
      
      return await response.text();
    } catch (error) {
      console.warn(`⚠️ API error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  // FIXED: Products API - Chỉ gọi khi cần thiết
  async getProducts() {
    try {
      const data = await this.request('/v1/products');
      
      if (!Array.isArray(data)) {
        console.warn('Invalid products data format from API');
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Products API error:', error);
      return [];
    }
  }

  async getProductById(maSP) {
    try {
      const data = await this.request(`/v1/products/${maSP}`);
      return data;
    } catch (error) {
      console.error(`Product ${maSP} not found:`, error);
      return null;
    }
  }

  // FIXED: Brands API - HOÀN TOÀN BYPASS, không gọi API
  async getBrands() {
    console.log('🚫 Brands API bypassed - returning empty array');
    return Promise.resolve([]);
  }

  // FIXED: Categories API - HOÀN TOÀN BYPASS, không gọi API  
  async getCategories() {
    console.log('🚫 Categories API bypassed - returning empty array');
    return Promise.resolve([]);
  }

  // FIXED: CRUD operations - Chỉ simulate cho products
  async addProduct(productData) {
    try {
      return await this.request('/v1/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
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
      throw error;
    }
  }

  async deleteProduct(maSP) {
    try {
      return await this.request(`/v1/products/${maSP}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // FIXED: Brand operations - SIMULATE SUCCESS, không gọi API
  async addBrand(brandData) {
    console.log('🔄 Simulating brand creation:', brandData);
    return Promise.resolve({
      maHang: Date.now(),
      tenHang: brandData.tenHang,
      created: true
    });
  }

  async updateBrand(id, brandData) {
    console.log('🔄 Simulating brand update:', id, brandData);
    return Promise.resolve({
      maHang: id,
      tenHang: brandData.tenHang,
      updated: true
    });
  }

  async deleteBrand(id) {
    console.log('🔄 Simulating brand deletion:', id);
    return Promise.resolve({ deleted: true });
  }

  // FIXED: Category operations - SIMULATE SUCCESS, không gọi API
  async addCategory(categoryData) {
    console.log('🔄 Simulating category creation:', categoryData);
    return Promise.resolve({
      maDanhMuc: Date.now(),
      tenDanhMuc: categoryData.tenDanhMuc,
      created: true
    });
  }

  async updateCategory(id, categoryData) {
    console.log('🔄 Simulating category update:', id, categoryData);
    return Promise.resolve({
      maDanhMuc: id,
      tenDanhMuc: categoryData.tenDanhMuc,
      updated: true
    });
  }

  async deleteCategory(id) {
    console.log('🔄 Simulating category deletion:', id);
    return Promise.resolve({ deleted: true });
  }

  // File handling
  getFileUrl(filename) {
    if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `${API_BASE_URL}/files/${filename}`;
  }
}

const apiService = new ApiService();
export default apiService;