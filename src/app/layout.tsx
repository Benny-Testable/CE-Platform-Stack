import React from 'react';

export const metadata = {
  title: 'Next.js 15 Fullstack Monolith | CE-NEW-JSTS-003',
  description: 'Enterprise Next.js 15 Benchmark Application'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '24px' }}>
        <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <h2>CE-NEW-JSTS-003: Next.js 15 App Router Monolith</h2>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
