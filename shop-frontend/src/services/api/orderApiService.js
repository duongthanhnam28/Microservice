// FIXED orderApiService.js - Thêm method getAllOrders
const ORDER_API_BASE_URL = 'http://localhost:8000/api/v1/orders';

class OrderApiService {
  async request(endpoint = '', options = {}) {
    const url = `${ORDER_API_BASE_URL}${endpoint}`;
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
      console.error(`Order API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async createOrder(orderData) {
    return await this.request('', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
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

  // FIXED: Thêm method getAllOrders cho admin
  async getAllOrders() {
    return await this.request();
  }
}

const orderApiService = new OrderApiService();
export default orderApiService;