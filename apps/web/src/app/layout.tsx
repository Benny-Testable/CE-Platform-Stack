import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <h2>Turborepo: Next.js 15 Web App</h2>
        <main>{children}</main>
      </body>
    </html>
  );
}
