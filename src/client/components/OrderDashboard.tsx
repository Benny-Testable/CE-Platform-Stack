import React, { useEffect, useState } from 'react';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
}

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulated fetch or fallback
    setOrders([
      { id: 'ORD-101', customer: 'Acme Corp', amount: 1250.5, status: 'COMPLETED' },
      { id: 'ORD-102', customer: 'Globex Inc', amount: 480.0, status: 'PENDING' },
      { id: 'ORD-103', customer: 'Soylent Ltd', amount: 9400.0, status: 'PROCESSING' }
    ]);
  }, []);

  return (
    <div>
      <h2>Order Management Dashboard</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount ($)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.amount.toFixed(2)}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
