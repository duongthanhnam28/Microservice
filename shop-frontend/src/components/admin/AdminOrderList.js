// FIXED AdminOrderList.js - Chỉ hiển thị trạng thái, không cho chọn
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
      
      const ordersData = await orderApiService.getAllOrders();
      
      if (!Array.isArray(ordersData)) {
        throw new Error('Định dạng dữ liệu đơn hàng không hợp lệ');
      }

      if (ordersData.length === 0) {
        console.log('No orders found in database');
        setOrders([]);
        return;
      }
      
      setOrders(ordersData);
      await loadCustomerInfo(ordersData);
      console.log('Successfully loaded orders from API:', ordersData.length);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng: ' + error.message);
      setOrders([]);
      notificationManager.error('Không thể tải danh sách đơn hàng từ server');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerInfo = async (ordersData) => {
    const customerMap = {};
    
    try {
      const userIds = [...new Set(ordersData.map(order => order.userId))];
      
      for (const userId of userIds) {
        if (!userId) continue;
        
        try {
          const userResponse = await userService.getUserById(userId);
          if (userResponse.success && userResponse.data) {
            customerMap[userId] = userResponse.data;
            console.log(`Loaded customer info for user ${userId}`);
          }
        } catch (error) {
          console.warn(`Could not load customer ${userId}:`, error);
          customerMap[userId] = {
            ten: `User ${userId}`,
            email: `user${userId}@demo.com`,
            sdt: 'N/A'
          };
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
      0: 'Đã hủy',
      1: 'Chờ xác nhận',
      2: 'Đã xác nhận', 
      3: 'Đã giao hàng',
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPED': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status || 'Không xác định';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: '#ef4444',
      1: '#f59e0b',
      2: '#3b82f6',
      3: '#10b981',
      'PENDING': '#f59e0b',
      'CONFIRMED': '#3b82f6',
      'SHIPPED': '#8b5cf6',
      'DELIVERED': '#10b981',
      'CANCELLED': '#ef4444'
    };
    return colorMap[status] || '#6b7280';
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
          <h3>📋 Chưa có đơn hàng nào</h3>
          <p>Hệ thống chưa có đơn hàng nào được tạo.</p>
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
                      <strong>#{order.orderId}</strong>
                    </td>
                    <td>{customer.ten || `User ${order.userId}`}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>
                      <strong style={{ color: '#ef4444' }}>
                        {formatPrice(order.total)}
                      </strong>
                    </td>
                    <td>
                      {/* FIXED: CHỈ hiển thị trạng thái, KHÔNG cho chọn */}
                      <span
                        style={{
                          background: getStatusColor(order.status),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}
                      >
                        {getStatusText(order.status)}
                      </span>
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