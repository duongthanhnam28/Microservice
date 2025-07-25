// FIXED AdminOrderList.js - Chỉ sử dụng dữ liệu thực từ API
import React, { useEffect, useState } from "react";
import orderApiService from "../../services/api/orderApiService";
import userService from "../../services/userService";
import { notificationManager } from '../layout/Notification/Notification';

const AdminOrderList = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Thử gọi API lấy tất cả đơn hàng
      const ordersData = await orderApiService.getAllOrders();
      
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
        await loadCustomerInfo(ordersData);
        console.log('Successfully loaded orders from API:', ordersData.length);
      } else {
        throw new Error('Invalid orders data format');
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng: ' + error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load customer information
  const loadCustomerInfo = async (ordersData) => {
    const customerMap = {};
    
    try {
      const userIds = [...new Set(ordersData.map(order => order.userId))];
      
      for (const userId of userIds) {
        try {
          const userResponse = await userService.getUserById(userId);
          if (userResponse.success) {
            customerMap[userId] = userResponse.data;
          }
        } catch (error) {
          console.warn(`Could not load customer ${userId}:`, error);
        }
      }
      
      setCustomerInfo(customerMap);
    } catch (error) {
      console.error('Error loading customer info:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPED': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': '#f59e0b',
      'CONFIRMED': '#3b82f6',
      'SHIPPED': '#8b5cf6',
      'DELIVERED': '#10b981',
      'CANCELLED': '#ef4444'
    };
    return colorMap[status] || '#6b7280';
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderApiService.updateOrderStatus(orderId, newStatus);
      
      setOrders(prev => prev.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      notificationManager.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating order status:', error);
      notificationManager.error('Không thể cập nhật trạng thái đơn hàng: ' + error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      return;
    }

    try {
      await orderApiService.cancelOrder(orderId);
      setOrders(prev => prev.filter(order => order.orderId !== orderId));
      notificationManager.success('Xóa đơn hàng thành công');
    } catch (error) {
      console.error('Error deleting order:', error);
      notificationManager.error('Không thể xóa đơn hàng: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-order-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-order-list">
        <div className="error-container">
          <h3>❌ Lỗi</h3>
          <p>{error}</p>
          <button onClick={fetchOrders} className="btn-primary">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-list">
      <div className="section-header">
        <h2>🧾 Danh sách đơn hàng</h2>
        <div className="header-actions">
          <button onClick={fetchOrders} className="btn-secondary">
            🔄 Làm mới
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-data">
          <p>Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const customer = customerInfo[order.userId] || {};
                return (
                  <tr key={order.orderId}>
                    <td>
                      <strong>{order.orderId}</strong>
                    </td>
                    <td>{customer.ten || `User ${order.userId}`}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>
                      <strong style={{ color: '#ef4444' }}>
                        {formatPrice(order.total)}
                      </strong>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                        style={{
                          background: getStatusColor(order.status),
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="SHIPPED">Đang giao hàng</option>
                        <option value="DELIVERED">Đã giao hàng</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                    <td>{formatDate(order.createdDate)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => onSelectOrder(order.orderId)}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          👁️ Chi tiết
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.orderId)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;