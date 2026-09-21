import React, { useState } from 'react';

export default function App() {
  const [carrierStatus] = useState('FEDEX / UPS CONNECTED');

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>CE-NEW-JSTS-007: Webpack 5 + Yarn Classic Monolith</h1>
      <p>Frontend: React 18 SPA built with <strong>Webpack 5 (ts-loader)</strong></p>
      <p>Package Manager: <strong>Yarn Classic (v1.22.22)</strong></p>
      <p>Logistics Gateway: <strong>{carrierStatus}</strong></p>
    </div>
  );
}
