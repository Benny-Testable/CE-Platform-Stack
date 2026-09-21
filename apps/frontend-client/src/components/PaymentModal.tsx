import React from 'react';

export default function PaymentModal() {
  return (
    <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '4px' }}>
      <h4>gRPC Payment Gateway Status</h4>
      <p>Status: <span style={{ color: '#16a34a', fontWeight: 'bold' }}>CONNECTED (grpc://payment-service:50051)</span></p>
    </div>
  );
}
