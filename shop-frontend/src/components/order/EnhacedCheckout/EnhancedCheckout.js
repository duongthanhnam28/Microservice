// FIXED EnhancedCheckout.js - Chỉ cho phép user đã đăng nhập đặt hàng
import React, { useState, useEffect } from 'react';
import orderApiService from '../../../services/api/orderApiService';
import authService from '../../../services/api/authService';
import { notificationManager } from '../../layout/Notification/Notification';

const EnhancedCheckout = ({ cart, onOrderSuccess, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    ten: '',
    email: '',
    sdt: '',
    diaChi: '',
    ghiChu: ''
  });

  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  const shippingMethods = [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', time: '3-5 ngày', fee: 30000 },
    { id: 'express', name: 'Giao hàng nhanh', time: '1-2 ngày', fee: 50000 }
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
    { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: '🏦' }
  ];

  // FIXED: Chỉ cho phép user đã đăng nhập
  useEffect(() => {
    if (!authService.isUserAuthenticated()) {
      notificationManager.error('Vui lòng đăng nhập để đặt hàng');
      if (onClose) onClose();
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      notificationManager.error('Không thể xác định thông tin người dùng');
      if (onClose) onClose();
      return;
    }

    // Load thông tin user đã đăng nhập
    setCustomerInfo({
      ten: currentUser.ten || '',
      email: currentUser.email || '',
      sdt: currentUser.sdt || '',
      diaChi: currentUser.diaChi || '',
      ghiChu: ''
    });
  }, [onClose]);

  // Calculate order summary
  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.giaTien * item.quantity), 0);
    const selectedShipping = shippingMethods.find(m => m.id === shippingMethod);
    const shipping = selectedShipping ? selectedShipping.fee : 0;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;

    setOrderSummary({ subtotal, shipping, tax, total });
  }, [cart, shippingMethod]);

  const validateCustomerInfo = () => {
    const newErrors = {};

    if (!customerInfo.ten.trim()) {
      newErrors.ten = 'Vui lòng nhập họ tên';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!authService.isValidEmail(customerInfo.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!customerInfo.sdt.trim()) {
      newErrors.sdt = 'Vui lòng nhập số điện thoại';
    }

    if (!customerInfo.diaChi.trim()) {
      newErrors.diaChi = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateCustomerInfo()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // FIXED: Chỉ sử dụng user ID thực từ account service
  const handleSubmitOrder = async () => {
    if (submitting) return;

    setSubmitting(true);
    setLoading(true);
    
    try {
      console.log('=== STARTING ORDER SUBMISSION ===');
      
      // FIXED: Kiểm tra user đã đăng nhập
      if (!authService.isUserAuthenticated()) {
        throw new Error('Vui lòng đăng nhập để đặt hàng');
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Không thể xác định thông tin người dùng');
      }

      // Validate cart
      if (!cart || cart.length === 0) {
        throw new Error('Giỏ hàng trống!');
      }

      // Validate customer info
      if (!validateCustomerInfo()) {
        throw new Error('Thông tin khách hàng không hợp lệ');
      }

      // FIXED: Chỉ sử dụng user ID thực
      const customerId = currentUser.id;
      console.log('Using authenticated user ID:', customerId);

      // Create order data với user ID thực
      const orderData = {
        userId: customerId, // Chỉ user ID từ account service
        total: orderSummary.total,
        items: cart.map(item => ({
          productId: item.maSP,
          quantity: item.quantity
        }))
      };

      console.log('Creating order with real user ID:', orderData);

      // FIXED: Gửi order - nếu thất bại thì báo lỗi rõ ràng
      const orderResponse = await orderApiService.createOrder(orderData);
      console.log('✅ Order created successfully:', orderResponse);

      // Update user profile nếu có thay đổi
      try {
        const profileUpdate = {
          ten: customerInfo.ten,
          sdt: customerInfo.sdt,
          diaChi: customerInfo.diaChi
        };
        
        await authService.updateProfile(profileUpdate);
        console.log('User profile updated');
      } catch (profileError) {
        console.warn('Could not update profile:', profileError);
        // Không ảnh hưởng đến việc đặt hàng thành công
      }

      // Success
      notificationManager.success(`🎉 Đặt hàng thành công! Mã đơn: ${orderResponse}`);

      if (onOrderSuccess) {
        onOrderSuccess({
          orderId: orderResponse,
          customerId: customerId,
          total: orderSummary.total
        });
      }

      // Close after delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);

    } catch (error) {
      console.error('Order submission error:', error);
      
      // FIXED: Error messages rõ ràng, không che giấu lỗi
      let errorMessage = 'Đặt hàng thất bại';
      
      if (error.message.includes('Vui lòng đăng nhập')) {
        errorMessage = '🔐 Vui lòng đăng nhập để đặt hàng';
      } else if (error.message.includes('Giỏ hàng trống')) {
        errorMessage = '🛒 Giỏ hàng trống';
      } else if (error.message.includes('không hợp lệ')) {
        errorMessage = `📝 ${error.message}`;
      } else if (error.message.includes('User ID') && error.message.includes('does not exist')) {
        errorMessage = '👤 Tài khoản không tồn tại trong hệ thống';
      } else if (error.message.includes('Account service')) {
        errorMessage = '🔌 Không thể kết nối đến hệ thống xác thực';
      } else {
        errorMessage = `❌ ${error.message}`;
      }
      
      notificationManager.error(errorMessage);
      
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  // FIXED: Hiển thị thông báo nếu chưa đăng nhập
  if (!authService.isUserAuthenticated()) {
    return (
      <div className="enhanced-checkout">
        <div>
          <div className="checkout-header">
            <h2>🔐 Yêu cầu đăng nhập</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Vui lòng đăng nhập để thực hiện đặt hàng</p>
            <button 
              onClick={onClose}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && submitting) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>🚀 Đang xử lý đơn hàng...</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Đang xác thực với hệ thống...
        </p>
      </div>
    );
  }

  return (
    <div className="enhanced-checkout">
      <div>
        <div className="checkout-header">
          <h2>🛒 Thanh toán đơn hàng</h2>
          <button className="close-btn" onClick={onClose} disabled={submitting}>✕</button>
        </div>

        {/* Steps indicator */}
        <div className="checkout-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Thông tin</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Giao hàng</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Xác nhận</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <h3>📋 Thông tin khách hàng</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
                  ✅ Đã đăng nhập: {authService.getCurrentUser()?.email}
                </p>
                
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    value={customerInfo.ten}
                    onChange={(e) => handleInputChange('ten', e.target.value)}
                    className={errors.ten ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                    disabled={submitting}
                  />
                  {errors.ten && <span className="error-text">{errors.ten}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                      placeholder="example@email.com"
                      disabled={submitting}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      value={customerInfo.sdt}
                      onChange={(e) => handleInputChange('sdt', e.target.value)}
                      className={errors.sdt ? 'error' : ''}
                      placeholder="0987654321"
                      disabled={submitting}
                    />
                    {errors.sdt && <span className="error-text">{errors.sdt}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Địa chỉ giao hàng *</label>
                  <textarea
                    value={customerInfo.diaChi}
                    onChange={(e) => handleInputChange('diaChi', e.target.value)}
                    className={errors.diaChi ? 'error' : ''}
                    placeholder="Nhập địa chỉ chi tiết"
                    rows="3"
                    disabled={submitting}
                  />
                  {errors.diaChi && <span className="error-text">{errors.diaChi}</span>}
                </div>

                <div className="form-group">
                  <label>Ghi chú đơn hàng</label>
                  <textarea
                    value={customerInfo.ghiChu}
                    onChange={(e) => handleInputChange('ghiChu', e.target.value)}
                    placeholder="Ghi chú thêm (không bắt buộc)"
                    rows="2"
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Shipping & Payment */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <h3>🚚 Phương thức giao hàng</h3>
                
                <div className="shipping-methods">
                  {shippingMethods.map(method => (
                    <div 
                      key={method.id}
                      className={`shipping-option ${shippingMethod === method.id ? 'selected' : ''}`}
                      onClick={() => !submitting && setShippingMethod(method.id)}
                    >
                      <div className="shipping-info">
                        <div className="shipping-name">{method.name}</div>
                        <div className="shipping-time">{method.time}</div>
                      </div>
                      <div className="shipping-fee">{formatPrice(method.fee)}</div>
                    </div>
                  ))}
                </div>

                <h3>💳 Phương thức thanh toán</h3>
                
                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id}
                      className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => !submitting && setPaymentMethod(method.id)}
                    >
                      <div className="payment-icon">{method.icon}</div>
                      <div className="payment-name">{method.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <h3>✅ Xác nhận đơn hàng</h3>
                
                <div className="order-confirmation">
                  <div className="customer-summary">
                    <h4>👤 Thông tin khách hàng</h4>
                    <p><strong>ID:</strong> {authService.getCurrentUser()?.id}</p>
                    <p><strong>Họ tên:</strong> {customerInfo.ten}</p>
                    <p><strong>Email:</strong> {customerInfo.email}</p>
                    <p><strong>SĐT:</strong> {customerInfo.sdt}</p>
                    <p><strong>Địa chỉ:</strong> {customerInfo.diaChi}</p>
                    {customerInfo.ghiChu && (
                      <p><strong>Ghi chú:</strong> {customerInfo.ghiChu}</p>
                    )}
                  </div>

                  <div className="items-summary">
                    <h4>📦 Sản phẩm đặt mua</h4>
                    {cart.map(item => (
                      <div key={item.maSP} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.tenSP}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                        <div className="item-price">
                          {formatPrice(item.giaTien * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>📊 Tóm tắt đơn hàng</h3>
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(orderSummary.subtotal)}</span>
                </div>
                <div className="price-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(orderSummary.shipping)}</span>
                </div>
                <div className="price-row">
                  <span>Thuế VAT:</span>
                  <span>{formatPrice(orderSummary.tax)}</span>
                </div>
                <div className="price-row total">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(orderSummary.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="checkout-actions">
          {currentStep > 1 && (
            <button 
              className="btn-secondary" 
              onClick={handlePrevStep}
              disabled={submitting}
            >
              ← Quay lại
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              className="btn-primary" 
              onClick={handleNextStep}
              disabled={submitting}
            >
              Tiếp tục →
            </button>
          ) : (
            <button 
              className="btn-success" 
              onClick={handleSubmitOrder}
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý ⏳' : '🎉 Đặt hàng ngay'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;