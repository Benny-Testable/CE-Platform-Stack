import React, { useState } from 'react';
import OrderDashboard from './components/OrderDashboard';
import InvoiceViewer from './components/InvoiceViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CE-NEW-JSTS-001: React 18 + Node Express Monolith</h1>
      <p>Benchmark testbed for code analysis, duplication, and SAST detection.</p>
      
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setActiveTab('orders')} style={{ marginRight: '8px' }}>
          Orders
        </button>
        <button onClick={() => setActiveTab('invoices')}>
          Invoices
        </button>
      </div>

      {activeTab === 'orders' ? <OrderDashboard /> : <InvoiceViewer />}
    </div>
  );
}
