import React, { useState } from 'react';

export default function App() {
  const [fastifyStatus] = useState('ONLINE');

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>CE-NEW-JSTS-005: Rspack (Rust) + Fastify Monolith</h1>
      <p>Frontend: React 18 SPA built with <strong>Rspack 1.0 (Rust)</strong></p>
      <p>Backend: Node Fastify API (Status: <strong>{fastifyStatus}</strong>)</p>
    </div>
  );
}
