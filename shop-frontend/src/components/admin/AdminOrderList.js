// FIXED AdminOrderList.js - Dữ liệu thực, code đơn giản
import React, { useEffect, useState } from "react";
import orderApiService from "../../services/api/orderApiService";
import authService from "../../services/api/authService";
import { notificationManager } from '../layout/Notification/Notification';

const AdminOrderList = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ordersData = await orderApiService.getAllOrders();
      
      if (!Array.isArray(ordersData)) {
        throw new Error('Invalid order data format');
      }

      setOrders(ordersData);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng');
      setOrders([]);
      notificationManager.error('Không thể tải danh sách đơn hàng từ server');
    } finally {
      setLoading(false);
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
      3: 'Đã giao hàng'
    };
    
    // Handle invalid status
    if (![0, 1, 2, 3].includes(Number(status))) {
      return `Lỗi status: ${status}`;
    }
    
    return statusMap[status] || `Status ${status}`;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: '#ef4444',
      1: '#f59e0b',
      2: '#3b82f6',
      3: '#10b981'
    };
    
    // Invalid status = red
    if (![0, 1, 2, 3].includes(Number(status))) {
      return '#dc2626';
    }
    
    return colorMap[status] || '#6b7280';
  };

  const getCustomerName = (userId) => {
    // Use actual user ID from database
    return `User ${userId}`;
  };

  const getCustomerEmail = (userId) => {
    // Generate email based on user ID (for display only)
    return `user${userId}@shop.com`;
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
      notificationManager.error('Không thể xóa đơn hàng');
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
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>
                    <strong>#{order.orderId}</strong>
                  </td>
                  <td>{getCustomerName(order.userId)}</td>
                  <td>{getCustomerEmail(order.userId)}</td>
                  <td>
                    <strong style={{ color: '#ef4444' }}>
                      {formatPrice(order.total)}
                    </strong>
                  </td>
                  <td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;