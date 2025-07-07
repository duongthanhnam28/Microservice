import React, { useEffect, useState } from "react";
import orderApiService from "../../services/api/orderApiService";

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userId) {
      orderApiService.getOrdersByUser(userId).then(setOrders);
    }
  }, [userId]);

  const handleCancel = (id) => {
    orderApiService.cancelOrder(id).then(() => {
      setOrders(orders.filter(order => order.orderId !== id));
    });
  };

  return (
    <div>
      <h2>Đơn hàng của tôi</h2>
      <ul>
        {orders.map(order => (
          <li key={order.orderId}>
            Mã: {order.orderId} - Tổng tiền: {order.total} - Trạng thái: {order.status}
            <button onClick={() => handleCancel(order.orderId)}>Hủy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList; 