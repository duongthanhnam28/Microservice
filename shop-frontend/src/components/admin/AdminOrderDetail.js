// FIXED AdminOrderDetail.js - Dữ liệu thực, code đơn giản
import React, { useEffect, useState } from "react";
import orderApiService from "../../services/api/orderApiService";
import apiService from "../../services/api/apiService";
import { notificationManager } from '../layout/Notification/Notification';

const AdminOrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderData = await orderApiService.getOrderById(orderId);
      
      if (!orderData) {
        throw new Error('Đơn hàng không tồn tại');
      }

      setOrder(orderData);

      // Load product details if order has items
      if (orderData.items && orderData.items.length > 0) {
        const productDetailsMap = {};
        
        for (const item of orderData.items) {
          try {
            const product = await apiService.getProductById(item.productId);
            if (product) {
              productDetailsMap[item.productId] = {
                ...product,
                orderQuantity: item.quantity,
                orderPrice: product.giaTien
              };
            }
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
          }
        }
        
        setProductDetails(productDetailsMap);
      }
      
    } catch (error) {
      console.error('Error fetching order detail:', error);
      setError('Không thể tải chi tiết đơn hàng');
      notificationManager.error('Không thể tải chi tiết đơn hàng');
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

  const getStatusColor = (status) => {
    const colorMap = {
      0: '#ef4444',
      1: '#f59e0b',
      2: '#3b82f6',
      3: '#10b981'
    };
    
    if (![0, 1, 2, 3].includes(Number(status))) {
      return '#dc2626';
    }
    
    return colorMap[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: 'Đã hủy',
      1: 'Chờ xác nhận',
      2: 'Đã xác nhận',
      3: 'Đã giao hàng'
    };
    
    if (![0, 1, 2, 3].includes(Number(status))) {
      return `Lỗi status: ${status}`;
    }
    
    return statusMap[status] || `Status ${status}`;
  };

  const getCustomerInfo = (userId) => {
    return {
      name: `User ${userId}`,
      email: `user${userId}@shop.com`,
      phone: 'N/A',
      address: 'N/A'
    };
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      
      await orderApiService.updateOrderStatus(orderId, newStatus);
      
      setOrder(prev => ({
        ...prev,
        status: newStatus
      }));

      notificationManager.success(`Cập nhật trạng thái thành công: ${getStatusText(newStatus)}`);
      
    } catch (error) {
      console.error('Error updating order status:', error);
      notificationManager.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-order-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-order-detail">
        <div className="error-container">
          <h3>❌ Lỗi</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={fetchOrderDetail} className="btn-primary">
              🔄 Thử lại
            </button>
            <button onClick={onBack} className="btn-secondary">
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-detail">
        <div className="not-found-container">
          <h3>🔍 Không tìm thấy đơn hàng</h3>
          <p>Đơn hàng với ID "{orderId}" không tồn tại.</p>
          <button onClick={onBack} className="btn-secondary">
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 3;
  const customerInfo = getCustomerInfo(order.userId);

  return (
    <div className="admin-order-detail">
      <div className="detail-header">
        <div className="header-left">
          <button onClick={onBack} className="back-btn">
            ← Quay lại
          </button>
          <h2>📋 Chi tiết đơn hàng #{order.orderId}</h2>
        </div>
        <div className="header-right">
          <span 
            className="status-badge"
            style={{ 
              backgroundColor: getStatusColor(order.status),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '600'
            }}
          >
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-grid">
          {/* Customer Info */}
          <div className="detail-section">
            <h3>👤 Thông tin khách hàng</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Mã khách hàng:</label>
                <span>#{order.userId}</span>
              </div>
              <div className="info-item">
                <label>Họ tên:</label>
                <span>{customerInfo.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{customerInfo.email}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{customerInfo.phone}</span>
              </div>
              <div className="info-item full-width">
                <label>Địa chỉ giao hàng:</label>
                <span>{customerInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="detail-section">
            <h3>📦 Thông tin đơn hàng</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Mã đơn hàng:</label>
                <span>#{order.orderId}</span>
              </div>
              <div className="info-item">
                <label>Ngày đặt:</label>
                <span>{formatDate(order.createdDate)}</span>
              </div>
              <div className="info-item">
                <label>Tổng tiền:</label>
                <span className="total-amount">{formatPrice(order.total)}</span>
              </div>
              <div className="info-item">
                <label>Trạng thái:</label>
                <select 
                  value={order.status || 1} 
                  onChange={(e) => handleStatusUpdate(parseInt(e.target.value))}
                  disabled={updating || isDelivered}
                  className="status-select"
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    opacity: isDelivered ? 0.7 : 1,
                    cursor: isDelivered ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value={1}>Chờ xác nhận</option>
                  <option value={2}>Đã xác nhận</option>
                  <option value={3}>Đã giao hàng</option>
                  <option value={0}>Đã hủy</option>
                </select>
                {isDelivered && (
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    ✅ Đơn hàng đã hoàn thành
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="detail-section full-width">
          <h3>🛒 Sản phẩm trong đơn hàng</h3>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => {
                    const product = productDetails[item.productId];
                    const unitPrice = product?.giaTien || 0;
                    const totalPrice = unitPrice * item.quantity;
                    
                    return (
                      <tr key={item.productId || index}>
                        <td>#{item.productId}</td>
                        <td>
                          {product?.tenSP || `Sản phẩm ${item.productId}`}
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{formatPrice(unitPrice)}</td>
                        <td className="text-right font-bold">
                          {formatPrice(totalPrice)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Không có thông tin sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="4"><strong>Tổng cộng:</strong></td>
                  <td className="text-right"><strong>{formatPrice(order.total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="detail-actions">
          <button onClick={onBack} className="btn-secondary">
            ← Quay lại danh sách
          </button>
          
          {!isDelivered && (
            <div className="action-group">
              {order.status === 1 && (
                <button 
                  onClick={() => handleStatusUpdate(2)}
                  className="btn-primary"
                  disabled={updating}
                >
                  ✅ Xác nhận đơn hàng
                </button>
              )}
              
              {order.status === 2 && (
                <button 
                  onClick={() => handleStatusUpdate(3)}
                  className="btn-success"
                  disabled={updating}
                >
                  📦 Đã giao hàng
                </button>
              )}
              
              {[1, 2].includes(order.status) && (
                <button 
                  onClick={() => handleStatusUpdate(0)}
                  className="btn-danger"
                  disabled={updating}
                >
                  ❌ Hủy đơn hàng
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-order-detail {
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #e5e7eb;
        }

        .detail-header h2 {
          margin: 0;
          color: #1f2937;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .detail-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .detail-section.full-width {
          grid-column: 1 / -1;
        }

        .detail-section h3 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1.125rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-item label {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .info-item span {
          color: #374151;
          font-size: 0.95rem;
        }

        .total-amount {
          font-weight: 700;
          font-size: 1.125rem;
          color: #ef4444;
        }

        .items-table {
          overflow-x: auto;
        }

        .items-table table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .items-table th {
          background: #f3f4f6;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .items-table td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #6b7280;
        }

        .items-table tbody tr:hover {
          background: #f9fafb;
        }

        .total-row {
          background: #f3f4f6;
          font-weight: 600;
        }

        .text-center {
          text-align: center;
        }

        .text-right {
          text-align: right;
        }

        .font-bold {
          font-weight: 600;
        }

        .detail-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .action-group {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-secondary, .btn-success, .btn-danger {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .loading-container, .error-container, .not-found-container {
          text-align: center;
          padding: 3rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .detail-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .action-group {
            flex-wrap: wrap;
            justify-content: center;
          }

          .admin-order-detail {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrderDetail;