// FIXED apiService.js - Kết nối thực tế với backend APIs
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
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
      console.error(`API error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Products API
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