import React, { useState } from "react";
import orderApiService from "../../services/api/orderApiService";

const Checkout = ({ cart, userId, onOrderSuccess }) => {
  const [message, setMessage] = useState("");

  const handleOrder = () => {
    if (!cart || cart.length === 0) {
      setMessage("Giỏ hàng trống!");
      return;
    }

    const order = {
      userId,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
    orderApiService.createOrder(order)
      .then(res => {
        setMessage("Đặt hàng thành công! Mã đơn: " + res);
        if (onOrderSuccess) onOrderSuccess();
      })
      .catch(() => setMessage("Đặt hàng thất bại!"));
  };

  return (
    <div>
      <h2>Thanh toán</h2>
      <button onClick={handleOrder}>Đặt hàng</button>
      <p>{message}</p>
    </div>
  );
};

export default Checkout; 