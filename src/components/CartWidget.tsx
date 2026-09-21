'use client';

import React, { useState } from 'react';

export default function CartWidget() {
  const [items, setItems] = useState([
    { id: '1', name: 'Enterprise Cloud Instance', price: 299 },
    { id: '2', name: 'Premium Support Addon', price: 99 }
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
      <h4>Active Cart (Client Component)</h4>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <p><strong>Subtotal: ${total}</strong></p>
    </div>
  );
}
