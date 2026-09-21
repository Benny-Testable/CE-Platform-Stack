import React from 'react';
import CartWidget from '../components/CartWidget';
import RichComment from '../components/RichComment';

export default function HomePage() {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Dashboard & Server Actions</h3>
      <p>Architecture: Next.js 15 App Router Fullstack Monolith with Turbopack</p>
      <CartWidget />
      <RichComment initialComment="<b>Notice:</b> System maintenance scheduled at 02:00 UTC" />
    </div>
  );
}
