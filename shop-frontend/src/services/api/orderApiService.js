import authService from './authService';

const ORDER_API_BASE_URL = 'http://localhost:8000/api/v1/orders';

class OrderApiService {
  async request(endpoint = '', options = {}) {
    const url = `${ORDER_API_BASE_URL}${endpoint}`;
    
    // Lấy auth headers
    const authHeaders = authService.getAuthHeaders();
    
    const config = {
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(url, config);
      
      // Xử lý 401
      if (response.status === 401) {
        const refreshed = await authService.refreshAccessToken();
        if (refreshed) {
          // Retry với token mới
          config.headers = {
            ...authService.getAuthHeaders(),
            ...options.headers,
          };
          
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await this.handleResponse(retryResponse);
        } else {
          authService.clearTokens();
          authService.notifyListeners();
          throw new Error('UNAUTHORIZED');
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Order API Request failed for ${endpoint}:`, error);
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

  // Các methods không cần check quyền
  async createOrder(orderData) {
    return await this.request('', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getAllOrders() {
    return await this.request();
  }

  async cancelOrder(orderId) {
    return await this.request(`/${orderId}`, {
      method: 'DELETE',
    });
  }

  async updateOrderStatus(orderId, status) {
    return await this.request(`/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOrdersByUser(userId) {
    return await this.request(`?userId=${userId}`);
  }

  async getOrderById(orderId) {
    return await this.request(`/${orderId}`);
  }
}

const orderApiService = new OrderApiService();
export default orderApiService;