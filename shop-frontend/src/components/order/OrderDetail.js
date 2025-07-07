import React, { useEffect, useState } from "react";
import orderApiService from "../../services/api/orderApiService";

const OrderDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      orderApiService.getOrderById(orderId).then(setOrder);
    }
  }, [orderId]);

  if (!order) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>Chi tiết đơn hàng #{order.orderId}</h2>
      <p>Tổng tiền: {order.total}</p>
      <p>Trạng thái: {order.status}</p>
      {/* Hiển thị thêm các trường khác nếu có */}
      {/* Nếu order có mảng items, hiển thị danh sách sản phẩm */}
      {order.items && (
        <div>
          <h3>Sản phẩm:</h3>
          <ul>
            {order.items.map(item => (
              <li key={item.productId}>
                Mã SP: {item.productId} - Số lượng: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetail; 