'use client';

import React from 'react';

export default function NoticeWidget({ initialHtml }: { initialHtml: string }) {
  // CWE-79 XSS Benchmark Fixture
  return (
    <div style={{ background: '#f0fdf4', padding: '12px', border: '1px solid #bbf7d0', borderRadius: '4px' }}>
      <div dangerouslySetInnerHTML={{ __html: initialHtml }} />
    </div>
  );
}
