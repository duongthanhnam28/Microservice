import React, { useEffect, useState } from "react";

const AdminOrderList = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9004/api/v1/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="admin-order-list">
      <h2>Danh sách đơn hàng</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã ĐH</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.userId}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>{order.createdDate}</td>
              <td>
                <button onClick={() => onSelectOrder(order.orderId)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList; 