import React from 'react';
import OrderList from './components/OrderList';
import PaymentModal from './components/PaymentModal';

export default function App() {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>CE-NEW-JSTS-002: Microservices Frontend</h1>
      <p>Topology: React SPA (Vite) + Order Service (REST) + Payment Service (gRPC)</p>
      <OrderList />
      <PaymentModal />
    </div>
  );
}
