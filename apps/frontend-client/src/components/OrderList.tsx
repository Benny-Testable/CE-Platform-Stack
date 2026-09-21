import React, { useState } from 'react';

export default function OrderList() {
  const [orders] = useState([
    { id: 'MS-ORD-501', item: 'Cloud Server License', price: 799.00, status: 'PAID' },
    { id: 'MS-ORD-502', item: 'Dedicated SSL Cert', price: 149.00, status: 'PENDING_PAYMENT' }
  ]);

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '16px', borderRadius: '6px' }}>
      <h3>Active Microservice Orders</h3>
      <ul>
        {orders.map(o => (
          <li key={o.id} style={{ margin: '8px 0' }}>
            <strong>{o.id}</strong>: {o.item} - ${o.price.toFixed(2)} [{o.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}
